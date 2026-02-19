'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, Spinner } from 'react-bootstrap';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '@/lib/graphql-queries';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { Cart, Filter, StarFill, Star } from 'react-bootstrap-icons';
import { showToast } from '@/components/ToastProvider';
import { useCart } from '../context/CartContext';

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const brandParam = searchParams.get('brand');
  const discountParam = searchParams.get('filter') === 'discount';
  
  const [selectedBrand, setSelectedBrand] = useState(brandParam || 'همه');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  const { addToCart } = useCart();
  const { loading, error, data } = useQuery(GET_PRODUCTS);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    
    if (brandParam) {
      setSelectedBrand(brandParam);
      // نمایش پیام toast برای برند انتخاب شده
      const brandNames: { [key: string]: string } = {
        'apple': 'اپل',
        'samsung': 'سامسونگ',
        'sony': 'سونی',
        'lg': 'الجی',
        'haylou': 'هایلو',
        'jbl': 'جی‌بی‌ال',
        'nokia': 'نوکیا',
        'tp-link': 'تی‌پی‌لینک',
        'tesco': 'تسکو',
        'anker': 'انکر',
        'acer': 'ایسر',
        'asus': 'ایسوس'
      };
      const brandName = brandNames[brandParam] || brandParam;
      showToast.custom(`نمایش محصولات برند ${brandName}`, '#6a1b9a', '🏷️');
    }
  }, [brandParam]);

  const handleAddToCart = (product: any) => {
    if (!isLoggedIn) {
      localStorage.setItem('redirectAfterLogin', `/products?brand=${selectedBrand}`);
      showToast.warning('برای خرید باید وارد حساب کاربری خود شوید');
      setTimeout(() => router.push('/login'), 2000);
      return;
    }
    
    addToCart(product, 1);
    showToast.success(`${product.name} به سبد خرید اضافه شد`);
  };

  const handleBrandClick = (brand: string) => {
    setSelectedBrand(brand);
    if (brand === 'همه') {
      router.push('/products');
    } else {
      router.push(`/products?brand=${brand}`);
    }
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('fa-IR') + ' تومان';
  };

  const renderStars = (rating: number = 4.5) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<StarFill key={i} className="text-warning" size={16} />);
      } else {
        stars.push(<Star key={i} className="text-warning" size={16} />);
      }
    }
    return stars;
  };

  const getBrandName = (brandKey: string): string => {
    const brandNames: { [key: string]: string } = {
      'apple': 'اپل',
      'samsung': 'سامسونگ',
      'sony': 'سونی',
      'lg': 'الجی',
      'haylou': 'هایلو',
      'jbl': 'جی‌بی‌ال',
      'nokia': 'نوکیا',
      'tp-link': 'تی‌پی‌لینک',
      'tesco': 'تسکو',
      'anker': 'انکر',
      'acer': 'ایسر',
      'asus': 'ایسوس'
    };
    return brandNames[brandKey] || brandKey;
  };

  if (loading) return (
    <div>
      <Header />
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">در حال بارگذاری محصولات...</p>
      </Container>
      <Footer />
    </div>
  );

  if (error) return (
    <div>
      <Header />
      <Container className="text-center py-5">
        <div className="alert alert-danger">
          خطا در بارگذاری محصولات: {error.message}
        </div>
      </Container>
      <Footer />
    </div>
  );

  const products = data?.products || [];
  
  // استخراج لیست برندها از محصولات
  const brands = ['همه', ...Array.from(new Set(products.map((p: any) => p.brand).filter(Boolean)))];
  
  // استخراج لیست دسته‌بندی‌ها
  const categories = Array.from(new Set(products.map((p: any) => p.category).filter(Boolean)));
  
  // فیلتر بر اساس برند
  let filteredProducts = selectedBrand === 'همه' 
    ? products 
    : products.filter((p: any) => {
        // مقایسه با در نظر گرفتن حروف بزرگ و کوچک
        const productBrand = p.brand?.toLowerCase().trim();
        const selectedBrandLower = selectedBrand?.toLowerCase().trim();
        return productBrand === selectedBrandLower;
      });
  
  // فیلتر بر اساس تخفیف (اگر از صفحه اصلی با filter=discount آمده باشد)
  if (discountParam) {
    filteredProducts = filteredProducts.filter((p: any) => p.discount > 0);
  }
  
  // فیلتر بر اساس دسته‌بندی
  if (selectedCategories.length > 0) {
    filteredProducts = filteredProducts.filter((p: any) => 
      selectedCategories.includes(p.category)
    );
  }
  
  // فیلتر بر اساس قیمت
  filteredProducts = filteredProducts.filter((p: any) => 
    p.price >= priceRange[0] && p.price <= priceRange[1]
  );
  
  // مرتب‌سازی
  const sortedProducts = [...filteredProducts].sort((a: any, b: any) => {
    switch(sortBy) {
      case 'price-asc':
        return a.finalPrice - b.finalPrice;
      case 'price-desc':
        return b.finalPrice - a.finalPrice;
      case 'discount':
        return (b.discount || 0) - (a.discount || 0);
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      default: // newest
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    }
  });

  // عنوان صفحه بر اساس برند انتخاب شده
  const pageTitle = selectedBrand === 'همه' 
    ? 'همه محصولات' 
    : `محصولات برند ${getBrandName(selectedBrand)}`;

  return (
    <div>
      <Header />
      
      <Container className="py-4">
        {/* عنوان و مسیر راهنما */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h2 className="fw-bold mb-1">{pageTitle}</h2>
            <p className="text-muted mb-0">
              {filteredProducts.length} محصول یافت شد
              {discountParam && ' - دارای تخفیف ویژه'}
            </p>
            {selectedBrand !== 'همه' && (
              <div className="mt-2">
                <Badge 
                  bg="primary" 
                  className="px-3 py-2"
                  style={{ backgroundColor: '#6a1b9a' }}
                >
                  {getBrandName(selectedBrand)}
                </Badge>
              </div>
            )}
          </div>
          <Button 
            variant="outline-primary" 
            className="d-lg-none"
            onClick={() => setShowFilters(!showFilters)}
            style={{ color: '#6a1b9a', borderColor: '#6a1b9a' }}
          >
            <Filter size={20} className="me-2" />
            فیلترها
          </Button>
        </div>

        <Row>
          {/* سایدبار فیلترها */}
          <Col lg={3} className={`${showFilters ? 'd-block' : 'd-none d-lg-block'}`}>
            <div className="sticky-lg-top" style={{ top: '90px' }}>
              {/* فیلتر برند */}
              <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-white py-3">
                  <h6 className="fw-bold mb-0">برندها</h6>
                </Card.Header>
                <Card.Body className="p-0">
                  <div className="list-group list-group-flush">
                    {brands.map((brand: string) => (
                      <button
                        key={brand}
                        className={`list-group-item list-group-item-action border-0 py-3 d-flex justify-content-between align-items-center ${
                          selectedBrand === brand ? 'active' : ''
                        }`}
                        onClick={() => handleBrandClick(brand)}
                        style={selectedBrand === brand ? { backgroundColor: '#6a1b9a', color: 'white' } : {}}
                      >
                        {brand === 'همه' ? 'همه برندها' : getBrandName(brand)}
                        <Badge bg={selectedBrand === brand ? 'light' : 'secondary'} 
                               text={selectedBrand === brand ? 'dark' : 'light'}>
                          {products.filter((p: any) => p.brand === brand).length}
                        </Badge>
                      </button>
                    ))}
                  </div>
                </Card.Body>
              </Card>

              {/* فیلتر دسته‌بندی */}
              <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-white py-3">
                  <h6 className="fw-bold mb-0">دسته‌بندی</h6>
                </Card.Header>
                <Card.Body>
                  {categories.map((category: string) => (
                    <Form.Check 
                      key={category}
                      type="checkbox"
                      id={`category-${category}`}
                      label={category}
                      className="mb-2"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                    />
                  ))}
                </Card.Body>
              </Card>

              {/* فیلتر قیمت */}
              <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-white py-3">
                  <h6 className="fw-bold mb-0">محدوده قیمت</h6>
                </Card.Header>
                <Card.Body>
                  <div className="d-flex gap-2 mb-3">
                    <Form.Control
                      type="number"
                      placeholder="از"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    />
                    <Form.Control
                      type="number"
                      placeholder="تا"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    />
                  </div>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    className="w-100"
                    onClick={() => setPriceRange([0, 100000000])}
                    style={{ color: '#6a1b9a', borderColor: '#6a1b9a' }}
                  >
                    حذف فیلتر قیمت
                  </Button>
                </Card.Body>
              </Card>

              {/* مرتب‌سازی */}
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white py-3">
                  <h6 className="fw-bold mb-0">مرتب‌سازی بر اساس</h6>
                </Card.Header>
                <Card.Body>
                  <Form.Select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border-0 bg-light"
                  >
                    <option value="newest">جدیدترین</option>
                    <option value="price-asc">قیمت: کم به زیاد</option>
                    <option value="price-desc">قیمت: زیاد به کم</option>
                    <option value="discount">بیشترین تخفیف</option>
                    <option value="name-asc">نام: الف تا ی</option>
                    <option value="name-desc">نام: ی تا الف</option>
                  </Form.Select>
                </Card.Body>
              </Card>
            </div>
          </Col>

          {/* لیست محصولات */}
          <Col lg={9}>
            {sortedProducts.length === 0 ? (
              <div className="text-center py-5">
                <h4 className="text-muted mb-3">محصولی یافت نشد</h4>
                <p className="text-muted mb-4">
                  {selectedBrand !== 'همه' 
                    ? `هیچ محصولی برای برند ${getBrandName(selectedBrand)} یافت نشد`
                    : 'هیچ محصولی یافت نشد'
                  }
                </p>
                <Button 
                  variant="primary"
                  onClick={() => {
                    setSelectedBrand('همه');
                    setSelectedCategories([]);
                    setPriceRange([0, 100000000]);
                    router.push('/products');
                  }}
                  style={{ backgroundColor: '#6a1b9a', borderColor: '#6a1b9a' }}
                >
                  نمایش همه محصولات
                </Button>
              </div>
            ) : (
              <Row>
                {sortedProducts.map((product: any) => (
                  <Col key={product.id} xs={12} sm={6} md={6} lg={4} className="mb-4">
                    <Card className="h-100 border-0 shadow-sm product-card">
                      <Link href={`/product/${product.id}`} className="text-decoration-none">
                        <div className="position-relative" style={{ height: '200px' }}>
                          <Image
                            src={product.imageUrl || '/images/placeholder.jpg'}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 300px"
                            style={{ objectFit: 'cover' }}
                            className="rounded-top"
                          />
                          {product.discount > 0 && (
                            <Badge 
                              bg="danger" 
                              className="position-absolute top-0 end-0 m-2"
                              style={{ fontSize: '0.8rem', padding: '5px 10px' }}
                            >
                              {product.discount}% تخفیف
                            </Badge>
                          )}
                          {product.stock < 5 && product.stock > 0 && (
                            <Badge 
                              bg="warning" 
                              className="position-absolute top-0 start-0 m-2"
                              style={{ fontSize: '0.8rem', padding: '5px 10px' }}
                            >
                              تنها {product.stock} عدد باقی‌مانده
                            </Badge>
                          )}
                          {product.stock === 0 && (
                            <Badge 
                              bg="secondary" 
                              className="position-absolute top-0 start-0 m-2"
                              style={{ fontSize: '0.8rem', padding: '5px 10px' }}
                            >
                              ناموجود
                            </Badge>
                          )}
                        </div>
                      </Link>
                      
                      <Card.Body className="d-flex flex-column">
                        <Link href={`/product/${product.id}`} className="text-decoration-none">
                          <Card.Title className="h6 mb-2">{product.name}</Card.Title>
                          <p className="small text-muted mb-2">{product.brand || 'بدون برند'}</p>
                          <div className="d-flex align-items-center gap-1 mb-2">
                            {renderStars()}
                            <span className="text-muted small me-2">(4.5)</span>
                          </div>
                        </Link>
                        
                        <div className="mt-auto">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            {product.discount > 0 ? (
                              <div>
                                <span className="text-muted text-decoration-line-through small me-2">
                                  {product.price.toLocaleString()}
                                </span>
                                <span className="fw-bold text-primary">
                                  {product.finalPrice.toLocaleString()} تومان
                                </span>
                              </div>
                            ) : (
                              <span className="fw-bold text-primary">
                                {product.price.toLocaleString()} تومان
                              </span>
                            )}
                          </div>

                          <Button
                            variant="primary"
                            size="sm"
                            className="w-100 d-flex align-items-center justify-content-center gap-2"
                            style={{ backgroundColor: '#6a1b9a', borderColor: '#6a1b9a' }}
                            onClick={() => handleAddToCart(product)}
                            disabled={product.stock === 0}
                          >
                            <Cart size={16} />
                            {product.stock === 0 ? 'ناموجود' : 'افزودن به سبد خرید'}
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Col>
        </Row>
      </Container>

      <Footer />

      <style jsx global>{`
        .product-card {
          transition: all 0.3s ease;
          overflow: hidden;
        }
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.15) !important;
        }
        .list-group-item {
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .list-group-item:hover:not(.active) {
          background-color: rgba(106, 27, 154, 0.05) !important;
        }
        .list-group-item.active {
          background-color: #6a1b9a !important;
          border-color: #6a1b9a !important;
        }
        .form-check-input:checked {
          background-color: #6a1b9a;
          border-color: #6a1b9a;
        }
      `}</style>
    </div>
  );
}