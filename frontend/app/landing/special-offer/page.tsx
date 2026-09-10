'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { Fire, StopwatchFill, ArrowLeft } from 'react-bootstrap-icons';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { PRODUCTS } from '@/lib/mock-data';

export default function SpecialOfferPage() {
  return (
    <Suspense fallback={null}>
      <SpecialOfferContent />
    </Suspense>
  );
}

function SpecialOfferContent() {
  const searchParams = useSearchParams();
  const slide = searchParams.get('slide');

  const discountedProducts = PRODUCTS
    .filter((p) => p.discount > 0)
    .sort((a, b) => b.discount - a.discount);

  return (
    <div>
      <Header />

      <section
        className="text-white py-5"
        style={{ background: 'linear-gradient(135deg, #6a1b9a 0%, #9c27b0 100%)' }}
      >
        <Container>
          <Row className="align-items-center">
            <Col lg={7}>
              <Badge bg="light" text="dark" className="mb-3 px-3 py-2 d-inline-flex align-items-center gap-1">
                <Fire size={14} />
                پیشنهاد ویژه امروز
              </Badge>
              <h1 className="display-5 fw-bold mb-3">تا ۲۰٪ تخفیف روی منتخبی از بهترین محصولات</h1>
              <p className="lead opacity-75 mb-4">
                فقط برای امروز، مجموعه‌ای ویژه از پرفروش‌ترین کالاهای کوانتوم شاپ با تخفیف‌های باورنکردنی
                در دسترس شماست. فرصت را از دست ندهید و پیش از پایان موجودی، خرید خود را نهایی کنید.
              </p>
              <div className="d-flex align-items-center gap-3 flex-wrap">
                <Link href="/products?filter=discount">
                  <Button variant="light" size="lg" className="fw-bold px-5">
                    مشاهده و خرید
                  </Button>
                </Link>
                <div className="d-flex align-items-center gap-2 opacity-75">
                  <StopwatchFill size={20} />
                  <span>پیشنهاد محدود، فقط تا پایان امروز</span>
                </div>
              </div>
              {slide !== null && (
                <p className="opacity-50 small mt-3 mb-0">کد بنر مرجع: {slide}</p>
              )}
            </Col>
            <Col lg={5} className="text-center mt-4 mt-lg-0">
              <Fire size={140} className="opacity-75" />
            </Col>
          </Row>
        </Container>
      </section>

      <Container className="py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="h4 fw-bold mb-0">محصولات تخفیف‌دار</h2>
          <Link href="/products?filter=discount" className="text-decoration-none d-flex align-items-center" style={{ color: '#6a1b9a' }}>
            مشاهده همه
            <ArrowLeft className="me-2" />
          </Link>
        </div>

        {discountedProducts.length === 0 ? (
          <p className="text-muted">در حال حاضر محصول تخفیف‌داری موجود نیست.</p>
        ) : (
          <Row className="g-4">
            {discountedProducts.map((product) => (
              <Col key={product.id} xs={12} sm={6} md={4} lg={3}>
                <Link href={`/product/${product.id}`} className="text-decoration-none">
                  <Card className="h-100 border-0 shadow-sm product-card">
                    <div style={{ position: 'relative', height: '200px', backgroundColor: '#f8f9fa' }}>
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        style={{ objectFit: 'contain' }}
                        className="p-3"
                      />
                      <Badge bg="danger" className="position-absolute top-0 end-0 m-2 px-2 py-1">
                        {product.discount}% تخفیف
                      </Badge>
                    </div>
                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="h6 mb-2 text-dark">{product.name}</Card.Title>
                      <div className="mt-auto d-flex align-items-center gap-2 flex-wrap">
                        <span className="h6 mb-0 fw-bold text-danger">
                          {product.finalPrice.toLocaleString()} تومان
                        </span>
                        <span className="text-muted text-decoration-line-through small">
                          {product.price.toLocaleString()} تومان
                        </span>
                      </div>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      <Footer />
    </div>
  );
}
