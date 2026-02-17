import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const metric = await request.json();
    
    // ذخیره در دیتابیس مانیتورینگ
    console.log('📈 Web Vitals Received:', {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      navigationType: metric.navigationType,
    });
    
    // بررسی آستانه‌های هشدار
    const thresholds = {
      LCP: 2500, // Largest Contentful Paint - حداکثر ۲.۵ ثانیه
      FID: 100,  // First Input Delay - حداکثر ۱۰۰ میلی‌ثانیه
      CLS: 0.1,  // Cumulative Layout Shift - حداکثر ۰.۱
      FCP: 1800, // First Contentful Paint - حداکثر ۱.۸ ثانیه
      TTFB: 600, // Time to First Byte - حداکثر ۶۰۰ میلی‌ثانیه
    };
    
    if (thresholds[metric.name] && metric.value > thresholds[metric.name]) {
      console.warn(`⚠️ هشدار: ${metric.name} از حد مجاز فراتر رفت`, {
        value: metric.value,
        threshold: thresholds[metric.name],
        rating: metric.rating,
      });
      
      // ارسال هشدار (تلگرام/ایمیل)
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'خطا در پردازش' }, { status: 500 });
  }
}