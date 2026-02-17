'use client';

import { useReportWebVitals } from 'next/web-vitals';

export default function WebVitals() {
  useReportWebVitals((metric) => {
    console.log('📊 Web Vital:', metric);
    
    // ارسال به یک API برای ذخیره‌سازی
    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType,
      timestamp: new Date().toISOString()
    });

    fetch('/api/metrics', {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/json' }
    }).catch(err => console.error('Failed to send metrics:', err));
  });

  return null;
}