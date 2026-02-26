'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import ProductCard from '@/components/ProductCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, ChevronLeft } from 'react-bootstrap-icons';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS, GET_ACTIVE_CATEGORY_IMAGES } from '@/lib/graphql-queries';
import CategorySections from '@/components/CategorySections';
import BestSellers from '@/components/BestSellers';
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import stoneImage from "../public/images/banners/123.png"

loadDevMessages();
loadErrorMessages();

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredBrand, setHoveredBrand] = useState<number | null>(null);
  const [hoveredFeatured, setHoveredFeatured] = useState<string | null>(null);
  const [hoveredSale, setHoveredSale] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [featuredPage, setFeaturedPage] = useState(0);
  const [salePage, setSalePage] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const router = useRouter();

  const { loading: productsLoading, error: productsError, data: productsData } = useQuery(GET_PRODUCTS);
  const { loading: categoriesLoading, error: categoriesError, data: categoriesData } = useQuery(GET_ACTIVE_CATEGORY_IMAGES);

  const itemsPerPage = 4;

  const sliderImages = [
    '/images/banners/AA.png',
    '/images/banners/BB.png',
    '/images/banners/CC.png',
    '/images/banners/DD.png',
    '/images/banners/EE.webp'
  ];

  const circleSliderItems = [
    {
      id: 1,
      image: 'https://dkstatics-public.digikala.com/digikala-content-x-post-media/91c65b6c948ea547921a93ef7391894287ae34d6_1766333864.jpg?x-oss-process=image/resize,m_fill,h_115,w_115',
      title: 'یکی از عجیب ترین خوش...'
    },
    {
      id: 2,
      image: 'https://dkstatics-public.digikala.com/digikala-content-x-post-media/1d9e7bd16189fd339f22a056dd61e0d30e8bf9ae_1768470540.jpg?x-oss-process=image/resize,m_fill,h_115,w_115',
      title: 'ابرو هاتو طبیعی حالت...'
    },
    {
      id: 3,
      image: 'https://dkstatics-public.digikala.com/digikala-content-x-post-media/ac71f16505fff48b7971735d51cea6da06768cc7_1767415636.jpg?x-oss-process=image/resize,m_fill,h_115,w_115',
      title: 'ساخت نیمکت چوب و سیم...'
    },
    {
      id: 4,
      image: 'https://dkstatics-public.digikala.com/digikala-content-x-post-media/2c27be8081d0883b7b55b6fe3e3b58a459b5badd_1769551937.jpg?x-oss-process=image/resize,m_fill,h_115,w_115',
      title: 'تو هر موقعیتی، نجات‌...'
    },
    {
      id: 5,
      image: 'https://dkstatics-public.digikala.com/digikala-content-x-post-media/99badfcebf995e41d04f08a98d9220c26b54b5df_1768204386.jpg?x-oss-process=image/resize,m_fill,h_115,w_115',
      title: 'جا مته‌ای ۷۵ سوراخ!'
    },
    {
      id: 6,
      image: 'https://dkstatics-public.digikala.com/digikala-content-x-post-media/9de85f42787e21d1a37e373e4e49a585bc628524_1768469771.jpg?x-oss-process=image/resize,m_fill,h_115,w_115',
      title: 'کانسیلر با پیگمنت با...'
    },
    {
      id: 7,
      image: 'https://dkstatics-public.digikala.com/digikala-content-x-post-media/c89660d790d683ff92e7a3aa4e7958d095107172_1767521278.jpg?x-oss-process=image/resize,m_fill,h_115,w_115',
      title: 'ساخت جامدادی با ابزا...'
    },
    {
      id: 8,
      image: 'https://dkstatics-public.digikala.com/digikala-content-x-post-media/f3dcdea13f34c57ed1bf6e911332e7582098c9a5_1767707615.jpg?x-oss-process=image/resize,m_fill,h_115,w_115',
      title: 'سه‌پایه Puluz PU3096...'
    }
  ];

  const brands = [
    { id: 1, image: '/images/products/app.webp', nameEn: 'apple', productCount: 0 },
    { id: 2, image: '/images/products/sam.webp', nameEn: 'samsung', productCount: 0 },
    { id: 3, image: '/images/products/so.webp', nameEn: 'sony', productCount: 0 },
    { id: 4, image: '/images/products/lg.webp', nameEn: 'lg', productCount: 0 },
    { id: 5, image: '/images/products/haylou.webp', nameEn: 'haylou', productCount: 0 },
    { id: 6, image: '/images/products/jbl.webp',  nameEn: 'jbl', productCount: 0 },
    { id: 7, image: '/images/products/noki.webp', nameEn: 'nokia', productCount: 0 },
    { id: 8, image: '/images/products/tp.webp', nameEn: 'tp-link', productCount: 0 },
    { id: 9, image: '/images/products/tsco.webp',  nameEn: 'tesco', productCount: 0 },
    { id: 10, image: '/images/products/anker.webp', nameEn: 'anker', productCount: 0 },
    { id: 11, image: '/images/products/as.webp',  nameEn: 'acer', productCount: 0 },
    { id: 12, image: '/images/products/as.webp',  nameEn: 'asus', productCount: 0 }
  ];

  useEffect(() => {
    if (!isHovering) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isHovering]);

  useEffect(() => {
    if (productsData?.products) {
      const products = productsData.products;
      brands.forEach(brand => {
        const count = products.filter((p: any) => 
          p.brand?.toLowerCase() === brand.nameEn.toLowerCase()
        ).length;
        brand.productCount = count;
      });
    }
  }, [productsData]);

  if (productsLoading || categoriesLoading) return (
    <div>
      <Header />
      <Container className="mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">در حال بارگذاری...</span>
        </div>
        <p className="mt-2">در حال بارگذاری محصولات...</p>
      </Container>
      <Footer />
    </div>
  );

  if (productsError || categoriesError) return (
    <div>
      <Header />
      <Container className="mt-5 text-center">
        <div className="alert alert-danger" role="alert">
          خطا در بارگذاری: {productsError?.message || categoriesError?.message}
        </div>
      </Container>
      <Footer />
    </div>
  );

  const products = productsData?.products || [];
  const categoryImages = categoriesData?.activeCategoryImages || [];
  
  const featuredProducts = products.slice(0, 8);
  const onSaleProducts = products.filter((p: any) => p.discount > 0).slice(0, 8);
  
  const totalFeaturedPages = Math.ceil(featuredProducts.length / itemsPerPage);
  const totalSalePages = Math.ceil(onSaleProducts.length / itemsPerPage);
  
  const featuredToShow = featuredProducts.slice(
    featuredPage * itemsPerPage, 
    (featuredPage + 1) * itemsPerPage
  );
  
  const saleToShow = onSaleProducts.slice(
    salePage * itemsPerPage, 
    (salePage + 1) * itemsPerPage
  );

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextFeaturedPage = () => {
    setFeaturedPage((prev) => (prev + 1) % totalFeaturedPages);
  };

  const prevFeaturedPage = () => {
    setFeaturedPage((prev) => (prev - 1 + totalFeaturedPages) % totalFeaturedPages);
  };

  const nextSalePage = () => {
    setSalePage((prev) => (prev + 1) % totalSalePages);
  };

  const prevSalePage = () => {
    setSalePage((prev) => (prev - 1 + totalSalePages) % totalSalePages);
  };

  const handleBrandClick = (brand: any) => {
    router.push(`/products?brand=${brand.nameEn}`);
  };

  const handleCategoryClick = (link: string) => {
    router.push(link);
  };

  return (
    <div>
      <Header />
      
      {/* ========== اسلایدر دایره‌ای بالا ========== */}
      <section className="pt-1 pb-1" style={{ backgroundColor: 'white' }}>
        <Container>
          <div className="position-relative">
            <div className="overflow-hidden">
              <div className="d-flex gap-3" style={{ overflowX: 'auto', padding: '10px 0' }}>
                {circleSliderItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex-shrink-0 text-center cursor-pointer"
                    style={{ width: '100px' }}
                    onClick={() => router.push(`/content/${item.id}`)}
                  >
                    <div className="position-relative mx-auto" style={{ width: '84px', height: '84px' }}>
                      <div className="rounded-circle overflow-hidden bg-white shadow-sm border border-light">
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={84}
                          height={84}
                          className="rounded-circle"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    </div>
                    <div className="mt-2 text-center" style={{ fontSize: '0.75rem', color: '#212529' }}>
                      {item.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <Button 
              variant="outline-secondary" 
              className="rounded-circle d-none d-lg-flex align-items-center justify-content-center border-2 position-absolute"
              style={{ 
                width: '40px', 
                height: '40px', 
                backgroundColor: 'white',
                zIndex: 10,
                top: '50%',
                right: '-20px',
                transform: 'translateY(-50%)'
              }}
              onClick={() => {
                const container = document.querySelector('.d-flex.gap-3');
                if (container) {
                  container.scrollBy({ left: 200, behavior: 'smooth' });
                }
              }}
            >
              <ChevronLeft size={20} className="text-secondary" />
            </Button>
            
            <Button 
              variant="outline-secondary" 
              className="rounded-circle d-none d-lg-flex align-items-center justify-content-center border-2 position-absolute"
              style={{ 
                width: '40px', 
                height: '40px', 
                backgroundColor: 'white',
                zIndex: 10,
                top: '50%',
                left: '-20px',
                transform: 'translateY(-50%)'
              }}
              onClick={() => {
                const container = document.querySelector('.d-flex.gap-3');
                if (container) {
                  container.scrollBy({ left: -200, behavior: 'smooth' });
                }
              }}
            >
              <ChevronRight size={20} className="text-secondary" />
            </Button>
          </div>
        </Container>
      </section>
      
      {/* ========== بخش قهرمانی ========== */}      
      <section className="bg-primary text-white py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h1 className="display-5 fw-bold mb-4">بهترین محصولات را از ما بخرید</h1>
              <p className="lead mb-4">
                کشف کنید و خرید کنید از میان هزاران محصول با کیفیت بالا با قیمت‌های استثنایی
              </p>
              <div className="d-flex gap-3">
                <Link href="/products">
                  <button className="btn btn-light btn-lg">
                    مشاهده محصولات
                  </button>
                </Link>
                <Link href="/about">
                  <button className="btn btn-outline-light btn-lg">
                    درباره ما
                  </button>
                </Link>
              </div>
            </Col>
            <Col lg={6}>
              <div className="position-relative" style={{ height: '300px' }}>
                <Image
                  src="/images/products/alp.avif"
                  alt="محصولات ویژه"
                  fill
                  style={{ objectFit: 'cover', borderRadius: '20px' }}
                  className="shadow-lg"
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ========== اسلایدر اصلی ========== */}
      <section className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={1} className="d-flex justify-content-center">
              <Button 
                variant="outline-dark" 
                className="rounded-circle d-flex align-items-center justify-content-center border-2"
                style={{ width: '50px', height: '50px', backgroundColor: 'rgba(255,255,255,0.8)' }}
                onClick={prevSlide}
              >
                <ChevronRight size={24} className="text-dark" />
              </Button>
            </Col>
            
            <Col lg={10}>
              <div 
                className="position-relative" 
                style={{ height: '400px' }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <div className="d-flex align-items-center justify-content-center h-100">
                  <Link href={`/landing/special-offer?slide=${currentSlide}`} className="block w-full h-full" target="_blank">
                    <Image
                      src={sliderImages[currentSlide]}
                      alt="اسلایدر"
                      fill
                      style={{ 
                        objectFit: 'cover', 
                        borderRadius: '40px'
                      }}
                      className="shadow-lg"
                      priority
                    />
                  </Link>
                </div>
              </div>
              
              <div className="d-flex justify-content-center gap-2 mt-3">
                {sliderImages.map((_, index) => (
                  <button 
                    key={index}
                    className={`btn ${index === currentSlide ? 'btn-primary' : 'btn-outline-primary'} rounded-circle`}
                    style={{ width: '12px', height: '12px', padding: 0 }}
                    onClick={() => goToSlide(index)}
                  >
                    &nbsp;
                  </button>
                ))}
              </div>
            </Col>
            
            <Col lg={1} className="d-flex justify-content-center">
              <Button 
                variant="outline-dark" 
                className="rounded-circle d-flex align-items-center justify-content-center border-2"
                style={{ width: '50px', height: '50px', backgroundColor: 'rgba(255,255,255,0.8)' }}
                onClick={nextSlide}
              >
                <ChevronLeft size={24} className="text-dark" />
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      <Container>
        {/* ========== محصولات ویژه ========== */}
        <section className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="h3 fw-bold mt-5">محصولات ویژه</h2>
            <Link href="/products" className="text-decoration-none d-flex align-items-center">
              مشاهده همه
              <ArrowLeft className="me-2" />
            </Link>
          </div>
          
          <Row className="align-items-center">
            <Col xs={1} className="d-flex justify-content-center">
              <Button 
                variant="outline-primary" 
                className="rounded-circle d-flex align-items-center justify-content-center border-2"
                style={{ width: '50px', height: '50px', backgroundColor: 'white' }}
                onClick={prevFeaturedPage}
              >
                <ChevronRight size={24} className="text-primary" />
              </Button>
            </Col>
            
            <Col xs={10}>
              <Row>
                {featuredToShow.map((product: any) => (
                  <Col 
                    key={product.id} 
                    xs={12} 
                    sm={6} 
                    md={4} 
                    lg={3} 
                    className="mb-4"
                    onMouseEnter={() => setHoveredFeatured(product.id)}
                    onMouseLeave={() => setHoveredFeatured(null)}
                  >
                    <div 
                      className="product-card-wrapper position-relative rounded overflow-hidden"
                      style={{
                        border: hoveredFeatured === product.id ? '3px solid #0d6efd' : '1px solid #dee2e6',
                        borderRadius: '10px',
                        transition: 'all 0.3s ease',
                        transform: hoveredFeatured === product.id ? 'scale(1.02)' : 'scale(1)',
                        boxShadow: hoveredFeatured === product.id ? '0 10px 20px rgba(13, 110, 253, 0.2)' : '0 2px 5px rgba(0,0,0,0.1)'
                      }}
                    >
                      <ProductCard 
                        product={product}
                        showBadge={true}
                        badgeText="ویژه"
                        badgeColor="primary"
                        priceColor="text-dark"
                      />
                    </div>
                  </Col>
                ))}
              </Row>
              
              <div className="d-flex justify-content-center gap-2 mt-3">
                {Array.from({ length: totalFeaturedPages }).map((_, index) => (
                  <button 
                    key={index}
                    className={`btn ${index === featuredPage ? 'btn-primary' : 'btn-outline-primary'} rounded-circle`}
                    style={{ width: '12px', height: '12px', padding: 0 }}
                    onClick={() => setFeaturedPage(index)}
                  >
                    &nbsp;
                  </button>
                ))}
              </div>
            </Col>
            
            <Col xs={1} className="d-flex justify-content-center">
              <Button 
                variant="outline-primary" 
                className="rounded-circle d-flex align-items-center justify-content-center border-2"
                style={{ width: '50px', height: '50px', backgroundColor: 'white' }}
                onClick={nextFeaturedPage}
              >
                <ChevronLeft size={24} className="text-primary" />
              </Button>
            </Col>
          </Row>
          </section>
          
          {/* ========== بنر سنگ‌ها - با عنوان جداگانه ========== */}
          <Container className="my-5" fluid>
            {/* عنوان و دکمه در بالای عکس */}
            <Row className="mb-5">
              <Col className="text-center">
                <h1 className="display-3 fw-bold mb-3" style={{ color: '#6a1b9a' }}>
                  سنگ‌های تزئینی
                </h1>
                <p className="lead fs-3 text-muted mb-4">
                  کیفیت عالی، قیمت مناسب، تنوع بی‌نظیر
                </p>
                <Link href="/stones">
                  <Button 
                    variant="primary" 
                    size="lg"
                    className="px-5 py-3 fw-bold"
                    style={{ 
                      backgroundColor: '#6a1b9a', 
                      borderColor: '#6a1b9a',
                      borderRadius: '50px',
                      fontSize: '1.2rem'
                    }}
                  >
                    مشاهده محصولات
                  </Button>
                </Link>
              </Col>
            </Row>

            {/* عکس با نمایش کامل و بدون حاشیه */}
            <Row className="g-0">
              <Col>
                <div className="position-relative w-100" style={{ height: '600px', backgroundColor: '#f5f5f5', overflow: 'hidden' }}>
                  <Image
                    src={stoneImage}
                    alt="سنگ‌های تزئینی"
                    fill
                    sizes="100vw"
                    className="rounded-4 shadow-lg"
                    style={{ 
                      objectFit: 'cover',
                      objectPosition: 'center'
                    }}
                    priority
                  />
                </div>
              </Col>
            </Row>
          </Container>

        {/* ========== تخفیف‌های ویژه ========== */}
        <section className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="h3 fw-bold">تخفیف‌های ویژه</h2>
            <Link href="/products?filter=discount" className="text-decoration-none d-flex align-items-center">
              مشاهده همه
              <ArrowLeft className="me-2" />
            </Link>
          </div>
          
          <Row className="align-items-center">
            <Col xs={1} className="d-flex justify-content-center">
              <Button 
                variant="outline-danger" 
                className="rounded-circle d-flex align-items-center justify-content-center border-2"
                style={{ width: '50px', height: '50px', backgroundColor: 'white' }}
                onClick={prevSalePage}
              >
                <ChevronRight size={24} className="text-danger" />
              </Button>
            </Col>
            
            <Col xs={10}>
              <Row>
                {saleToShow.map((product: any) => {
                  const discountPercentage = product.discount || 0;
                  return (
                    <Col 
                      key={product.id} 
                      xs={12} 
                      sm={6} 
                      md={4} 
                      lg={3} 
                      className="mb-4"
                      onMouseEnter={() => setHoveredSale(product.id)}
                      onMouseLeave={() => setHoveredSale(null)}
                    >
                      <div 
                        className="product-card-wrapper position-relative rounded overflow-hidden"
                        style={{
                          border: hoveredSale === product.id ? '3px solid #dc3545' : '1px solid #dee2e6',
                          borderRadius: '10px',
                          transition: 'all 0.3s ease',
                          transform: hoveredSale === product.id ? 'scale(1.02)' : 'scale(1)',
                          boxShadow: hoveredSale === product.id ? '0 10px 20px rgba(220, 53, 69, 0.2)' : '0 2px 5px rgba(0,0,0,0.1)'
                        }}
                      >
                        <ProductCard 
                          product={product}
                          showBadge={true}
                          badgeText={`${discountPercentage}% تخفیف`}
                          badgeColor="danger"
                          priceColor="text-danger"
                        />
                      </div>
                    </Col>
                  );
                })}
              </Row>
              
              <div className="d-flex justify-content-center gap-2 mt-3">
                {Array.from({ length: totalSalePages }).map((_, index) => (
                  <button 
                    key={index}
                    className={`btn ${index === salePage ? 'btn-danger' : 'btn-outline-danger'} rounded-circle`}
                    style={{ width: '12px', height: '12px', padding: 0 }}
                    onClick={() => setSalePage(index)}
                  >
                    &nbsp;
                  </button>
                ))}
              </div>
            </Col>
            
            <Col xs={1} className="d-flex justify-content-center">
              <Button 
                variant="outline-danger" 
                className="rounded-circle d-flex align-items-center justify-content-center border-2"
                style={{ width: '50px', height: '50px', backgroundColor: 'white' }}
                onClick={nextSalePage}
              >
                <ChevronLeft size={24} className="text-danger" />
              </Button>
            </Col>
          </Row>
        </section>

        {/* ========== گالری ۴ عکس دسته‌بندی ========== */}
        {categoryImages.length > 0 && (
          <section className="mb-5">
            <h2 className="h3 fw-bold mb-4">خرید بر اساس دسته‌بندی</h2>
            <Row>
              {categoryImages.map((category: any) => (
                <Col key={category.id} xs={6} md={3} className="mb-4">
                  <div 
                    className="category-image-container"
                    onClick={() => handleCategoryClick(category.link)}
                    onMouseEnter={() => setHoveredCategory(parseInt(category.id))}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    <div className="category-image-wrapper">
                      <Image
                        src={category.imageUrl}
                        alt={category.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="category-image"
                      />
                      <div className="category-image-overlay" />
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </section>
        )}

        {/* ========== برندهای معتبر ========== */}
        <section className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="h3 fw-bold">برندهای معتبر</h2>
            <Link href="/brands" className="text-decoration-none d-flex align-items-center">
              مشاهده همه
              <ArrowLeft className="me-2" />
            </Link>
          </div>

          <Row className="text-center">
            {brands.map((brand) => (
              <Col key={brand.id} xs={6} sm={4} md={3} lg={2} className="mb-4">
                <div 
                  className="p-3 bg-white rounded shadow-sm d-flex align-items-center justify-content-center position-relative cursor-pointer"
                  style={{ 
                    height: '120px',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    border: hoveredBrand === brand.id ? '3px solid #dc3545' : '1px solid #dee2e6',
                    transform: hoveredBrand === brand.id ? 'scale(1.05)' : 'scale(1)'
                  }}
                  onClick={() => handleBrandClick(brand)}
                  onMouseEnter={() => setHoveredBrand(brand.id)}
                  onMouseLeave={() => setHoveredBrand(null)}
                  role="button"
                  tabIndex={0}
                >
                  <div 
                    className="position-absolute top-0 start-0 w-100 h-100 rounded"
                    style={{
                      opacity: hoveredBrand === brand.id ? 0.1 : 0,
                      backgroundColor: '#dc3545',
                      transition: 'opacity 0.3s ease'
                    }}
                  />
                  
                  <div style={{ width: '100px', height: '70px', position: 'relative', zIndex: 1 }}>
                    <Image
                      src={brand.image}
                      alt={brand.name}
                      fill
                      style={{ objectFit: 'contain' }}
                    />
                  </div>

                  {brand.productCount > 0 && (
                    <div className="position-absolute top-0 end-0 m-2">
                      <span className="badge bg-primary rounded-pill" style={{ backgroundColor: '#6a1b9a' }}>
                        {brand.productCount}
                      </span>
                    </div>
                  )}
                </div>
                <p className="mt-2 fw-bold small">{brand.name}</p>
              </Col>
            ))}
          </Row>
        </section>

        {/* ========== پرفروش‌ترین کالاها ========== */}
        <BestSellers />

        {/* ========== دسته‌بندی‌های ویژه ========== */}
        <CategorySections />

        {/* ========== ویژگی‌های فروشگاه ========== */}
        <section className="py-5 border-top">
          <Row className="text-center">
            <Col md={3} className="mb-4">
              <div className="p-3">
                <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                  <span className="fs-4">🚚</span>
                </div>
                <h5 className="fw-bold">ارسال رایگان</h5>
                <p className="text-muted">برای خریدهای بالای 200 هزار تومان</p>
              </div>
            </Col>
            
            <Col md={3} className="mb-4">
              <div className="p-3">
                <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                  <span className="fs-4">↩️</span>
                </div>
                <h5 className="fw-bold">بازگشت 7 روزه</h5>
                <p className="text-muted">گارانتی بازگشت وجه تا 7 روز</p>
              </div>
            </Col>
            
            <Col md={3} className="mb-4">
              <div className="p-3">
                <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                  <span className="fs-4">🔒</span>
                </div>
                <h5 className="fw-bold">پرداخت امن</h5>
                <p className="text-muted">پرداخت آنلاین با امنیت کامل</p>
              </div>
            </Col>
            
            <Col md={3} className="mb-4">
              <div className="p-3">
                <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                  <span className="fs-4">📞</span>
                </div>
                <h5 className="fw-bold">پشتیبانی 24/7</h5>
                <p className="text-muted">پشتیبانی آنلاین 24 ساعته</p>
              </div>
            </Col>
          </Row>
        </section>
      </Container>
      
      <Footer />
      
      <style jsx global>{`
        .cursor-pointer {
          cursor: pointer;
        }
        
        .cursor-pointer:hover {
          box-shadow: 0 5px 15px rgba(220, 53, 69, 0.2);
        }
        
        .product-card-wrapper {
          transition: all 0.3s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .product-card-wrapper:hover {
          z-index: 10;
        }
        
        .product-card-wrapper :global(.card) {
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .product-card-wrapper :global(.card-body) {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        
        .product-card-wrapper :global(.card-body > div:last-child) {
          margin-top: auto;
        }
        
        .d-flex.gap-3 {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        
        .d-flex.gap-3::-webkit-scrollbar {
          display: none;
        }
        
        .btn-primary {
          background-color: #6a1b9a !important;
          border-color: #6a1b9a !important;
        }
        
        .btn-primary:hover {
          background-color: #5a1482 !important;
          border-color: #5a1482 !important;
        }
        
        .bg-primary {
          background-color: #6a1b9a !important;
        }

        /* ========== استایل گالری دسته‌بندی‌ها ========== */
        .category-image-container {
          position: relative;
          width: 100%;
          height: 200px;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        .category-image-container:hover {
          transform: scale(1.05);
          box-shadow: 0 10px 25px rgba(106, 27, 154, 0.3);
          z-index: 10;
        }

        .category-image-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .category-image {
          object-fit: cover !important;
          transition: transform 0.5s ease !important;
        }

        .category-image-container:hover .category-image {
          transform: scale(1.1);
        }

        .category-image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, rgba(106, 27, 154, 0), rgba(106, 27, 154, 0.3));
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .category-image-container:hover .category-image-overlay {
          opacity: 1;
        }

        @media (max-width: 768px) {
          .brand-item {
            height: 100px !important;
          }
          
          .brand-item div[style*="width: 100px"] {
            width: 70px !important;
            height: 50px !important;
          }

          .category-image-container {
            height: 150px;
          }
          
          .display-3 {
            font-size: 2.5rem !important;
          }
          
          .lead.fs-3 {
            font-size: 1.2rem !important;
          }
          
          .position-relative[style*="height: 700px"] {
            height: 400px !important;
          }
          
          .btn-lg {
            padding: 0.5rem 1rem !important;
            font-size: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
}