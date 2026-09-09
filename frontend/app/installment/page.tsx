'use client';

import { useMemo, useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, Table } from 'react-bootstrap';
import { CreditCard, Calculator, CheckCircleFill, ShieldCheck } from 'react-bootstrap-icons';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { showToast } from '@/components/ToastProvider';

const PLANS = [
  { months: 3, interestPercent: 4 },
  { months: 6, interestPercent: 8 },
  { months: 12, interestPercent: 16 },
];

export default function InstallmentPage() {
  const [amount, setAmount] = useState(15000000);
  const [selectedMonths, setSelectedMonths] = useState(6);
  const [submitting, setSubmitting] = useState(false);

  const formatPrice = (price: number) => Math.round(price).toLocaleString('fa-IR') + ' تومان';

  const selectedPlan = PLANS.find((p) => p.months === selectedMonths)!;

  const { totalWithInterest, monthlyInstallment } = useMemo(() => {
    const total = amount * (1 + selectedPlan.interestPercent / 100);
    return {
      totalWithInterest: total,
      monthlyInstallment: total / selectedPlan.months,
    };
  }, [amount, selectedPlan]);

  const handleSubmit = () => {
    if (!amount || amount < 1000000) {
      showToast.error('حداقل مبلغ خرید اقساطی ۱ میلیون تومان است');
      return;
    }

    setSubmitting(true);
    const loadingToast = showToast.loading('در حال ثبت درخواست خرید اقساطی...');

    setTimeout(() => {
      setSubmitting(false);
      showToast.success('درخواست خرید اقساطی شما با موفقیت ثبت شد');
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
              <Badge bg="light" text="dark" className="mb-3 px-3 py-2">خرید اقساطی کوانتوم</Badge>
              <h1 className="display-6 fw-bold mb-3">خرید امروز، پرداخت در چند قسط</h1>
              <p className="lead opacity-75 mb-0">
                محصول مورد نظر خود را انتخاب کنید و هزینه آن را در ۳، ۶ یا ۱۲ قسط ماهانه بدون نیاز به ضامن پرداخت کنید.
              </p>
            </Col>
            <Col lg={5} className="text-center mt-4 mt-lg-0">
              <CreditCard size={140} className="opacity-75" />
            </Col>
          </Row>
        </Container>
      </section>

      <Container className="py-5">
        <Row>
          <Col lg={6} className="mb-4">
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                  <Calculator style={{ color: '#6a1b9a' }} size={20} />
                  محاسبه‌گر اقساط
                </h5>

                <Form.Group className="mb-4">
                  <Form.Label className="small text-muted">مبلغ خرید (تومان)</Form.Label>
                  <Form.Control
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="py-2"
                    min={1000000}
                    step={500000}
                  />
                </Form.Group>

                <Form.Label className="small text-muted d-block mb-2">تعداد اقساط</Form.Label>
                <div className="d-flex gap-2 mb-4">
                  {PLANS.map((plan) => (
                    <div
                      key={plan.months}
                      onClick={() => setSelectedMonths(plan.months)}
                      className="flex-grow-1 text-center p-3 rounded-3 border"
                      style={{
                        cursor: 'pointer',
                        borderColor: selectedMonths === plan.months ? '#6a1b9a' : '#e0e0e0',
                        backgroundColor: selectedMonths === plan.months ? 'rgba(106, 27, 154, 0.06)' : 'white',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div className="fw-bold">{plan.months} ماهه</div>
                      <small className="text-muted">سود {plan.interestPercent}٪</small>
                    </div>
                  ))}
                </div>

                <div className="bg-light rounded-3 p-3 mb-4">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted small">مبلغ کل با سود:</span>
                    <span className="fw-bold">{formatPrice(totalWithInterest)}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted small">قسط ماهانه:</span>
                    <span className="h5 fw-bold mb-0" style={{ color: '#6a1b9a' }}>
                      {formatPrice(monthlyInstallment)}
                    </span>
                  </div>
                </div>

                <Button
                  className="w-100 py-2 fw-bold border-0"
                  style={{ background: 'linear-gradient(135deg, #6a1b9a 0%, #9c27b0 100%)' }}
                  disabled={submitting}
                  onClick={handleSubmit}
                >
                  {submitting ? 'در حال ثبت درخواست...' : 'ثبت درخواست خرید اقساطی'}
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={6} className="mb-4">
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-4">جدول اقساط پیشنهادی</h5>
                <Table responsive borderless className="align-middle mb-4">
                  <thead>
                    <tr className="text-muted small">
                      <th>طرح</th>
                      <th>سود</th>
                      <th>قسط ماهانه</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PLANS.map((plan) => {
                      const total = amount * (1 + plan.interestPercent / 100);
                      const monthly = total / plan.months;
                      const active = plan.months === selectedMonths;
                      return (
                        <tr key={plan.months} style={active ? { backgroundColor: 'rgba(106, 27, 154, 0.06)' } : {}}>
                          <td className="fw-bold">
                            {plan.months} ماهه
                            {active && (
                              <CheckCircleFill className="ms-2" size={14} style={{ color: '#6a1b9a' }} />
                            )}
                          </td>
                          <td>{plan.interestPercent}٪</td>
                          <td className="fw-bold" style={{ color: '#6a1b9a' }}>{formatPrice(monthly)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>

                <div className="d-flex align-items-center gap-3 bg-light rounded-3 p-3">
                  <ShieldCheck size={24} className="text-success flex-shrink-0" />
                  <small className="text-muted">
                    بدون نیاز به ضامن یا چک، فقط با احراز هویت آنلاین. پرداخت اقساط از طریق کیف پول یا کارت بانکی.
                  </small>
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
