'use client';

import { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge } from 'react-bootstrap';
import { Wallet2, CheckCircleFill, ShieldCheck, Lightning, ClipboardCheck } from 'react-bootstrap-icons';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { showToast } from '@/components/ToastProvider';

const CREDIT_TIERS = [
  { amount: 5000000, label: '۵ میلیون تومان', note: 'مناسب خریدهای روزمره' },
  { amount: 15000000, label: '۱۵ میلیون تومان', note: 'محبوب‌ترین گزینه' },
  { amount: 30000000, label: '۳۰ میلیون تومان', note: 'برای خریدهای بزرگ' },
];

const STEPS = [
  { title: 'ثبت درخواست', desc: 'مبلغ اعتبار مورد نیاز خود را انتخاب کنید.' },
  { title: 'احراز هویت', desc: 'اطلاعات هویتی شما در چند دقیقه بررسی می‌شود.' },
  { title: 'تأیید اعتبار', desc: 'اعتبار به کیف پول شما اضافه می‌شود.' },
  { title: 'خرید و بازپرداخت', desc: 'خرید کنید و اقساط را به‌صورت ماهانه تسویه کنید.' },
];

export default function CreditPage() {
  const [selectedTier, setSelectedTier] = useState(CREDIT_TIERS[1].amount);
  const [submitting, setSubmitting] = useState(false);

  const formatPrice = (price: number) => price.toLocaleString('fa-IR') + ' تومان';

  const handleRequest = () => {
    setSubmitting(true);
    const loadingToast = showToast.loading('در حال ثبت درخواست اعتبار...');

    setTimeout(() => {
      setSubmitting(false);
      showToast.success(`درخواست اعتبار ${formatPrice(selectedTier)} با موفقیت ثبت شد`);
    }, 1200);
  };

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
              <Badge bg="light" text="dark" className="mb-3 px-3 py-2">خرید اعتباری کوانتوم</Badge>
              <h1 className="display-6 fw-bold mb-3">همین حالا بخرید، بعداً پرداخت کنید</h1>
              <p className="lead opacity-75 mb-0">
                بدون نیاز به کارت اعتباری، تا سقف ۳۰ میلیون تومان اعتبار خرید دریافت کنید و در اقساط ماهانه تسویه کنید.
              </p>
            </Col>
            <Col lg={5} className="text-center mt-4 mt-lg-0">
              <Wallet2 size={140} className="opacity-75" />
            </Col>
          </Row>
        </Container>
      </section>

      <Container className="py-5">
        <Row>
          <Col lg={7} className="mb-4">
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                  <ClipboardCheck style={{ color: '#6a1b9a' }} size={20} />
                  مراحل دریافت اعتبار
                </h5>
                {STEPS.map((step, index) => (
                  <div key={step.title} className="d-flex gap-3 mb-4">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 fw-bold text-white"
                      style={{ width: '36px', height: '36px', backgroundColor: '#6a1b9a' }}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1">{step.title}</h6>
                      <p className="text-muted small mb-0">{step.desc}</p>
                    </div>
                  </div>
                ))}

                <div className="bg-light rounded-3 p-3 d-flex align-items-center gap-3 mt-2">
                  <ShieldCheck size={24} className="text-success flex-shrink-0" />
                  <small className="text-muted">
                    اطلاعات هویتی شما با بالاترین سطح امنیت نگهداری می‌شود و صرفاً برای احراز اعتبار استفاده خواهد شد.
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={5} className="mb-4">
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                  <Lightning style={{ color: '#6a1b9a' }} size={20} />
                  انتخاب سقف اعتبار
                </h5>

                <div className="d-flex flex-column gap-2 mb-4">
                  {CREDIT_TIERS.map((tier) => (
                    <div
                      key={tier.amount}
                      onClick={() => setSelectedTier(tier.amount)}
                      className="p-3 rounded-3 border d-flex justify-content-between align-items-center"
                      style={{
                        cursor: 'pointer',
                        borderColor: selectedTier === tier.amount ? '#6a1b9a' : '#e0e0e0',
                        backgroundColor: selectedTier === tier.amount ? 'rgba(106, 27, 154, 0.06)' : 'white',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div>
                        <div className="fw-bold">{tier.label}</div>
                        <small className="text-muted">{tier.note}</small>
                      </div>
                      {selectedTier === tier.amount && (
                        <CheckCircleFill style={{ color: '#6a1b9a' }} size={22} />
                      )}
                    </div>
                  ))}
                </div>

                <Form.Group className="mb-4">
                  <Form.Label className="small text-muted">شماره ملی</Form.Label>
                  <Form.Control type="text" placeholder="کد ملی ۱۰ رقمی" className="py-2" dir="ltr" />
                </Form.Group>

                <Button
                  className="w-100 py-2 fw-bold border-0"
                  style={{ background: 'linear-gradient(135deg, #6a1b9a 0%, #9c27b0 100%)' }}
                  disabled={submitting}
                  onClick={handleRequest}
                >
                  {submitting ? 'در حال ثبت درخواست...' : 'ثبت درخواست اعتبار'}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Footer />
    </div>
  );
}
