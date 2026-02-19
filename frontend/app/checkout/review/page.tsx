'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, ListGroup, Alert } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Truck, 
  Clock, 
  Wallet2,
  Cart,
  CheckCircle,
  GeoAlt,
  Tag,
  CreditCard,
  ShieldCheck
} from 'react-bootstrap-icons';
import { useCart } from '../../context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { showToast } from '@/components/ToastProvider';
import toast from 'react-hot-toast';

// تایپ برای اطلاعات سفارش
interface OrderDetails {
  address: string;
  addressDetails: any;
  deliveryDate: string;
  deliveryTime: string;
  deliveryCost: number;
  recipientName: string;
  recipientPhone: string;
}

export default function OrderReviewPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCart();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // دریافت اطلاعات سفارش از localStorage
    const savedOrder = localStorage.getItem('currentOrder');
    if (savedOrder) {
      setOrderDetails(JSON.parse(savedOrder));
    } else {
      showToast.error('اطلاعات سفارش یافت نشد');
      router.push('/checkout');
    }

    if (items.length === 0) {
      showToast.error('سبد خرید شما خالی است');
      router.push('/products');
    }
  }, [items.length, router]);

  const formatPrice = (price: number) => {
    return price.toLocaleString('fa-IR') + ' تومان';
  };

  const calculateDiscount = () => {
    // محاسبه تخفیف (مثال: 10٪ تخفیف برای خرید بالای 500 هزار تومان)
    const subtotal = getTotalPrice();
    let discount = 0;
    
    if (subtotal > 500000) {
      discount = subtotal * 0.1; // 10% تخفیف
    }
    
    return discount;
  };

  const calculateTax = () => {
    // محاسبه مالیات (9٪)
    const subtotal = getTotalPrice();
    return subtotal * 0.09;
  };

  const calculateFinalTotal = () => {
    const subtotal = getTotalPrice();
    const discount = calculateDiscount();
    const tax = calculateTax();
    const delivery = orderDetails?.deliveryCost || 0;
    
    return subtotal - discount + tax + delivery;
  };

  const handlePayment = () => {
    setProcessing(true);
    
    // شبیه‌سازی اتصال به درگاه پرداخت
    const loadingToast = showToast.loading('در حال اتصال به درگاه پرداخت...');
    
    setTimeout(() => {
      toast.dismiss(loadingToast);
      
      // شبیه‌سازی موفقیت پرداخت
      const paymentSuccess = true;
      
      if (paymentSuccess) {
        showToast.success('پرداخت با موفقیت انجام شد');
        
        // ذخیره سفارش در تاریخچه
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const newOrder = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          items,
          orderDetails,
          subtotal: getTotalPrice(),
          discount: calculateDiscount(),
          tax: calculateTax(),
          deliveryCost: orderDetails?.deliveryCost,
          total: calculateFinalTotal(),
          status: 'پرداخت شده'
        };
        orders.push(newOrder);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // پاک کردن سبد خرید و اطلاعات سفارش فعلی
        clearCart();
        localStorage.removeItem('currentOrder');
        
        // انتقال به صفحه موفقیت
        setTimeout(() => {
          router.push('/checkout/success');
        }, 2000);
      } else {
        showToast.error('پرداخت ناموفق بود. لطفاً مجدداً تلاش کنید');
        setProcessing(false);
      }
    }, 3000);
  };

  if (!orderDetails) {
    return (
      <div>
        <Header />
        <Container className="py-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">در حال بارگذاری...</span>
          </div>
          <p className="mt-3">در حال دریافت اطلاعات سفارش...</p>
        </Container>
        <Footer />
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const discount = calculateDiscount();
  const tax = calculateTax();
  const finalTotal = calculateFinalTotal();

  return (
    <div>
      <Header />
      
      <Container className="py-4">
        {/* مسیر راهنما */}
        <div className="d-flex align-items-center mb-4">
          <Button 
            variant="link" 
            onClick={() => router.back()}
            className="p-0 me-2 text-decoration-none"
            style={{ color: '#6a1b9a' }}
          >
            <ArrowLeft size={20} />
          </Button>
          <h2 className="mb-0">بررسی نهایی سفارش</h2>
        </div>

        <Row>
          {/* ستون راست - جزئیات سفارش */}
          <Col lg={8} className="order-2 order-lg-1">
            {/* هشدار امنیتی */}
            <Alert variant="info" className="mb-4 d-flex align-items-center gap-3">
              <ShieldCheck size={24} className="text-info" />
              <div>
                <strong>پرداخت امن</strong>
                <p className="mb-0 small">اطلاعات شما با بالاترین سطح امنیت پردازش می‌شود</p>
              </div>
            </Alert>

            {/* لیست محصولات */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-white py-3">
                <h5 className="fw-bold mb-0 d-flex align-items-center">
                  <Cart className="text-primary me-2" size={20} />
                  محصولات ({items.length} کالا)
                </h5>
              </Card.Header>
              <Card.Body className="p-0">
                <Table responsive className="align-middle mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th style={{ width: '50%' }}>محصول</th>
                      <th className="text-center">قیمت واحد</th>
                      <th className="text-center">تعداد</th>
                      <th className="text-center">جمع</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <div style={{ width: '60px', height: '60px', position: 'relative' }}>
                              <Image
                                src={item.imageUrl}
                                alt={item.name}
                                fill
                                sizes="60px"
                                style={{ objectFit: 'cover', borderRadius: '8px' }}
                              />
                            </div>
                            <div>
                              <h6 className="fw-bold mb-1">{item.name}</h6>
                              <small className="text-muted">کد: {item.id}</small>
                            </div>
                          </div>
                        </td>
                        <td className="text-center align-middle">
                          {formatPrice(item.finalPrice)}
                        </td>
                        <td className="text-center align-middle">
                          <Badge bg="light" text="dark" className="px-3 py-2">
                            {item.quantity}
                          </Badge>
                        </td>
                        <td className="text-center align-middle fw-bold text-primary">
                          {formatPrice(item.finalPrice * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>

            {/* اطلاعات تحویل سفارش */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-white py-3">
                <h5 className="fw-bold mb-0 d-flex align-items-center">
                  <Truck className="text-primary me-2" size={20} />
                  اطلاعات تحویل سفارش
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <div className="bg-light p-3 rounded-3 mb-3">
                      <div className="d-flex align-items-center gap-3 mb-3">
                        <GeoAlt size={20} className="text-primary" />
                        <div>
                          <small className="text-muted d-block">آدرس تحویل</small>
                          <p className="fw-bold mb-0">{orderDetails.address}</p>
                        </div>
                      </div>
                      <div className="row g-2">
                        <div className="col-6">
                          <small className="text-muted d-block">گیرنده</small>
                          <p className="fw-bold mb-0">{orderDetails.recipientName}</p>
                        </div>
                        <div className="col-6">
                          <small className="text-muted d-block">شماره تماس</small>
                          <p className="fw-bold mb-0">{orderDetails.recipientPhone}</p>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="bg-light p-3 rounded-3">
                      <div className="d-flex align-items-center gap-3 mb-3">
                        <Clock size={20} className="text-primary" />
                        <div>
                          <small className="text-muted d-block">زمان تحویل</small>
                          <p className="fw-bold mb-1">{orderDetails.deliveryDate}</p>
                          <p className="fw-bold mb-0 text-primary">{orderDetails.deliveryTime}</p>
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-3">
                        <Truck size={20} className="text-primary" />
                        <div>
                          <small className="text-muted d-block">روش ارسال</small>
                          <p className="fw-bold mb-0">پست پیشتاز</p>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          {/* ستون چپ - خلاصه قیمت و پرداخت */}
          <Col lg={4} className="order-1 order-lg-2">
            <Card className="border-0 shadow-sm sticky-lg-top" style={{ top: '90px' }}>
              <Card.Header className="bg-white py-3">
                <h5 className="fw-bold mb-0 d-flex align-items-center">
                  <Wallet2 className="text-primary me-2" size={20} />
                  خلاصه صورتحساب
                </h5>
              </Card.Header>
              <Card.Body>
                {/* کد تخفیف */}
                <div className="mb-4">
                  <label className="fw-bold mb-2">کد تخفیف</label>
                  <div className="d-flex gap-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="کد تخفیف را وارد کنید"
                    />
                    <Button variant="outline-primary" style={{ borderColor: '#6a1b9a', color: '#6a1b9a' }}>
                      اعمال
                    </Button>
                  </div>
                </div>

                {/* محاسبات قیمت */}
                <ListGroup variant="flush" className="mb-4">
                  <ListGroup.Item className="d-flex justify-content-between px-0">
                    <span className="text-muted">مجموع کالاها:</span>
                    <span className="fw-bold">{formatPrice(subtotal)}</span>
                  </ListGroup.Item>
                  
                  <ListGroup.Item className="d-flex justify-content-between px-0">
                    <span className="text-muted">تخفیف:</span>
                    <span className="fw-bold text-success">
                      {discount > 0 ? formatPrice(discount) : '۰ تومان'}
                    </span>
                  </ListGroup.Item>
                  
                  <ListGroup.Item className="d-flex justify-content-between px-0">
                    <span className="text-muted">مالیات (۹٪):</span>
                    <span className="fw-bold">{formatPrice(tax)}</span>
                  </ListGroup.Item>
                  
                  <ListGroup.Item className="d-flex justify-content-between px-0">
                    <span className="text-muted">هزینه ارسال:</span>
                    <span className="fw-bold text-success">{formatPrice(orderDetails.deliveryCost)}</span>
                  </ListGroup.Item>
                  
                  <ListGroup.Item className="d-flex justify-content-between px-0 pt-3 border-top">
                    <span className="h5 fw-bold">مبلغ قابل پرداخت:</span>
                    <span className="h5 fw-bold text-primary">{formatPrice(finalTotal)}</span>
                  </ListGroup.Item>
                </ListGroup>

                {/* روش‌های پرداخت */}
                <div className="mb-4">
                  <label className="fw-bold mb-3">روش پرداخت</label>
                  <div className="d-flex gap-3">
                    <div className="payment-method active">
                      <CreditCard size={24} className="text-primary mb-2" />
                      <small>کارت به کارت</small>
                    </div>
                    <div className="payment-method">
                      <img 
                        src="/images/payment/zarinpal.png" 
                        alt="زرین‌پال" 
                        style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                      />
                      <small>درگاه آنلاین</small>
                    </div>
                  </div>
                </div>

                {/* دکمه پرداخت */}
                <Button
                  variant="primary"
                  size="lg"
                  className="w-100 py-3 mb-3"
                  style={{ backgroundColor: '#6a1b9a', borderColor: '#6a1b9a' }}
                  onClick={handlePayment}
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      در حال اتصال به درگاه...
                    </>
                  ) : (
                    'پرداخت و ثبت نهایی سفارش'
                  )}
                </Button>

                {/* ضمانت‌ها */}
                <div className="bg-light p-3 rounded-3">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <CheckCircle size={18} className="text-success" />
                    <small>پرداخت امن با گواهی SSL</small>
                  </div>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <CheckCircle size={18} className="text-success" />
                    <small>ضمانت بازگشت کالا تا ۷ روز</small>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <CheckCircle size={18} className="text-success" />
                    <small>پشتیبانی ۲۴ ساعته</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        .payment-method {
          flex: 1;
          text-align: center;
          padding: 16px;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .payment-method:hover {
          border-color: #6a1b9a;
          background: #f8f9fa;
        }
        
        .payment-method.active {
          border-color: #6a1b9a;
          background: rgba(106, 27, 154, 0.05);
        }
        
        .payment-method small {
          display: block;
          margin-top: 8px;
          color: #333;
          font-weight: 500;
        }
      `}</style>

      <Footer />
    </div>
  );
}