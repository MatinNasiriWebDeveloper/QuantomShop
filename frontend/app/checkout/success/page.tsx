'use client';

import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  CheckCircle, 
  Printer, 
  Download, 
  Share,
  ArrowLeft
} from 'react-bootstrap-icons';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function OrderSuccessPage() {
  const router = useRouter();
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    // تولید یک شماره سفارش تصادفی
    const randomId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    setOrderId(randomId);
  }, []);

  return (
    <div>
      <Header />
      
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="bg-success text-white text-center py-5">
                <CheckCircle size={80} className="mb-3" />
                <h2 className="fw-bold mb-2">پرداخت با موفقیت انجام شد</h2>
                <p className="mb-0 opacity-75">سفارش شما با موفقیت ثبت و پرداخت شد</p>
              </div>
              
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <div className="bg-light p-4 rounded-3">
                    <p className="text-muted mb-2">شماره سفارش</p>
                    <h3 className="fw-bold text-primary mb-0">{orderId}</h3>
                  </div>
                </div>

                <div className="bg-light p-4 rounded-3 mb-4">
                  <p className="mb-2">
                    <strong>تاریخ سفارش:</strong> {new Date().toLocaleDateString('fa-IR')}
                  </p>
                  <p className="mb-2">
                    <strong>زمان پرداخت:</strong> {new Date().toLocaleTimeString('fa-IR')}
                  </p>
                  <p className="mb-0">
                    <strong>وضعیت:</strong> <span className="text-success">در حال پردازش</span>
                  </p>
                </div>

                <div className="d-flex gap-3 mb-4">
                  <Button variant="outline-primary" className="flex-grow-1 d-flex align-items-center justify-content-center gap-2">
                    <Printer size={18} />
                    چاپ فاکتور
                  </Button>
                  <Button variant="outline-primary" className="flex-grow-1 d-flex align-items-center justify-content-center gap-2">
                    <Download size={18} />
                    دانلود فاکتور
                  </Button>
                </div>

                <div className="d-flex gap-2">
                  <Button 
                    variant="primary" 
                    className="flex-grow-1"
                    style={{ backgroundColor: '#6a1b9a', borderColor: '#6a1b9a' }}
                    onClick={() => router.push('/')}
                  >
                    بازگشت به صفحه اصلی
                  </Button>
                  <Button 
                    variant="outline-primary" 
                    className="flex-grow-1"
                    style={{ color: '#6a1b9a', borderColor: '#6a1b9a' }}
                    onClick={() => router.push('/orders')}
                  >
                    پیگیری سفارش
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Footer />
    </div>
  );
}