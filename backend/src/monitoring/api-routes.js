const express = require('express');
const router = express.Router();
const os = require('os');
const process = require('process');
const DatabaseMonitor = require('./db-monitor');

// ایجاد یک نمونه از مانیتور (باید در app.js ساخته شود)
let performanceMonitor;

// مقداردهی اولیه مانیتور عملکرد
const init = (monitor) => {
  performanceMonitor = monitor;
};

// ایجاد نمونه دیتابیس مانیتور
const dbMonitor = new DatabaseMonitor();

// ==================== وضعیت سلامت سرور ====================
router.get('/health', (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    status: 'healthy',
    services: {
      api: 'up',
      database: 'checking...',
    }
  };
  
  try {
    // بررسی اتصال به دیتابیس (اختیاری)
    res.json(healthcheck);
  } catch (error) {
    healthcheck.message = error.message;
    healthcheck.status = 'unhealthy';
    res.status(503).json(healthcheck);
  }
});

// ==================== متریک‌های لحظه‌ای سرور ====================
router.get('/metrics', (req, res) => {
  const memUsage = process.memoryUsage();
  const cpuUsage = process.cpuUsage();
  const loadAvg = os.loadavg();
  const networkInterfaces = os.networkInterfaces();
  
  // محاسبه درصد استفاده از CPU
  const totalCpu = (cpuUsage.user + cpuUsage.system) / 1000; // تبدیل به میلی‌ثانیه
  const cpuPercent = (totalCpu / (os.cpus().length * 1000)) * 100;
  
  // محاسبه درصد استفاده از حافظه
  const heapUsedPercent = ((memUsage.heapUsed / memUsage.heapTotal) * 100).toFixed(1);
  
  // اطلاعات شبکه
  const ipAddresses = [];
  Object.keys(networkInterfaces).forEach(interfaceName => {
    networkInterfaces[interfaceName].forEach(iface => {
      if (!iface.internal && iface.family === 'IPv4') {
        ipAddresses.push({
          interface: interfaceName,
          address: iface.address,
          mac: iface.mac,
        });
      }
    });
  });

  res.json({
    timestamp: new Date().toISOString(),
    process: {
      pid: process.pid,
      uptime: {
        seconds: Math.round(process.uptime()),
        minutes: Math.round(process.uptime() / 60),
        hours: Math.round(process.uptime() / 3600),
        days: Math.round(process.uptime() / 86400),
        human: `${Math.floor(process.uptime() / 86400)}d ${Math.floor((process.uptime() % 86400) / 3600)}h ${Math.floor((process.uptime() % 3600) / 60)}m`,
      },
      version: process.version,
      platform: process.platform,
      arch: process.arch,
      nodeEnv: process.env.NODE_ENV || 'development',
    },
    memory: {
      rss: {
        bytes: memUsage.rss,
        mb: `${Math.round(memUsage.rss / 1024 / 1024)} MB`,
        gb: (memUsage.rss / 1024 / 1024 / 1024).toFixed(2),
      },
      heapTotal: {
        bytes: memUsage.heapTotal,
        mb: `${Math.round(memUsage.heapTotal / 1024 / 1024)} MB`,
        gb: (memUsage.heapTotal / 1024 / 1024 / 1024).toFixed(2),
      },
      heapUsed: {
        bytes: memUsage.heapUsed,
        mb: `${Math.round(memUsage.heapUsed / 1024 / 1024)} MB`,
        gb: (memUsage.heapUsed / 1024 / 1024 / 1024).toFixed(2),
      },
      external: {
        bytes: memUsage.external,
        mb: `${Math.round(memUsage.external / 1024 / 1024)} MB`,
        gb: (memUsage.external / 1024 / 1024 / 1024).toFixed(2),
      },
      arrayBuffers: memUsage.arrayBuffers ? {
        bytes: memUsage.arrayBuffers,
        mb: `${Math.round(memUsage.arrayBuffers / 1024 / 1024)} MB`,
      } : null,
      heapUsedPercent: `${heapUsedPercent}%`,
      status: parseFloat(heapUsedPercent) > 80 ? 'warning' : 'healthy',
    },
    cpu: {
      user: `${(cpuUsage.user / 1000).toFixed(2)} ms`,
      system: `${(cpuUsage.system / 1000).toFixed(2)} ms`,
      total: `${totalCpu.toFixed(2)} ms`,
      percent: cpuPercent.toFixed(2) + '%',
      loadAverage: {
        '1m': loadAvg[0].toFixed(2),
        '5m': loadAvg[1].toFixed(2),
        '15m': loadAvg[2].toFixed(2),
      },
      cpus: os.cpus().map(cpu => ({
        model: cpu.model,
        speed: cpu.speed + ' MHz',
        times: cpu.times,
      })),
      cores: os.cpus().length,
    },
    system: {
      hostname: os.hostname(),
      platform: os.platform(),
      arch: os.arch(),
      release: os.release(),
      cpus: os.cpus().length,
      totalMemory: {
        bytes: os.totalmem(),
        mb: `${Math.round(os.totalmem() / 1024 / 1024)} MB`,
        gb: (os.totalmem() / 1024 / 1024 / 1024).toFixed(2),
      },
      freeMemory: {
        bytes: os.freemem(),
        mb: `${Math.round(os.freemem() / 1024 / 1024)} MB`,
        gb: (os.freemem() / 1024 / 1024 / 1024).toFixed(2),
      },
      usedMemory: {
        bytes: os.totalmem() - os.freemem(),
        mb: `${Math.round((os.totalmem() - os.freemem()) / 1024 / 1024)} MB`,
        percent: ((os.totalmem() - os.freemem()) / os.totalmem() * 100).toFixed(1) + '%',
      },
      uptime: {
        seconds: os.uptime(),
        minutes: Math.round(os.uptime() / 60),
        hours: Math.round(os.uptime() / 3600),
        days: Math.round(os.uptime() / 86400),
        human: `${Math.floor(os.uptime() / 86400)}d ${Math.floor((os.uptime() % 86400) / 3600)}h ${Math.floor((os.uptime() % 3600) / 60)}m`,
      },
    },
    network: {
      interfaces: ipAddresses,
      hostname: os.hostname(),
    },
    recentRequests: performanceMonitor ? performanceMonitor.metrics.requests.slice(-10) : [],
    eventLoopLags: performanceMonitor ? performanceMonitor.metrics.eventLoop.slice(-10) : [],
  });
});

