const os = require('os');
const fs = require('fs');
const path = require('path');

class PerformanceMonitor {
  constructor(interval = 5000) {
    this.interval = interval;
    this.metrics = [];
    this.startTime = Date.now();
  }

  getCPUUsage() {
    const cpus = os.cpus();
    let totalIdle = 0;
    let totalTick = 0;

    cpus.forEach(cpu => {
      for (let type in cpu.times) {
        totalTick += cpu.times[type];
      }
      totalIdle += cpu.times.idle;
    });

    return {
      usage: ((totalTick - totalIdle) / totalTick) * 100,
      cores: cpus.length
    };
  }

  getMemoryUsage() {
    const total = os.totalmem();
    const free = os.freemem();
    const used = total - free;

    return {
      total: (total / 1024 / 1024 / 1024).toFixed(2) + ' GB',
      used: (used / 1024 / 1024 / 1024).toFixed(2) + ' GB',
      free: (free / 1024 / 1024 / 1024).toFixed(2) + ' GB',
      usagePercent: ((used / total) * 100).toFixed(2) + '%'
    };
  }

  getProcessMemory() {
    const memoryUsage = process.memoryUsage();
    return {
      rss: (memoryUsage.rss / 1024 / 1024).toFixed(2) + ' MB',
      heapTotal: (memoryUsage.heapTotal / 1024 / 1024).toFixed(2) + ' MB',
      heapUsed: (memoryUsage.heapUsed / 1024 / 1024).toFixed(2) + ' MB',
      external: (memoryUsage.external / 1024 / 1024).toFixed(2) + ' MB'
    };
  }

  getSystemInfo() {
    return {
      hostname: os.hostname(),
      platform: os.platform(),
      arch: os.arch(),
      release: os.release(),
      uptime: (os.uptime() / 3600).toFixed(2) + ' hours',
      loadAverage: os.loadavg().map(load => load.toFixed(2)).join(', ')
    };
  }

  collectMetrics() {
    const metrics = {
      timestamp: new Date().toISOString(),
      uptime: (Date.now() - this.startTime) / 1000 + ' seconds',
      cpu: this.getCPUUsage(),
      systemMemory: this.getMemoryUsage(),
      processMemory: this.getProcessMemory(),
      system: this.getSystemInfo()
    };

    this.metrics.push(metrics);
    
    // ذخیره در فایل
    this.saveToFile(metrics);
    
    // نمایش در کنسول
    console.log('\n📊 Performance Metrics:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`⏰ Time: ${metrics.timestamp}`);
    console.log(`⚙️  CPU Usage: ${metrics.cpu.usage.toFixed(2)}% (${metrics.cpu.cores} cores)`);
    console.log(`💾 Process Memory:`);
    console.log(`   - RSS: ${metrics.processMemory.rss}`);
    console.log(`   - Heap Used: ${metrics.processMemory.heapUsed}`);
    console.log(`   - Heap Total: ${metrics.processMemory.heapTotal}`);
    console.log(`🖥️  System Memory:`);
    console.log(`   - Total: ${metrics.systemMemory.total}`);
    console.log(`   - Used: ${metrics.systemMemory.used}`);
    console.log(`   - Free: ${metrics.systemMemory.free}`);
    console.log(`   - Usage: ${metrics.systemMemory.usagePercent}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    return metrics;
  }

  saveToFile(metrics) {
    const logPath = path.join(__dirname, '../../logs/performance.json');
    
    // اطمینان از وجود پوشه logs
    const logDir = path.dirname(logPath);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    // خوندن لاگ‌های قبلی
    let existingLogs = [];
    try {
      const data = fs.readFileSync(logPath, 'utf8');
      existingLogs = JSON.parse(data);
    } catch {
      existingLogs = [];
    }

    // اضافه کردن متریک جدید
    existingLogs.push(metrics);

    // نگه داشتن فقط ۱۰۰۰ لاگ آخر
    if (existingLogs.length > 1000) {
      existingLogs = existingLogs.slice(-1000);
    }

    // ذخیره در فایل
    fs.writeFileSync(logPath, JSON.stringify(existingLogs, null, 2));
  }

  start() {
    console.log('🚀 Starting Performance Monitor...');
    console.log(`📊 Collecting metrics every ${this.interval/1000} seconds\n`);
    
    // جمع‌آوری اولیه
    this.collectMetrics();

    // جمع‌آوری دوره‌ای
    setInterval(() => {
      this.collectMetrics();
    }, this.interval);
  }

  getMetricsHistory() {
    return this.metrics;
  }
}

module.exports = PerformanceMonitor;