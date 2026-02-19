'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Form, Badge } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Trash, 
  ArrowLeft, 
  Cart as CartIcon,
  Plus,
  Dash,
  Truck,
  ShieldCheck,
  Clock
} from 'react-bootstrap-icons';
import { useCart } from '../context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { showToast } from '@/components/ToastProvider';
import toast from 'react-hot-toast';

export default function CartPage() {
  const router = useRouter();
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleRemoveItem = (id: string, name: string) => {
    removeFromCart(id);
  };

  const handleQuantityChange = (id: string, newQuantity: number, stock: number) => {
    if (newQuantity < 1) {
      return;
    }
    if (newQuantity > stock) {
      showToast.error('موجودی محصول کافی نیست');
      return;
    }
    updateQuantity(id, newQuantity);
  };

  const handleClearCart = () => {
    if (items.length === 0) return;
    
    if (window.confirm('آیا از خالی کردن سبد خرید اطمینان دارید؟')) {
      clearCart();
    }
  };

  const handleCheckout = () => {
    if (!isLoggedIn) {
      localStorage.setItem('redirectAfterLogin', '/cart');
      showToast.warning('برای ثبت سفارش باید وارد حساب کاربری خود شوید');
      setTimeout(() => router.push('/login'), 2000);
      return;
    }
    
    if (items.length === 0) {
      showToast.error('سبد خرید شما خالی است');
      return;
    }
    
    router.push('/checkout');
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('fa-IR') + ' تومان';
  };

  // حالت سبد خالی
  if (items.length === 0) {
    return (
      <div>
        <Header />
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col md={8} lg={6} className="text-center">
              <Card className="border-0 shadow-sm p-5">
                <CartIcon size={80} className="text-muted mx-auto mb-4" />
                <h3 className="mb-3">
                  {isLoggedIn && user?.name 
                    ? `${user.name} عزیز`
                    : 'کاربر عزیز'
                  }
                </h3>
                <p className="text-muted mb-4">
                  شما هیچ کالایی به سبد خرید خود اضافه نکرده‌اید
                </p>
                <div className="d-flex gap-3 justify-content-center">
                  <Button 
                    variant="primary" 
                    size="lg"
                    onClick={() => router.push('/products')}
                    style={{ backgroundColor: '#6a1b9a', borderColor: '#6a1b9a' }}
                  >
                    مشاهده محصولات
                  </Button>
                  <Button 
                    variant="outline-primary" 
                    size="lg"
                    onClick={() => router.push('/')}
                    style={{ color: '#6a1b9a', borderColor: '#6a1b9a' }}
                  >
                    صفحه اصلی
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
        <Footer />
      </div>
    );
  }

  // حالت سبد پر
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
          <h2 className="mb-0">سبد خرید</h2>
          <Badge bg="primary" className="me-3" style={{ backgroundColor: '#6a1b9a' }}>
            {items.length} کالا
          </Badge>
        </div>

        <Row>
          <Col lg={8}>
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body>
                <Table responsive className="align-middle">
                  <thead>
                    <tr>
                      <th>محصول</th>
                      <th>قیمت واحد</th>
                      <th>تعداد</th>
                      <th>جمع</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <div style={{ width: '80px', height: '80px', position: 'relative' }}>
                              <Image
                                src={item.imageUrl}
                                alt={item.name}
                                fill
                                sizes="80px"
                                style={{ objectFit: 'cover', borderRadius: '8px' }}
                              />
                            </div>
                            <div>
                              <Link 
                                href={`/product/${item.id}`}
                                className="text-decoration-none fw-bold"
                                style={{ color: '#333' }}
                              >
                                {item.name}
                              </Link>
                            </div>
                          </div>
                        </td>
                        <td className="fw-bold">
                          {formatPrice(item.finalPrice)}
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.stock)}
                              disabled={item.quantity <= 1}
                              style={{ width: '32px', height: '32px', padding: 0 }}
                            >
                              <Dash size={16} />
                            </Button>
                            <Form.Control
                              type="number"
                              value={item.quantity}
                              onChange={(e) => {
                                const val = parseInt(e.target.value);
                                if (!isNaN(val) && val >= 1 && val <= item.stock) {
                                  updateQuantity(item.id, val);
                                }
                              }}
                              style={{ width: '70px', textAlign: 'center' }}
                              min={1}
                              max={item.stock}
                            />
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.stock)}
                              disabled={item.quantity >= item.stock}
                              style={{ width: '32px', height: '32px', padding: 0 }}
                            >
                              <Plus size={16} />
                            </Button>
                          </div>
                        </td>
                        <td className="fw-bold text-primary">
                          {formatPrice(item.finalPrice * item.quantity)}
                        </td>
                        <td>
                          <Button
                            variant="link"
                            className="text-danger p-0"
                            onClick={() => handleRemoveItem(item.id, item.name)}
                          >
                            <Trash size={18} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                <div className="d-flex justify-content-between mt-3">
                  <Button
                    variant="outline-danger"
                    onClick={handleClearCart}
                  >
                    خالی کردن سبد خرید
                  </Button>
                  <Button
                    variant="outline-primary"
                    onClick={() => router.push('/products')}
                    style={{ color: '#6a1b9a', borderColor: '#6a1b9a' }}
                  >
                    ادامه خرید
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body>
                <h5 className="fw-bold mb-4">خلاصه سفارش</h5>
                
                <div className="d-flex justify-content-between mb-3">
                  <span>تعداد کالا:</span>
                  <span className="fw-bold">{items.length}</span>
                </div>
                
                <div className="d-flex justify-content-between mb-3">
                  <span>مجموع قیمت:</span>
                  <span className="fw-bold text-primary">
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>
                
                <div className="d-flex justify-content-between mb-4">
                  <span>هزینه ارسال:</span>
                  <span className="fw-bold text-success">رایگان</span>
                </div>
                
                <hr />
                
                <div className="d-flex justify-content-between mb-4">
                  <span className="h5 fw-bold">قابل پرداخت:</span>
                  <span className="h5 fw-bold text-primary">
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  className="w-100 mb-3"
                  style={{ backgroundColor: '#6a1b9a', borderColor: '#6a1b9a' }}
                  onClick={handleCheckout}
                >
                  ثبت سفارش
                </Button>

                <div className="bg-light p-3 rounded">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <Truck size={18} className="text-primary" />
                    <small>ارسال رایگان برای این سفارش</small>
                  </div>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <ShieldCheck size={18} className="text-primary" />
                    <small>ضمانت اصالت کالا</small>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <Clock size={18} className="text-primary" />
                    <small>تحویل ۲ تا ۴ روز کاری</small>
                  </div>
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