// ==================== گزارش کامل ====================
router.get('/report', (req, res) => {
  if (!performanceMonitor) {
    return res.status(404).json({ error: 'مانیتور فعال نیست' });
  }
  
  try {
    const report = performanceMonitor.saveReport();
    res.json({
      success: true,
      message: 'گزارش با موفقیت ذخیره شد',
      filename: report,
      path: `/reports/${report}`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'خطا در ذخیره گزارش: ' + error.message 
    });
  }
});

// ==================== متریک‌های خلاصه ====================
router.get('/summary', (req, res) => {
  if (!performanceMonitor) {
    return res.status(404).json({ error: 'مانیتور فعال نیست' });
  }
  
  const latest = performanceMonitor.getLatestMetrics();
  
  res.json({
    timestamp: new Date().toISOString(),
    summary: {
      totalRequests: latest.totalRequests,
      avgResponseTime: latest.recentRequests.reduce((acc, req) => 
        acc + parseInt(req.duration), 0) / (latest.recentRequests.length || 1),
      memoryUsage: latest.memory?.heapUsed,
      cpuLoad: latest.cpu?.loadAvg1,
      eventLoopLag: latest.eventLoopLags.length > 0 
        ? latest.eventLoopLags[latest.eventLoopLags.length - 1].lag 
        : 0,
    },
  });
});

// ==================== وضعیت دیتابیس ====================
router.get('/database', async (req, res) => {
  try {
    const status = await dbMonitor.getDatabaseStatus();
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      ...status,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// ==================== حجم جداول دیتابیس ====================
router.get('/database/tables', async (req, res) => {
  try {
    const tables = await dbMonitor.getTableSizes();
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      ...tables,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// ==================== پروسس‌های فعال دیتابیس ====================
router.get('/database/processes', async (req, res) => {
  try {
    const processes = await dbMonitor.getProcessList();
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      total: processes.length,
      processes: processes,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// ==================== کوئری‌های کند دیتابیس ====================
router.get('/database/slow-queries', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const slowQueries = await dbMonitor.getSlowQueries(limit);
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      limit,
      count: slowQueries.length,
      slowQueries: slowQueries,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// ==================== وضعیت اتصال دیتابیس ====================
router.get('/database/connection', async (req, res) => {
  try {
    const sequelize = require('../config/database');
    await sequelize.authenticate();
    
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      status: 'connected',
      message: 'اتصال به دیتابیس برقرار است',
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      status: 'disconnected',
      error: error.message 
    });
  }
});

// ==================== وضعیت همه سرویس‌ها ====================
router.get('/status', async (req, res) => {
  const status = {
    timestamp: new Date().toISOString(),
    services: {
      api: { status: 'checking' },
      database: { status: 'checking' },
      memory: { status: 'checking' },
      cpu: { status: 'checking' },
    }
  };
  
  try {
    // بررسی API
    status.services.api = {
      status: 'healthy',
      uptime: process.uptime(),
    };
    
    // بررسی دیتابیس
    try {
      const sequelize = require('../config/database');
      await sequelize.authenticate();
      status.services.database = {
        status: 'healthy',
        message: 'اتصال برقرار است',
      };
    } catch (dbError) {
      status.services.database = {
        status: 'unhealthy',
        error: dbError.message,
      };
    }
    
    // بررسی حافظه
    const memUsage = process.memoryUsage();
    const heapUsedPercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;
    status.services.memory = {
      status: heapUsedPercent > 80 ? 'warning' : 'healthy',
      used: `${Math.round(memUsage.heapUsed / 1024 / 1024)} MB`,
      total: `${Math.round(memUsage.heapTotal / 1024 / 1024)} MB`,
      percent: heapUsedPercent.toFixed(1) + '%',
    };
    
    // بررسی CPU
    const loadAvg = os.loadavg();
    status.services.cpu = {
      status: loadAvg[0] > os.cpus().length * 0.7 ? 'warning' : 'healthy',
      load1: loadAvg[0].toFixed(2),
      cores: os.cpus().length,
    };
    
    res.json(status);
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// ==================== پاک کردن لاگ‌های قدیمی ====================
router.post('/cleanup', (req, res) => {
  if (!performanceMonitor) {
    return res.status(404).json({ error: 'مانیتور فعال نیست' });
  }
  
  try {
    // نگه داشتن فقط ۱۰۰۰ درخواست آخر
    if (performanceMonitor.metrics.requests.length > 1000) {
      performanceMonitor.metrics.requests = performanceMonitor.metrics.requests.slice(-1000);
    }
    
    // نگه داشتن فقط ۱۰۰ متریک آخر
    if (performanceMonitor.metrics.timestamp.length > 100) {
      performanceMonitor.metrics.timestamp = performanceMonitor.metrics.timestamp.slice(-100);
      performanceMonitor.metrics.cpu = performanceMonitor.metrics.cpu.slice(-100);
      performanceMonitor.metrics.memory = performanceMonitor.metrics.memory.slice(-100);
    }
    
    res.json({
      success: true,
      message: 'پاکسازی با موفقیت انجام شد',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

module.exports = { router, init };