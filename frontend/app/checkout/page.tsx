'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, ListGroup, Alert, Modal } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowLeft, 
  GeoAlt, 
  Truck, 
  Clock, 
  Wallet2,
  Cart,
  Trash,
  Plus,
  Dash,
  CheckCircle,
  Search,
  X
} from 'react-bootstrap-icons';
import { useCart } from '../context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { showToast } from '@/components/ToastProvider';
import toast from 'react-hot-toast';

// کامپوننت مودال نقشه
const MapModal = ({ show, onHide, onSelectAddress }: { 
  show: boolean; 
  onHide: () => void; 
  onSelectAddress: (address: string, details: any) => void 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [step, setStep] = useState(1); // 1: انتخاب روی نقشه, 2: تکمیل آدرس
  const [addressDetails, setAddressDetails] = useState({
    plaque: '',
    unit: '',
    floor: '',
    postalCode: '',
    recipientName: '',
    recipientPhone: ''
  });

  // نقاط پیشنهادی (شبیه‌سازی جستجو)
  const suggestions = [
    { id: 1, name: 'تهران، خیابان ولیعصر، پلاک 123', lat: 35.7219, lng: 51.3347 },
    { id: 2, name: 'تهران، خیابان انقلاب، خیابان دانشگاه، پلاک 45', lat: 35.7020, lng: 51.3950 },
    { id: 3, name: 'تهران، خیابان شریعتی، خیابان ظفر، پلاک 89', lat: 35.7640, lng: 51.4430 },
  ];

  const filteredSuggestions = suggestions.filter(s => 
    s.name.includes(searchTerm) || searchTerm === ''
  );

  const handleSelectLocation = (location: any) => {
    setSelectedLocation(location);
    setStep(2);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddressDetails({
      ...addressDetails,
      [e.target.name]: e.target.value
    });
  };

  const handleConfirmAddress = () => {
    if (!selectedLocation) return;
    
    if (!addressDetails.recipientName) {
      showToast.error('لطفاً نام گیرنده را وارد کنید');
      return;
    }
    if (!addressDetails.recipientPhone) {
      showToast.error('لطفاً شماره تماس گیرنده را وارد کنید');
      return;
    }
    if (!addressDetails.postalCode) {
      showToast.error('لطفاً کد پستی را وارد کنید');
      return;
    }

    const fullAddress = `${selectedLocation.name} - پلاک ${addressDetails.plaque} - واحد ${addressDetails.unit} - طبقه ${addressDetails.floor}`;
    
    onSelectAddress(fullAddress, {
      ...addressDetails,
      ...selectedLocation
    });
    
    onHide();
    
    // Reset state after closing
    setTimeout(() => {
      setStep(1);
      setSelectedLocation(null);
      setSearchTerm('');
      setAddressDetails({
        plaque: '',
        unit: '',
        floor: '',
        postalCode: '',
        recipientName: '',
        recipientPhone: ''
      });
    }, 300);
  };

  const handleClose = () => {
    onHide();
    setTimeout(() => {
      setStep(1);
      setSelectedLocation(null);
      setSearchTerm('');
      setAddressDetails({
        plaque: '',
        unit: '',
        floor: '',
        postalCode: '',
        recipientName: '',
        recipientPhone: ''
      });
    }, 300);
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered className="map-modal">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">
          {step === 1 ? 'انتخاب آدرس روی نقشه' : 'تکمیل اطلاعات آدرس'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        {step === 1 ? (
          <>
            {/* نوار جستجو */}
            <div className="position-relative mb-4">
              <Form.Control
                type="text"
                placeholder="جستجوی آدرس..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="py-3 ps-5 rounded-3 border-2"
                style={{ borderColor: '#e0e0e0' }}
              />
              <Search className="position-absolute top-50 start-0 translate-middle-y ms-3" size={40} color="#6a1b9a" />
            </div>

            {/* نقشه (شبیه‌سازی شده) */}
            <div 
              className="bg-light rounded-3 mb-4 d-flex align-items-center justify-content-center position-relative"
              style={{ 
                height: '300px', 
                background: 'linear-gradient(45deg, #e0e0e0 25%, #f0f0f0 25%, #f0f0f0 50%, #e0e0e0 50%, #e0e0e0 75%, #f0f0f0 75%, #f0f0f0 100%)',
                backgroundSize: '56.57px 56.57px',
                cursor: 'pointer'
              }}
              onClick={() => handleSelectLocation(suggestions[0])}
            >
              <div className="text-center">
                <GeoAlt size={48} className="text-primary mb-2" />
                <p className="text-muted mb-0">برای انتخاب آدرس روی نقشه کلیک کنید</p>
              </div>
              
              {/* نشانگر موقعیت */}
              <div className="position-absolute" style={{ top: '45%', left: '55%' }}>
                <div className="bg-primary rounded-circle p-2 shadow-lg" style={{ width: '16px', height: '16px' }}></div>
                <div className="bg-primary rounded-circle position-absolute" style={{ 
                  width: '40px', 
                  height: '40px', 
                  opacity: 0.3,
                  top: '-12px',
                  left: '-12px',
                  animation: 'pulse 1.5s infinite'
                }}></div>
              </div>
            </div>

            {/* نتایج جستجو */}
            <div>
              <h6 className="fw-bold mb-3">نتایج جستجو:</h6>
              {filteredSuggestions.map(suggestion => (
                <div
                  key={suggestion.id}
                  className="p-3 border rounded-3 mb-2 cursor-pointer hover-bg-light"
                  onClick={() => handleSelectLocation(suggestion)}
                  style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <GeoAlt className="text-primary flex-shrink-0" size={20} />
                    <span>{suggestion.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* مرحله ۲: تکمیل اطلاعات آدرس */
          <div>
            <Alert variant="success" className="mb-4">
              <div className="d-flex align-items-center gap-3">
                <GeoAlt size={24} className="text-success" />
                <div>
                  <strong>آدرس انتخاب شده:</strong>
                  <p className="mb-0 mt-1">{selectedLocation?.name}</p>
                </div>
              </div>
            </Alert>

            <Form>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-bold">پلاک</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="plaque"
                    value={addressDetails.plaque}
                    onChange={handleInputChange}
                    placeholder="123" 
                    className="py-2" 
                  />
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-bold">واحد</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="unit"
                    value={addressDetails.unit}
                    onChange={handleInputChange}
                    placeholder="5" 
                    className="py-2" 
                  />
                </Col>
              </Row>

              <Row>
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-bold">طبقه</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="floor"
                    value={addressDetails.floor}
                    onChange={handleInputChange}
                    placeholder="3" 
                    className="py-2" 
                  />
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-bold">کد پستی</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="postalCode"
                    value={addressDetails.postalCode}
                    onChange={handleInputChange}
                    placeholder="1234567890" 
                    className="py-2" 
                  />
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">نام گیرنده</Form.Label>
                <Form.Control 
                  type="text" 
                  name="recipientName"
                  value={addressDetails.recipientName}
                  onChange={handleInputChange}
                  placeholder="علی محمدی" 
                  className="py-2" 
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">شماره تماس گیرنده</Form.Label>
                <Form.Control 
                  type="tel" 
                  name="recipientPhone"
                  value={addressDetails.recipientPhone}
                  onChange={handleInputChange}
                  placeholder="09123456789" 
                  className="py-2" 
                />
              </Form.Group>
            </Form>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer className="border-0 pt-0">
        {step === 1 ? (
          <Button variant="secondary" onClick={handleClose} className="px-4">
            بستن
          </Button>
        ) : (
          <div className="d-flex gap-2 w-100">
            <Button variant="secondary" onClick={() => setStep(1)} className="px-4">
              بازگشت به نقشه
            </Button>
            <Button 
              variant="primary" 
              onClick={handleConfirmAddress}
              className="flex-grow-1"
              style={{ backgroundColor: '#6a1b9a', borderColor: '#6a1b9a' }}
            >
              تأیید و انتخاب آدرس
            </Button>
          </div>
        )}
      </Modal.Footer>

      <style jsx>{`
        .hover-bg-light:hover {
          background-color: #f8f9fa !important;
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.5); opacity: 0.1; }
          100% { transform: scale(1); opacity: 0.3; }
        }
      `}</style>
    </Modal>
  );
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedAddressDetails, setSelectedAddressDetails] = useState<any>(null);
  const [selectedDeliveryDate, setSelectedDeliveryDate] = useState('');
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState('');
  const [deliveryCost, setDeliveryCost] = useState(29000);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);

  // تاریخ‌های ارسال (3 روز آینده)
  const deliveryDates = [
    { 
      id: 1, 
      date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toLocaleDateString('fa-IR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      raw: '2024-02-20',
      label: 'فردا'
    },
    { 
      id: 2, 
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('fa-IR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      raw: '2024-02-21',
      label: 'پس‌فردا'
    },
    { 
      id: 3, 
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('fa-IR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      raw: '2024-02-22',
      label: 'سه روز دیگر'
    },
  ];

  // ساعت‌های ارسال (3 بازه زمانی)
  const deliveryTimes = [
    { id: 1, time: '9 صبح تا 12 ظهر', start: '09:00', end: '12:00' },
    { id: 2, time: '12 ظهر تا 18 عصر', start: '12:00', end: '18:00' },
    { id: 3, time: '18 عصر تا 22 شب', start: '18:00', end: '22:00' },
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }

    // اگر سبد خرید خالی بود، به صفحه محصولات برگرد
    if (items.length === 0) {
      showToast.error('سبد خرید شما خالی است');
      router.push('/products');
    }
  }, [items.length, router]);

  const handleAddressSelect = (address: string, details: any) => {
    setSelectedAddress(address);
    setSelectedAddressDetails(details);
    showToast.success('آدرس با موفقیت انتخاب شد');
  };

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      showToast.error('لطفاً آدرس خود را انتخاب کنید');
      return;
    }
    if (!selectedDeliveryDate) {
      showToast.error('لطفاً تاریخ ارسال را انتخاب کنید');
      return;
    }
    if (!selectedDeliveryTime) {
      showToast.error('لطفاً ساعت ارسال را انتخاب کنید');
      return;
    }

    // ذخیره اطلاعات سفارش در localStorage
    const orderDetails = {
      address: selectedAddress,
      addressDetails: selectedAddressDetails,
      deliveryDate: selectedDeliveryDate,
      deliveryTime: selectedDeliveryTime,
      deliveryCost: deliveryCost,
      recipientName: selectedAddressDetails?.recipientName || user?.name || 'کاربر مهمان',
      recipientPhone: selectedAddressDetails?.recipientPhone || user?.phone || '۰۹۱۲۳۴۵۶۷۸۹'
    };
    
    localStorage.setItem('currentOrder', JSON.stringify(orderDetails));
    
    // انتقال به صفحه بررسی نهایی
    router.push('/checkout/review');
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('fa-IR') + ' تومان';
  };

  return (
    <div>
      <Header />
      
      {/* مودال نقشه */}
      <MapModal 
        show={showMapModal} 
        onHide={() => setShowMapModal(false)} 
        onSelectAddress={handleAddressSelect}
      />

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
          <h2 className="mb-0">تکمیل سفارش</h2>
        </div>

        <Row>
          {/* ستون راست - فرم ثبت سفارش */}
          <Col lg={7} className="order-2 order-lg-1">
            {/* اطلاعات کاربر */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body>
                <h5 className="fw-bold mb-4">اطلاعات گیرنده</h5>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Label className="text-muted small">نام و نام خانوادگی</Form.Label>
                    <p className="fw-bold">{user?.name || 'کاربر مهمان'}</p>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label className="text-muted small">شماره موبایل</Form.Label>
                    <p className="fw-bold">{user?.phone || '09123456789'}</p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* انتخاب آدرس از روی نقشه */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body>
                <h5 className="fw-bold mb-4 d-flex align-items-center">
                  <GeoAlt className="text-primary me-2" size={20} />
                  انتخاب آدرس تحویل
                </h5>

                {!selectedAddress ? (
                  <div 
                    className="bg-light rounded-3 p-5 text-center cursor-pointer"
                    onClick={() => setShowMapModal(true)}
                    style={{ cursor: 'pointer' }}
                  >
                    <GeoAlt size={48} className="text-primary mb-3" />
                    <h6 className="fw-bold mb-2">برای انتخاب آدرس کلیک کنید</h6>
                    <p className="text-muted small mb-0">
                      با کلیک روی این بخش، نقشه باز می‌شود و می‌توانید آدرس خود را انتخاب کنید
                    </p>
                  </div>
                ) : (
                  <div>
                    <Alert variant="success" className="d-flex align-items-center gap-3">
                      <GeoAlt size={24} className="text-success flex-shrink-0" />
                      <div className="flex-grow-1">
                        <strong>آدرس انتخاب شده:</strong>
                        <p className="mb-0 mt-1">{selectedAddress}</p>
                        {selectedAddressDetails && (
                          <>
                            <p className="mb-0 small mt-2">
                              <strong>گیرنده:</strong> {selectedAddressDetails.recipientName} - 
                              <strong>شماره تماس:</strong> {selectedAddressDetails.recipientPhone}
                            </p>
                          </>
                        )}
                      </div>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => setShowMapModal(true)}
                        style={{ borderColor: '#6a1b9a', color: '#6a1b9a' }}
                      >
                        تغییر آدرس
                      </Button>
                    </Alert>
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* انتخاب زمان ارسال */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body>
                <h5 className="fw-bold mb-4 d-flex align-items-center">
                  <Clock className="text-primary me-2" size={20} />
                  انتخاب زمان ارسال
                </h5>

                <div className="mb-4">
                  <Form.Label className="fw-bold mb-3">تاریخ ارسال</Form.Label>
                  <div className="d-flex gap-3 flex-wrap">
                    {deliveryDates.map((date) => (
                      <div
                        key={date.id}
                        className={`flex-grow-1 p-3 rounded-3 border text-center cursor-pointer transition ${
                          selectedDeliveryDate === date.date
                            ? 'border-primary bg-primary text-white'
                            : 'border-light bg-light'
                        }`}
                        onClick={() => setSelectedDeliveryDate(date.date)}
                        style={{ cursor: 'pointer', minWidth: '120px' }}
                      >
                        <div className="fw-bold mb-1">{date.label}</div>
                        <small>{date.date}</small>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Form.Label className="fw-bold mb-3">ساعت ارسال</Form.Label>
                  <div className="d-flex gap-3 flex-wrap">
                    {deliveryTimes.map((time) => (
                      <div
                        key={time.id}
                        className={`flex-grow-1 p-3 rounded-3 border text-center cursor-pointer transition ${
                          selectedDeliveryTime === time.time
                            ? 'border-primary bg-primary text-white'
                            : 'border-light bg-light'
                        }`}
                        onClick={() => setSelectedDeliveryTime(time.time)}
                        style={{ cursor: 'pointer', minWidth: '120px' }}
                      >
                        <Clock className="mb-2" size={18} />
                        <div className="fw-bold">{time.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* ستون چپ - خلاصه سفارش و محصولات */}
          <Col lg={5} className="order-1 order-lg-2">
            <Card className="border-0 shadow-sm sticky-lg-top" style={{ top: '90px' }}>
              <Card.Body>
                <h5 className="fw-bold mb-4">خلاصه سفارش</h5>

                {/* لیست محصولات */}
                <div className="mb-4" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {items.map((item) => (
                    <div key={item.id} className="d-flex gap-3 mb-3 pb-3 border-bottom">
                      <div style={{ width: '130px', height: '80px', position: 'relative' }}>
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          sizes="70px"
                          style={{ objectFit: 'cover', borderRadius: '8px' }}
                        />
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="fw-bold mb-1">{item.name}</h6>
                        <p className="text-muted small mb-1">تعداد: {item.quantity}</p>
                        <p className="text-primary fw-bold mb-0">
                          {formatPrice(item.finalPrice * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* خلاصه قیمت‌ها */}
                <ListGroup variant="flush" className="mb-4">
                  <ListGroup.Item className="d-flex justify-content-between px-0">
                    <span className="text-muted">مجموع کالاها:</span>
                    <span className="fw-bold">{formatPrice(getTotalPrice())}</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between px-0">
                    <span className="text-muted">هزینه ارسال:</span>
                    <span className="fw-bold text-success">{formatPrice(deliveryCost)}</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between px-0 pt-3">
                    <span className="h5 fw-bold">قابل پرداخت:</span>
                    <span className="h5 fw-bold text-primary">
                      {formatPrice(getTotalPrice() + deliveryCost)}
                    </span>
                  </ListGroup.Item>
                </ListGroup>

                {/* دکمه ثبت سفارش */}
                <Button
                  variant="primary"
                  size="lg"
                  className="w-100 py-3"
                  style={{ backgroundColor: '#6a1b9a', borderColor: '#6a1b9a' }}
                  onClick={handlePlaceOrder}
                  disabled={!selectedAddress || !selectedDeliveryDate || !selectedDeliveryTime}
                >
                  ثبت سفارش
                </Button>

                <p className="text-muted text-center small mt-3 mb-0">
                  با ثبت سفارش، <Link href="/terms" style={{ color: '#6a1b9a' }}>قوانین و مقررات</Link> را می‌پذیرید.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Footer />
    </div>
  );
}