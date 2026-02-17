const sequelize = require('../config/database');
const { QueryTypes } = require('sequelize');

class DatabaseMonitor {
  async getDatabaseStatus() {
    try {
      // لیست دیتابیس‌ها
      const databases = await sequelize.query('SHOW DATABASES', {
        type: QueryTypes.SHOWDATABASES,
      });
      
      // وضعیت سرور
      const status = await sequelize.query('SHOW GLOBAL STATUS', {
        type: QueryTypes.SELECT,
      });
      
      // متغیرهای سرور
      const variables = await sequelize.query('SHOW GLOBAL VARIABLES', {
        type: QueryTypes.SELECT,
      });
      
      // پردازش متریک‌های مهم
      const metrics = {};
      
      status.forEach(item => {
        if ([
          'Threads_connected',
          'Threads_running',
          'Connections',
          'Max_used_connections',
          'Questions',
          'Slow_queries',
          'Uptime',
          'Innodb_buffer_pool_reads',
          'Innodb_buffer_pool_read_requests',
          'Created_tmp_disk_tables',
          'Created_tmp_tables',
        ].includes(item.Variable_name)) {
          metrics[item.Variable_name] = item.Value;
        }
      });
      
      variables.forEach(item => {
        if ([
          'max_connections',
          'innodb_buffer_pool_size',
          'query_cache_size',
          'tmp_table_size',
          'max_heap_table_size',
        ].includes(item.Variable_name)) {
          metrics[item.Variable_name] = item.Value;
        }
      });
      
      // محاسبه درصد استفاده از Connection Pool
      metrics.connection_usage_percent = 
        ((metrics.Threads_connected / metrics.max_connections) * 100).toFixed(1);
      
      // محاسبه Cache Hit Ratio
      if (metrics.Innodb_buffer_pool_read_requests > 0) {
        metrics.buffer_pool_hit_ratio = (
          (1 - (metrics.Innodb_buffer_pool_reads / 
           metrics.Innodb_buffer_pool_read_requests)) * 100
        ).toFixed(1);
      }
      
      return {
        timestamp: new Date().toISOString(),
        databases: databases.map(db => Object.values(db)[0]),
        metrics,
      };
    } catch (error) {
      console.error('❌ خطا در مانیتورینگ دیتابیس:', error);
      return { error: error.message };
    }
  }
  
  async getSlowQueries(limit = 10) {
    try {
      const slowQueries = await sequelize.query(`
        SELECT * FROM mysql.slow_log 
        ORDER BY start_time DESC 
        LIMIT ${limit}
      `, { type: QueryTypes.SELECT });
      
      return slowQueries;
    } catch (error) {
      // اگر slow log فعال نباشد
      console.log('⚠️ slow log غیرفعال است');
      return [];
    }
  }
  
  async getTableSizes() {
    try {
      const tables = await sequelize.query(`
        SELECT 
          table_name,
          ROUND(((data_length + index_length) / 1024 / 1024), 2) AS size_mb,
          ROUND(data_length / 1024 / 1024, 2) AS data_mb,
          ROUND(index_length / 1024 / 1024, 2) AS index_mb,
          table_rows,
          engine
        FROM information_schema.tables
        WHERE table_schema = '${process.env.DB_NAME}'
        ORDER BY (data_length + index_length) DESC
      `, { type: QueryTypes.SELECT });
      
      const totalSize = tables.reduce((sum, t) => sum + parseFloat(t.size_mb), 0);
      
      return {
        tables,
        totalSize: `${totalSize.toFixed(2)} MB`,
      };
    } catch (error) {
      console.error('❌ خطا در دریافت حجم جداول:', error);
      return { error: error.message };
    }
  }
  
  async getProcessList() {
    try {
      const processes = await sequelize.query('SHOW FULL PROCESSLIST', {
        type: QueryTypes.SELECT,
      });
      
      return processes.filter(p => p.Command !== 'Sleep');
    } catch (error) {
      console.error('❌ خطا در دریافت process list:', error);
      return [];
    }
  }
}

module.exports = DatabaseMonitor;