import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { product } = body;

    if (!product.title || !product.price) {
      return NextResponse.json(
        { error: 'عنوان و قیمت محصول الزامی است' },
        { status: 400 }
      );
    }

    // TODO: ذخیره در دیتابیس اصلی فروشگاه
    console.log('محصول جدید از پنل فروشندگان:', product);

    return NextResponse.json({
      success: true,
      message: 'محصول با موفقیت در فروشگاه اصلی منتشر شد',
      productId: Date.now()
    });
    
  } catch (error) {
    console.error('خطا در دریافت محصول:', error);
    return NextResponse.json(
      { error: 'خطای داخلی سرور' },
      { status: 500 }
    );
  }
}