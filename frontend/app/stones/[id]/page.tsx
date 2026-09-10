'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Container, Row, Col, Card, Button, Badge, Form } from 'react-bootstrap';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, GeoAlt, ShieldCheck, Truck, Phone } from 'react-bootstrap-icons';
import { showToast } from '@/components/ToastProvider';
import { STONES } from '@/lib/mock-data';

export default function StoneDetailPage() {
  const params = useParams();
  const router = useRouter();
  const stone = STONES.find((s) => s.id === params.id);

  const [phone, setPhone] = useState('');
  const [sending, setSending] = useState(false);

  const handleRequestQuote = (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^09[0-9]{9}$/.test(phone)) {
      showToast.error('شماره موبایل معتبر نیست (مثال: 09123456789)');
      return;
    }

    setSending(true);
    setTimeout(() => {
      setSending(false);
      setPhone('');
      showToast.success('درخواست استعلام قیمت ثبت شد؛ همکاران ما با شما تماس می‌گیرند');
    }, 900);
  };

  if (!stone) {
    return (
      <div>
        <Header />
        <Container className="text-center py-5">
          <h3>سنگ مورد نظر یافت نشد</h3>
          <Button variant="primary" onClick={() => router.push('/stones')} className="mt-3">
            بازگشت به لیست سنگ‌ها
          </Button>
        </Container>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />

      <Container className="py-4">
        <div className="d-flex align-items-center mb-4">
          <Button
            variant="link"
            onClick={() => router.back()}
            className="p-0 me-2 text-decoration-none"
            style={{ color: '#6a1b9a' }}
          >
            <ArrowLeft size={20} />
          </Button>
          <Link href="/" className="text-decoration-none text-muted">خانه</Link>
          <span className="mx-2 text-muted">/</span>
          <Link href="/stones" className="text-decoration-none text-muted">سنگ‌های تزئینی</Link>
          <span className="mx-2 text-muted">/</span>
          <span className="text-primary">{stone.name}</span>
        </div>

        <Row>
          <Col lg={6} className="mb-4">
            <Card className="border-0 shadow-sm">
              <div className="position-relative" style={{ height: '420px', backgroundColor: '#f8f9fa' }}>
                <Image
                  src={stone.imageUrl || '/images/placeholder.jpg'}
                  alt={stone.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }}
                  className="rounded"
                  priority
                />
              </div>
            </Card>
          </Col>

          <Col lg={6}>
            <Card className="border-0 shadow-sm p-4">
              <h1 className="h2 fw-bold mb-3">{stone.name}</h1>

              <div className="d-flex align-items-center gap-2 mb-3">
                <Badge bg="light" text="dark" className="px-3 py-2">دسته: {stone.category}</Badge>
                <Badge bg="light" text="dark" className="d-flex align-items-center gap-1 px-3 py-2">
                  <GeoAlt size={14} /> {stone.origin}
                </Badge>
              </div>

              <p className="text-muted mb-4">{stone.description}</p>

              <div className="mb-4">
                <span className="h2 fw-bold text-primary">{stone.price.toLocaleString()} تومان</span>
                <span className="text-muted small me-2">/ متر مربع (تقریبی)</span>
              </div>

              <div className="bg-light p-3 rounded mb-4" style={{ fontSize: '0.9rem' }}>
                <div className="d-flex align-items-center gap-3 mb-2">
                  <Truck size={18} className="text-primary" />
                  <span>ارسال به سراسر کشور با هماهنگی باربری</span>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <ShieldCheck size={18} className="text-primary" />
                  <span>ضمانت کیفیت و اصالت سنگ</span>
                </div>
              </div>

              <Form onSubmit={handleRequestQuote}>
                <Form.Label className="fw-bold mb-2 d-flex align-items-center gap-2">
                  <Phone size={16} />
                  درخواست استعلام قیمت و مشاوره خرید
                </Form.Label>
                <div className="d-flex gap-2">
                  <Form.Control
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="09123456789"
                    className="py-2"
                    dir="ltr"
                  />
                  <Button
                    type="submit"
                    disabled={sending}
                    style={{ backgroundColor: '#6a1b9a', borderColor: '#6a1b9a', whiteSpace: 'nowrap' }}
                  >
                    {sending ? 'در حال ارسال...' : 'تماس بگیرید'}
                  </Button>
                </div>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>

      <Footer />
    </div>
  );
}
