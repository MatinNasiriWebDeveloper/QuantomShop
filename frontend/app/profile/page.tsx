'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Row, Col, Card, Button, Form, Badge, Nav, Tab } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  PersonCircle,
  Wallet2,
  BagCheck,
  Heart,
  BoxArrowRight,
  PencilSquare,
  GeoAlt,
} from 'react-bootstrap-icons';
import { showToast } from '@/components/ToastProvider';
import { PRODUCTS } from '@/lib/mock-data';

interface StoredUser {
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

interface StoredOrder {
  id: string;
  date: string;
  items: { id: string; name: string; quantity: number; finalPrice: number; imageUrl: string }[];
  total: number;
  status: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      showToast.warning('برای مشاهده پروفایل ابتدا وارد شوید');
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    setEditName(parsedUser.name || '');
    setEditPhone(parsedUser.phone || '');

    setOrders(JSON.parse(localStorage.getItem('orders') || '[]').reverse());
    setFavoriteIds(JSON.parse(localStorage.getItem('favorites') || '[]'));
    setWalletBalance(Number(localStorage.getItem('walletBalance') || 0));
  }, [router]);

  const formatPrice = (price: number) => price.toLocaleString('fa-IR') + ' تومان';

  const handleSaveProfile = () => {
    if (!editName.trim()) {
      showToast.error('لطفاً نام خود را وارد کنید');
      return;
    }

    setSaving(true);
    setTimeout(() => {
      const updatedUser = { ...user, name: editName, phone: editPhone };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser as StoredUser);
      setSaving(false);
      showToast.success('اطلاعات پروفایل با موفقیت به‌روزرسانی شد');
    }, 700);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    showToast.success('با موفقیت خارج شدید');
    router.push('/');
  };

  const favoriteProducts = PRODUCTS.filter((p) => favoriteIds.includes(p.id));

  if (!user) {
    return null;
  }

  return (
    <div>
      <Header />

      <Container className="py-5">
        <Row>
          <Col lg={3} className="mb-4">
            <Card className="border-0 shadow-sm text-center p-4">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{ width: '90px', height: '90px', backgroundColor: '#f0f0f0', overflow: 'hidden' }}
              >
                {user.avatar ? (
                  <Image src={user.avatar} alt={user.name} width={90} height={90} style={{ objectFit: 'cover' }} />
                ) : (
                  <PersonCircle size={60} color="#b0b0b0" />
                )}
              </div>
              <h5 className="fw-bold mb-1">{user.name}</h5>
              <p className="text-muted small mb-4">{user.email}</p>

              <div className="d-flex justify-content-between align-items-center bg-light rounded-3 p-3 mb-2">
                <span className="d-flex align-items-center gap-2 small fw-bold">
                  <Wallet2 style={{ color: '#6a1b9a' }} size={18} />
                  کیف پول
                </span>
                <span className="fw-bold" style={{ color: '#6a1b9a' }}>{formatPrice(walletBalance)}</span>
              </div>

              <Link href="/wallet" className="text-decoration-none">
                <Button variant="outline-primary" size="sm" className="w-100 mb-2" style={{ borderColor: '#6a1b9a', color: '#6a1b9a' }}>
                  شارژ کیف پول
                </Button>
              </Link>

              <Button variant="outline-danger" size="sm" className="w-100 d-flex align-items-center justify-content-center gap-2" onClick={handleLogout}>
                <BoxArrowRight size={16} />
                خروج از حساب کاربری
              </Button>
            </Card>
          </Col>

          <Col lg={9}>
            <Tab.Container defaultActiveKey="orders">
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white border-0 pt-3">
                  <Nav variant="tabs">
                    <Nav.Item>
                      <Nav.Link eventKey="orders" className="d-flex align-items-center gap-2">
                        <BagCheck size={16} /> سفارش‌های من
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="favorites" className="d-flex align-items-center gap-2">
                        <Heart size={16} /> علاقه‌مندی‌ها
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="settings" className="d-flex align-items-center gap-2">
                        <PencilSquare size={16} /> ویرایش اطلاعات
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Card.Header>

                <Card.Body>
                  <Tab.Content>
                    <Tab.Pane eventKey="orders">
                      {orders.length === 0 ? (
                        <div className="text-center py-5">
                          <BagCheck size={48} className="text-muted mb-3" />
                          <p className="text-muted mb-3">هنوز سفارشی ثبت نکرده‌اید</p>
                          <Link href="/products">
                            <Button style={{ backgroundColor: '#6a1b9a', borderColor: '#6a1b9a' }}>مشاهده محصولات</Button>
                          </Link>
                        </div>
                      ) : (
                        orders.map((order) => (
                          <div key={order.id} className="border rounded-3 p-3 mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <span className="fw-bold small">سفارش #{order.id}</span>
                              <Badge bg="success">{order.status}</Badge>
                            </div>
                            <p className="text-muted small mb-2">{new Date(order.date).toLocaleDateString('fa-IR')}</p>
                            <p className="small mb-2">{order.items.length} کالا</p>
                            <div className="fw-bold text-primary">{formatPrice(order.total)}</div>
                          </div>
                        ))
                      )}
                    </Tab.Pane>

                    <Tab.Pane eventKey="favorites">
                      {favoriteProducts.length === 0 ? (
                        <div className="text-center py-5">
                          <Heart size={48} className="text-muted mb-3" />
                          <p className="text-muted mb-3">هنوز محصولی به علاقه‌مندی‌ها اضافه نکرده‌اید</p>
                          <Link href="/products">
                            <Button style={{ backgroundColor: '#6a1b9a', borderColor: '#6a1b9a' }}>مشاهده محصولات</Button>
                          </Link>
                        </div>
                      ) : (
                        <Row className="g-3">
                          {favoriteProducts.map((product) => (
                            <Col xs={6} md={4} key={product.id}>
                              <Link href={`/product/${product.id}`} className="text-decoration-none text-dark">
                                <Card className="h-100 border-0 shadow-sm">
                                  <div className="position-relative" style={{ height: '140px' }}>
                                    <Image src={product.imageUrl} alt={product.name} fill style={{ objectFit: 'contain' }} className="p-2" />
                                  </div>
                                  <Card.Body className="p-2">
                                    <p className="small mb-1 text-truncate">{product.name}</p>
                                    <span className="fw-bold small text-primary">{formatPrice(product.finalPrice)}</span>
                                  </Card.Body>
                                </Card>
                              </Link>
                            </Col>
                          ))}
                        </Row>
                      )}
                    </Tab.Pane>

                    <Tab.Pane eventKey="settings">
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">نام و نام خانوادگی</Form.Label>
                        <Form.Control value={editName} onChange={(e) => setEditName(e.target.value)} className="py-2" />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">ایمیل</Form.Label>
                        <Form.Control value={user.email} disabled className="py-2" />
                      </Form.Group>
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-bold">شماره موبایل</Form.Label>
                        <Form.Control
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          placeholder="09123456789"
                          className="py-2"
                          dir="ltr"
                        />
                      </Form.Group>
                      <Button
                        onClick={handleSaveProfile}
                        disabled={saving}
                        style={{ backgroundColor: '#6a1b9a', borderColor: '#6a1b9a' }}
                      >
                        {saving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                      </Button>

                      <hr className="my-4" />

                      <div className="d-flex align-items-center justify-content-between">
                        <span className="d-flex align-items-center gap-2 fw-bold">
                          <GeoAlt style={{ color: '#6a1b9a' }} />
                          آدرس‌های من
                        </span>
                        <Link href="/checkout" className="text-decoration-none small" style={{ color: '#6a1b9a' }}>
                          مدیریت از صفحه پرداخت
                        </Link>
                      </div>
                    </Tab.Pane>
                  </Tab.Content>
                </Card.Body>
              </Card>
            </Tab.Container>
          </Col>
        </Row>
      </Container>

      <Footer />
    </div>
  );
}
