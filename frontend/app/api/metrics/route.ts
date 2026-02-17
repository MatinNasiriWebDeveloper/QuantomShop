import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // اینجا می‌تونی متریک‌ها رو توی فایل ذخیره کنی یا به دیتابیس بفرستی
    console.log('📊 Received metrics:', body);
    
    // ذخیره در فایل (اختیاری)
    const fs = require('fs');
    const path = require('path');
    const logPath = path.join(process.cwd(), 'public', 'metrics.json');
    
    let metrics = [];
    try {
      const existing = fs.readFileSync(logPath, 'utf8');
      metrics = JSON.parse(existing);
    } catch {
      metrics = [];
    }
    
    metrics.push(body);
    fs.writeFileSync(logPath, JSON.stringify(metrics, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save metrics' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const fs = require('fs');
    const path = require('path');
    const logPath = path.join(process.cwd(), 'public', 'metrics.json');
    
    const data = fs.readFileSync(logPath, 'utf8');
    const metrics = JSON.parse(data);
    
    return NextResponse.json(metrics);
  } catch {
    return NextResponse.json([]);
  }
}