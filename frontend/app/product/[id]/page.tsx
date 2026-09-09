'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { Cart, Heart, Share, ArrowLeft, CheckCircle, Truck, ShieldCheck, Clock } from 'react-bootstrap-icons';
import { showToast } from '@/components/ToastProvider';
import toast from 'react-hot-toast';
import { useCart } from '../../../app/context/CartContext';
import { PRODUCTS } from '@/lib/mock-data';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [quantity, setQuantity] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isInCartState, setIsInCartState] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const { addToCart, isInCart } = useCart();

  const data = { product: PRODUCTS.find((p) => p.id === productId) ?? null };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    if (data?.product) {
      setIsInCartState(isInCart(data.product.id));
      
      // بررسی وضعیت علاقه‌مندی از localStorage
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setIsFavorite(favorites.includes(data.product.id));
    }
  }, [data, isInCart]);

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      localStorage.setItem('redirectAfterLogin', `/product/${productId}`);
      showToast.warning('برای خرید باید وارد حساب کاربری خود شوید');
      setTimeout(() => router.push('/login'), 2000);
      return;
    }

    const product = data?.product;
    if (!product) return;
    
    addToCart(product, quantity);
    setIsInCartState(true);
    showToast.success(`${product.name} به سبد خرید اضافه شد`);
  };

  const handleViewCart = () => {
    router.push('/cart');
  };

  const handleBuyNow = () => {
    if (!isLoggedIn) {
      localStorage.setItem('redirectAfterLogin', `/product/${productId}`);
      showToast.warning('برای خرید باید وارد حساب کاربری خود شوید');
      setTimeout(() => router.push('/login'), 2000);
      return;
    }

    const product = data?.product;
    if (!product) return;
    
    addToCart(product, quantity);
    router.push('/cart');
  };

  const handleToggleFavorite = () => {
    if (!isLoggedIn) {
      showToast.warning('برای افزودن به علاقه‌مندی‌ها وارد شوید');
      setTimeout(() => router.push('/login'), 2000);
      return;
    }

    const product = data?.product;
    if (!product) return;

    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (isFavorite) {
      // حذف از علاقه‌مندی‌ها
      const newFavorites = favorites.filter((id: string) => id !== product.id);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      setIsFavorite(false);
      showToast.info(`${product.name} از علاقه‌مندی‌ها حذف شد`);
    } else {
      // افزودن به علاقه‌مندی‌ها
      favorites.push(product.id);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      setIsFavorite(true);
      showToast.success(`${product.name} به علاقه‌مندی‌ها اضافه شد`);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast.info('لینک محصول کپی شد');
  };

  const product = data?.product;
  
  if (!product) return (
    <div>
      <Header />
      <Container className="text-center py-5">
        <h3>محصول یافت نشد</h3>
        <Button variant="primary" onClick={() => router.back()} className="mt-3">
          بازگشت
        </Button>
      </Container>
      <Footer />
    </div>
  );

  const images = product.imageUrl ? [product.imageUrl] : ['/images/placeholder.jpg'];

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
          <Link href="/" className="text-decoration-none text-muted">خانه</Link>
          <span className="mx-2 text-muted">/</span>
          <Link href="/products" className="text-decoration-none text-muted">محصولات</Link>
          <span className="mx-2 text-muted">/</span>
          <span className="text-primary">{product.name}</span>
        </div>

        <Row>
          {/* تصویر محصول */}
          <Col lg={6} className="mb-4">
            <Card className="border-0 shadow-sm">
              <div className="position-relative" style={{ height: '200px' ,  backgroundColor: '#f8f9fa' }}>
                <Image
                  src={images[0]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 150vw"
                  style={{ objectFit: 'contain' }}
                  className="p-3"
                  priority
                />
                {product.discount > 0 && (
                  <Badge 
                    bg="danger" 
                    className="position-absolute top-0 end-0 m-3"
                    style={{ fontSize: '1rem', padding: '8px 15px' }}
                  >
                    {product.discount}% تخفیف
                  </Badge>
                )}
              </div>
            </Card>
          </Col>

          {/* اطلاعات محصول */}
          <Col lg={6}>
            <Card className="border-0 shadow-sm p-4">
              <h1 className="h2 fw-bold mb-3">{product.name}</h1>
              
              <div className="d-flex align-items-center gap-3 mb-3">
                <span className="text-muted">برند: {product.brand || 'نامشخص'}</span>
                <span className="text-muted">دسته: {product.category || 'عمومی'}</span>
              </div>

              <div className="mb-4">
                {product.discount > 0 ? (
                  <div>
                    <span className="text-muted text-decoration-line-through fs-5">
                      {product.price.toLocaleString()} تومان
                    </span>
                    <span className="h2 text-primary fw-bold me-3">
                      {product.finalPrice.toLocaleString()} تومان
                    </span>
                    <Badge bg="danger" className="fs-6">
                      {product.discount}% تخفیف
                    </Badge>
                  </div>
                ) : (
                  <span className="h2 text-primary fw-bold">
                    {product.price.toLocaleString()} تومان
                  </span>
                )}
              </div>

              <div className="mb-4">
                {product.stock > 0 ? (
                  <div className="d-flex align-items-center text-success">
                    <CheckCircle className="me-2" />
                    <span>موجود در انبار ({product.stock} عدد)</span>
                  </div>
                ) : (
                  <div className="d-flex align-items-center text-danger">
                    <span>ناموجود</span>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="fw-bold mb-2">تعداد:</label>
                <div className="d-flex align-items-center gap-3">
                <Button 
                    variant="outline-secondary" 
                    size="sm"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    style={{ width: '32px', height: '32px', padding: 0 }}
                  >

                    +
                  </Button>
                  <span className="fs-5 fw-bold">{quantity}</span>


                  <Button 
                    variant="outline-secondary" 
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    style={{ width: '32px', height: '32px', padding: 0 }}
                  >

                    -
                  </Button>
                  <span className="text-muted me-3">از {product.stock} عدد</span>
                </div>
              </div>

              <div className="d-flex gap-2 mb-4">
                {!isInCartState ? (
                  <Button 
                    variant="primary" 
                    size="lg"
                    className="flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                    style={{ backgroundColor: '#6a1b9a', borderColor: '#6a1b9a', height: '48px' }}
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                  >
                    <Cart size={18} />
                    افزودن به سبد خرید
                  </Button>
                ) : (
                  <Button 
                    variant="light" 
                    size="lg"
                    className="flex-grow-1 d-flex align-items-center justify-content-center gap-2 border"
                    style={{ 
                      backgroundColor: 'white', 
                      color: '#6a1b9a',
                      border: '2px solid #6a1b9a',
                      fontWeight: 'bold',
                      height: '48px'
                    }}
                    onClick={handleViewCart}
                  >
                    <Cart size={18} />
                    مشاهده سبد خرید
                  </Button>
                )}
                
                <Button 
                  variant="success" 
                  size="lg"
                  className="d-flex align-items-center justify-content-center gap-2"
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  style={{ height: '48px' }}
                >
                  خرید مستقیم
                </Button>
              </div>

              <div className="d-flex gap-2 mb-4">
                <Button 
                  variant={isFavorite ? "danger" : "outline-danger"}
                  size="lg"
                  className="flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                  onClick={handleToggleFavorite}
                  style={{ height: '45px' }}
                >
                  <Heart size={18} className={isFavorite ? "text-white" : "text-danger"} />
                  {isFavorite ? 'در علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی'}
                </Button>
                <Button 
                  variant="outline-secondary" 
                  size="lg"
                  className="flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                  onClick={handleShare}
                  style={{ height: '45px' }}
                >
                  <Share size={18} />
                  اشتراک‌گذاری
                </Button>
              </div>

              <div className="bg-light p-3 rounded" style={{ fontSize: '0.9rem' }}>
                <div className="d-flex align-items-center gap-3 mb-2">
                  <Truck size={18} className="text-primary" />
                  <span>ارسال رایگان برای خریدهای بالای ۲۰۰ هزار تومان</span>
                </div>
                <div className="d-flex align-items-center gap-3 mb-2">
                  <Clock size={18} className="text-primary" />
                  <span>تحویل ۲ تا ۴ روز کاری</span>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <ShieldCheck size={18} className="text-primary" />
                  <span>گارانتی اصالت و سلامت کالا</span>
                </div>
              </div>

              {isInCartState && (
                <div className="mt-3 text-center">
                  <Badge bg="success" className="p-2">
                    این محصول به سبد خرید اضافه شده است
                  </Badge>
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </Container>

      <Footer />
    </div>
  );
}