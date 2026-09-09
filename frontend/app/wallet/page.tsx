'use client';

import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Badge } from 'react-bootstrap';
import { Wallet2, PlusCircle, ArrowDownCircle, ArrowUpCircle, ClockHistory, ShieldCheck } from 'react-bootstrap-icons';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { showToast } from '@/components/ToastProvider';
import toast from 'react-hot-toast';

interface Transaction {
  id: string;
  type: 'charge' | 'payment';
  amount: number;
  date: string;
  description: string;
}

const QUICK_AMOUNTS = [50000, 100000, 200000, 500000];

export default function WalletPage() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [customAmount, setCustomAmount] = useState('');
  const [charging, setCharging] = useState(false);

  useEffect(() => {
    const savedBalance = localStorage.getItem('walletBalance');
    const savedTransactions = localStorage.getItem('walletTransactions');

    setBalance(savedBalance ? Number(savedBalance) : 250000);
    setTransactions(savedTransactions ? JSON.parse(savedTransactions) : [
      {
        id: '1',
        type: 'charge',
        amount: 250000,
        date: new Date().toISOString(),
        description: 'شارژ اولیه کیف پول',
      },
    ]);
  }, []);

  const formatPrice = (price: number) => price.toLocaleString('fa-IR') + ' تومان';

  const persist = (nextBalance: number, nextTransactions: Transaction[]) => {
    localStorage.setItem('walletBalance', String(nextBalance));
    localStorage.setItem('walletTransactions', JSON.stringify(nextTransactions));
  };

  const handleCharge = (amount: number) => {
    if (!amount || amount <= 0) {
      showToast.error('لطفاً مبلغ معتبری وارد کنید');
      return;
    }

    setCharging(true);
    const loadingToast = showToast.loading('در حال اتصال به درگاه پرداخت...');

    setTimeout(() => {
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'charge',
        amount,
        date: new Date().toISOString(),
        description: 'شارژ کیف پول از طریق درگاه بانکی',
      };

      const nextBalance = balance + amount;
      const nextTransactions = [newTransaction, ...transactions];

      setBalance(nextBalance);
      setTransactions(nextTransactions);
      persist(nextBalance, nextTransactions);

      setCharging(false);
      setCustomAmount('');
      toast.dismiss(loadingToast);
      showToast.success(`کیف پول شما به مبلغ ${formatPrice(amount)} شارژ شد`);
    }, 1200);
  };

  return (
    <div>
      <Header />

      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={9}>
            {/* کارت موجودی */}
            <Card
              className="border-0 shadow-lg rounded-4 overflow-hidden mb-4 text-white"
              style={{ background: 'linear-gradient(135deg, #6a1b9a 0%, #9c27b0 100%)' }}
            >
              <Card.Body className="p-4 p-md-5">
                <Row className="align-items-center">
                  <Col md={8}>
                    <div className="d-flex align-items-center gap-2 mb-3 opacity-75">
                      <Wallet2 size={22} />
                      <span>موجودی کیف پول</span>
                    </div>
                    <h1 className="display-5 fw-bold mb-0">{formatPrice(balance)}</h1>
                  </Col>
                  <Col md={4} className="text-md-end mt-4 mt-md-0">
                    <div className="d-inline-flex align-items-center gap-2 bg-white bg-opacity-25 rounded-pill px-3 py-2">
                      <ShieldCheck size={18} />
                      <small>پرداخت امن و رمزنگاری‌شده</small>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Row>
              {/* شارژ کیف پول */}
              <Col lg={5} className="mb-4">
                <Card className="border-0 shadow-sm h-100">
                  <Card.Body className="p-4">
                    <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                      <PlusCircle style={{ color: '#6a1b9a' }} size={20} />
                      افزایش موجودی
                    </h5>

                    <div className="d-flex flex-wrap gap-2 mb-3">
                      {QUICK_AMOUNTS.map((amount) => (
                        <Button
                          key={amount}
                          variant="outline-primary"
                          className="flex-grow-1"
                          style={{ color: '#6a1b9a', borderColor: '#6a1b9a', minWidth: '45%' }}
                          disabled={charging}
                          onClick={() => handleCharge(amount)}
                        >
                          {formatPrice(amount)}
                        </Button>
                      ))}
                    </div>

                    <Form.Group className="mb-3">
                      <Form.Label className="small text-muted">مبلغ دلخواه (تومان)</Form.Label>
                      <Form.Control
                        type="number"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        placeholder="مثلاً 150000"
                        className="py-2"
                      />
                    </Form.Group>

                    <Button
                      className="w-100 py-2 fw-bold border-0"
                      style={{ background: 'linear-gradient(135deg, #6a1b9a 0%, #9c27b0 100%)' }}
                      disabled={charging || !customAmount}
                      onClick={() => handleCharge(Number(customAmount))}
                    >
                      {charging ? 'در حال پردازش...' : 'شارژ کیف پول'}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>

              {/* تاریخچه تراکنش‌ها */}
              <Col lg={7} className="mb-4">
                <Card className="border-0 shadow-sm h-100">
                  <Card.Body className="p-4">
                    <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                      <ClockHistory style={{ color: '#6a1b9a' }} size={20} />
                      تاریخچه تراکنش‌ها
                    </h5>

                    {transactions.length === 0 ? (
                      <p className="text-muted text-center py-4">هنوز تراکنشی ثبت نشده است</p>
                    ) : (
                      <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                        <Table borderless hover responsive className="align-middle mb-0">
                          <tbody>
                            {transactions.map((tx) => (
                              <tr key={tx.id}>
                                <td style={{ width: '40px' }}>
                                  {tx.type === 'charge' ? (
                                    <ArrowDownCircle className="text-success" size={22} />
                                  ) : (
                                    <ArrowUpCircle className="text-danger" size={22} />
                                  )}
                                </td>
                                <td>
                                  <div className="fw-bold small">{tx.description}</div>
                                  <div className="text-muted" style={{ fontSize: '12px' }}>
                                    {new Date(tx.date).toLocaleString('fa-IR')}
                                  </div>
                                </td>
                                <td className="text-end">
                                  <Badge bg={tx.type === 'charge' ? 'success' : 'danger'} className="px-2 py-1">
                                    {tx.type === 'charge' ? '+' : '-'}
                                    {formatPrice(tx.amount)}
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>

      <Footer />
    </div>
  );
}
