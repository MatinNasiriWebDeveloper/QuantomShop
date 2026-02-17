const os = require('os');
const process = require('process');
const { performance, PerformanceObserver } = require('perf_hooks');
const express = require('express');
const fs = require('fs');
const path = require('path');

class PerformanceMonitor {
  constructor(options = {}) {
    this.logInterval = options.logInterval || 30000; // ۳۰ ثانیه
    this.slowThreshold = options.slowThreshold || 1000; // ۱ ثانیه
    this.metrics = {
      cpu: [],
      memory: [],
      eventLoop: [],
      requests: [],
      timestamp: [],
    };
    
    this.setupPerformanceObserver();
    this.startMonitoring();
  }
  
  setupPerformanceObserver() {
    const obs = new PerformanceObserver((items) => {
      items.getEntries().forEach((entry) => {
        if (entry.duration > this.slowThreshold) {
          console.warn(`⚠️ عملیات کند: ${entry.name}`, {
            duration: `${entry.duration.toFixed(2)}ms`,
            entryType: entry.entryType,
          });
        }
      });
    });
    obs.observe({ entryTypes: ['measure', 'function'] });
  }
  
  startMonitoring() {
    // مانیتورینگ event loop lag
    let lastCheck = Date.now();
    setInterval(() => {
      const now = Date.now();
      const lag = now - lastCheck - 1000;
      
      if (lag > 100) {
        console.warn(`⚠️ تاخیر Event Loop: ${lag}ms`);
        this.metrics.eventLoop.push({ time: now, lag });
      }
      
      lastCheck = now;
    }, 1000);
    
    // مانیتورینگ مصرف حافظه و CPU
    setInterval(() => {
      const memUsage = process.memoryUsage();
      const cpuUsage = process.cpuUsage();
      const loadAvg = os.loadavg();
      
      const metrics = {
        timestamp: Date.now(),
        memory: {
          rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
          heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
          heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
          external: `${Math.round(memUsage.external / 1024 / 1024)}MB`,
        },
        cpu: {
          user: `${(cpuUsage.user / 1000).toFixed(2)}ms`,
          system: `${(cpuUsage.system / 1000).toFixed(2)}ms`,
          loadAvg1: loadAvg[0].toFixed(2),
          loadAvg5: loadAvg[1].toFixed(2),
          loadAvg15: loadAvg[2].toFixed(2),
        },
        system: {
          totalMemory: `${Math.round(os.totalmem() / 1024 / 1024)}MB`,
          freeMemory: `${Math.round(os.freemem() / 1024 / 1024)}MB`,
          uptime: `${Math.round(os.uptime() / 60)} دقیقه`,
          cpus: os.cpus().length,
        }
      };
      
      // ذخیره متریک‌ها
      this.metrics.cpu.push(metrics.cpu);
      this.metrics.memory.push(metrics.memory);
      this.metrics.timestamp.push(metrics.timestamp);
      
      // نمایش هر ۵ دقیقه یکبار
      if (this.metrics.timestamp.length % 10 === 0) {
        console.log('📊 وضعیت سرور:', metrics);
      }
      
      // بررسی آستانه‌های بحرانی
      const heapUsedMB = memUsage.heapUsed / 1024 / 1024;
      if (heapUsedMB > 1024) { // بیش از ۱ گیگابایت
        console.error('🚨 هشدار: مصرف حافظه بالا!', `${heapUsedMB.toFixed(0)}MB`);
      }
      
      if (loadAvg[0] > os.cpus().length * 0.7) {
        console.warn('⚠️ هشدار: بار CPU بالا!', loadAvg[0].toFixed(2));
      }
    }, this.logInterval);
  }
  
  // اندازه‌گیری زمان اجرای یک تابع
  async measure(operationName, fn) {
    performance.mark(`${operationName}-start`);
    
    try {
      const result = await fn();
      performance.mark(`${operationName}-end`);
      performance.measure(operationName, `${operationName}-start`, `${operationName}-end`);
      return result;
    } catch (error) {
      console.error(`❌ خطا در ${operationName}:`, error);
      throw error;
    }
  }
  
  // ثبت درخواست HTTP
  recordRequest(req, res, duration) {
    this.metrics.requests.push({
      timestamp: Date.now(),
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });
    
    // نمایش درخواست‌های کند
    if (duration > 1000) {
      console.warn(`⚠️ درخواست کند: ${req.method} ${req.path}`, {
        duration: `${duration}ms`,
        status: res.statusCode,
      });
    }
  }
  
  // میدلور express برای مانیتورینگ خودکار
  middleware() {
    return (req, res, next) => {
      const start = Date.now();
      
      res.on('finish', () => {
        const duration = Date.now() - start;
        this.recordRequest(req, res, duration);
      });
      
      next();
    };
  }
  
  // گرفتن آخرین متریک‌ها
  getLatestMetrics() {
    const lastIndex = this.metrics.timestamp.length - 1;
    
    return {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: this.metrics.memory[lastIndex] || null,
      cpu: this.metrics.cpu[lastIndex] || null,
      totalRequests: this.metrics.requests.length,
      recentRequests: this.metrics.requests.slice(-10),
      eventLoopLags: this.metrics.eventLoop.slice(-10),
    };
  }
  
  // ذخیره گزارش در فایل
  saveReport() {
    const report = {
      generated: new Date().toISOString(),
      summary: {
        totalRequests: this.metrics.requests.length,
        avgCpu: this.calculateAverage(this.metrics.cpu.map(c => parseFloat(c.user))),
        avgMemory: this.calculateAverage(this.metrics.memory.map(m => parseInt(m.heapUsed))),
        peakMemory: Math.max(...this.metrics.memory.map(m => parseInt(m.heapUsed))),
      },
      metrics: this.metrics,
    };
    
    const filename = `monitor-report-${Date.now()}.json`;
    fs.writeFileSync(
      path.join(__dirname, '../../reports', filename),
      JSON.stringify(report, null, 2)
    );
    
    return filename;
  }
  
  calculateAverage(arr) {
    if (arr.length === 0) return 0;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  }
}

module.exports = PerformanceMonitor;