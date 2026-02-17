const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database');
const typeDefs = require('./graphql/schemas');
const resolvers = require('./graphql/resolvers');
const uploadRoutes = require('./routes/upload');
const PerformanceMonitor = require('./monitor');
// const { metricsMiddleware, metricsRouter } = require('./monitor-prometheus');
require('dotenv').config();

async function startServer() {
  const app = express();
  
  // ========== میدل‌ویرها ==========
  app.use(cors());
  app.use(express.json());
  app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

  // ========== مانیتورینگ با Prometheus ==========
  // این میدل‌ویر باید قبل از همه Routeها باشه
  // app.use(metricsMiddleware);
  
  // مسیر متریک‌ها برای Prometheus (مهم: باید قبل از Routeهای دیگه باشه)
  // app.use(metricsRouter);

  // ========== مانیتورینگ داخلی (Performance Monitor) ==========
  console.log('🚀 راه‌اندازی مانیتورینگ عملکرد...');
  const monitor = new PerformanceMonitor(10000); // هر ۱۰ ثانیه یکبار
  monitor.start();

  // مسیر دریافت متریک‌های داخلی
  app.get('/api/performance', (req, res) => {
    try {
      const metrics = monitor.getMetricsHistory();
      const lastMetric = metrics[metrics.length - 1] || null;
      
      // اگه هیچ متریکی وجود نداره، یه نمونه تست برگردون
      if (!lastMetric) {
        return res.json({
          totalMetrics: 0,
          uptime: '0 seconds',
          currentCPU: '0%',
          currentMemory: '0%',
          processMemory: {
            rss: '0 MB',
            heapUsed: '0 MB',
            heapTotal: '0 MB',
            external: '0 MB'
          },
          system: {
            hostname: 'localhost',
            platform: process.platform,
            arch: process.arch,
            loadAverage: '0, 0, 0'
          },
          history: []
        });
      }
      
      // آمار خلاصه
      const summary = {
        totalMetrics: metrics.length,
        uptime: lastMetric.uptime || '0 seconds',
        currentCPU: lastMetric.cpu?.usage?.toFixed(2) + '%' || '0%',
        currentMemory: lastMetric.systemMemory?.usagePercent || '0%',
        processMemory: lastMetric.processMemory || {},
        system: lastMetric.system || {},
        history: metrics.slice(-20) // آخرین ۲۰ متریک
      };
      
      console.log('📊 Sending metrics:', summary.currentCPU, summary.currentMemory);
      res.json(summary);
    } catch (error) {
      console.error('❌ خطا در دریافت متریک‌ها:', error);
      res.status(500).json({ error: 'خطا در دریافت متریک‌ها' });
    }
  });

  // مسیر دریافت آخرین متریک
  app.get('/api/performance/latest', (req, res) => {
    try {
      const metrics = monitor.getMetricsHistory();
      const latest = metrics[metrics.length - 1] || null;
      res.json(latest);
    } catch (error) {
      res.status(500).json({ error: 'خطا در دریافت آخرین متریک' });
    }
  });

  // مسیر دریافت تاریخچه کامل
  app.get('/api/performance/history', (req, res) => {
    try {
      const metrics = monitor.getMetricsHistory();
      const limit = parseInt(req.query.limit) || 100;
      res.json(metrics.slice(-limit));
    } catch (error) {
      res.status(500).json({ error: 'خطا در دریافت تاریخچه' });
    }
  });

  // ========== مسیرهای آپلود ==========
  app.use('/api/upload', uploadRoutes);

  // ========== Apollo Server ==========
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({
      token: req.headers.authorization || ''
    }),
    formatError: (err) => {
      console.error('❌ GraphQL Error:', err);
      return {
        message: err.message,
        code: err.extensions?.code || 'INTERNAL_SERVER_ERROR',
        path: err.path
      };
    }
  });

  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  // ========== مسیر تست ==========
  app.get('/', (req, res) => {
    res.json({
      message: '🚀 QuantomShop API is running',
      version: '1.0.0',
      endpoints: {
        graphql: 'http://localhost:4000/graphql',
        prometheusMetrics: 'http://localhost:4000/metrics',
        performance: 'http://localhost:4000/api/performance',
        upload: 'http://localhost:4000/api/upload/avatar'
      },
      status: {
        database: sequelize.authenticate() ? '✅ connected' : '❌ disconnected',
        monitoring: '✅ active',
        prometheus: '✅ ready'
      }
    });
  });

  // ========== اتصال به دیتابیس و راه‌اندازی سرور ==========
  const PORT = process.env.PORT || 4000;

  try {
    await sequelize.authenticate();
    console.log('✅ اتصال به دیتابیس با موفقیت برقرار شد');

    await sequelize.sync({ alter: true });
    console.log('✅ همگام‌سازی دیتابیس انجام شد');

    app.listen(PORT, () => {
      console.log('\n🚀 ===== سرور با موفقیت راه‌اندازی شد =====');
      console.log(`📡 پورت: ${PORT}`);
      console.log(`🔗 GraphQL: http://localhost:${PORT}${server.graphqlPath}`);
      console.log(`📊 Prometheus Metrics: http://localhost:${PORT}/metrics`);
      console.log(`📈 Performance Dashboard: http://localhost:${PORT}/api/performance`);
      console.log(`📤 آپلود: http://localhost:${PORT}/api/upload/avatar`);
      console.log('=====================================\n');
    });
  } catch (error) {
    console.error('❌ خطا در اتصال به دیتابیس:', error);
    process.exit(1);
  }

  // ========== مدیریت خطاهای پیش‌بینی نشده ==========
  process.on('uncaughtException', (error) => {
    console.error('❌ خطای پیش‌بینی نشده:', error);
    if (monitor && monitor.saveToFile) {
      monitor.saveToFile({
        type: 'uncaughtException',
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
    }
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Promise رد شده:', reason);
    if (monitor && monitor.saveToFile) {
      monitor.saveToFile({
        type: 'unhandledRejection',
        reason: reason,
        promise: promise,
        timestamp: new Date().toISOString()
      });
    }
  });

  return app;
}

// ========== راه‌اندازی سرور ==========
if (require.main === module) {
  startServer().catch(error => {
    console.error('❌ خطا در راه‌اندازی سرور:', error);
    process.exit(1);
  });
}

module.exports = startServer;