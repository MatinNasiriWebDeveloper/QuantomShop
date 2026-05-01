'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, Spinner } from 'react-bootstrap';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '@/lib/graphql-queries';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '../context/LanguageContext';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Cart, 
  Filter, 
  StarFill, 
  Star, 
  ArrowLeft, 
  Grid, 
  List, 
  X,
  ChevronDown,
  ChevronUp,
  Laptop,
  Phone,           // به جای Smartphone
  Tablet,
  Headphones,
  Watch,
  Speaker,
  Tv,
  HouseDoor,       // به جای House
  ShieldCheck      // به جای Shield
} from 'react-bootstrap-icons';
import { showToast } from '@/components/ToastProvider';
import { useCart } from '../../app/context/CartContext';

// تابع کمکی برای تبدیل نام انگلیسی برند به فارسی
const getBrandNameInPersian = (brandEn: string): string => {
  const brandMap: { [key: string]: string } = {
    'apple': 'اپل',
    'samsung': 'سامسونگ',
    'sony': 'سونی',
    'lg': 'الجی',
    'xiaomi': 'شیائومی',
    'huawei': 'هوآوی',
    'nokia': 'نوکیا',
    'google': 'گوگل',
    'oneplus': 'وان‌پلاس',
    'realme': 'ریلمی',
    'haylou': 'هایلو',
    'jbl': 'جی‌بی‌ال',
    'tp-link': 'تی‌پی‌لینک',
    'tesco': 'تسکو',
    'anker': 'انکر',
    'acer': 'ایسر',
    'asus': 'ایسوس',
    'lenovo': 'لنوو',
    'dell': 'دل',
    'hp': 'اچ‌پی'
  };
  return brandMap[brandEn] || brandEn;
};

// تابع کمکی برای تبدیل نام فارسی برند به انگلیسی
const getBrandNameInEnglish = (brandFa: string): string => {
  const brandMap: { [key: string]: string } = {
    'اپل': 'apple',
    'سامسونگ': 'samsung',
    'سونی': 'sony',
    'الجی': 'lg',
    'شیائومی': 'xiaomi',
    'هوآوی': 'huawei',
    'نوکیا': 'nokia',
    'گوگل': 'google',
    'وان‌پلاس': 'oneplus',
    'ریلمی': 'realme',
    'هایلو': 'haylou',
    'جی‌بی‌ال': 'jbl',
    'تی‌پی‌لینک': 'tp-link',
    'تسکو': 'tesco',
    'انکر': 'anker',
    'ایسر': 'acer',
    'ایسوس': 'asus',
    'لنوو': 'lenovo',
    'دل': 'dell',
    'اچ‌پی': 'hp'
  };
  return brandMap[brandFa] || brandFa;
};

// ساختار دسته‌بندی‌ها با زیرشاخه
interface CategoryNode {
  id: string;
  name: string;
  icon?: JSX.Element;
  subcategories?: CategoryNode[];
  count?: number;
}

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const brandParam = searchParams.get('brand');
  const categoryParam = searchParams.get('category');
  const subcategoryParam = searchParams.get('subcategory');
  const discountParam = searchParams.get('filter') === 'discount';
  
  const [selectedBrand, setSelectedBrand] = useState(brandParam || 'همه');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'همه');
  const [selectedSubcategory, setSelectedSubcategory] = useState(subcategoryParam || 'همه');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000000]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000000);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showInStock, setShowInStock] = useState(false);
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  const [openBrands, setOpenBrands] = useState<string[]>([]);
  
  const { addToCart } = useCart();
  const { loading, error, data } = useQuery(GET_PRODUCTS);

  // ساختار دسته‌بندی‌ها با زیرشاخه (با آیکون‌های اصلاح شده)
  const categoryTree: CategoryNode[] = [
    {
      id: 'mobile',
      name: 'گوشی موبایل',
      icon: <Phone size={18} />,  // اصلاح شده
      subcategories: [
        { id: 'apple-phones', name: 'اپل' },
        { id: 'samsung-phones', name: 'سامسونگ' },
        { id: 'xiaomi-phones', name: 'شیائومی' },
        { id: 'huawei-phones', name: 'هوآوی' },
        { id: 'nokia-phones', name: 'نوکیا' }
      ]
    },
    {
      id: 'tablet',
      name: 'تبلت',
      icon: <Tablet size={18} />,
      subcategories: [
        { id: 'apple-tablets', name: 'اپل' },
        { id: 'samsung-tablets', name: 'سامسونگ' },
        { id: 'xiaomi-tablets', name: 'شیائومی' },
        { id: 'lenovo-tablets', name: 'لنوو' }
      ]
    },
    {
      id: 'laptop',
      name: 'لپ تاپ',
      icon: <Laptop size={18} />,
      subcategories: [
        { id: 'asus-laptops', name: 'ایسوس' },
        { id: 'acer-laptops', name: 'ایسر' },
        { id: 'lenovo-laptops', name: 'لنوو' },
        { id: 'dell-laptops', name: 'دل' },
        { id: 'hp-laptops', name: 'اچ‌پی' },
        { id: 'apple-laptops', name: 'اپل' }
      ]
    },
    {
      id: 'headphone',
      name: 'هدفون و هندزفری',
      icon: <Headphones size={18} />,
      subcategories: [
        { id: 'sony-headphones', name: 'سونی' },
        { id: 'jbl-headphones', name: 'جی‌بی‌ال' },
        { id: 'apple-headphones', name: 'اپل' },
        { id: 'samsung-headphones', name: 'سامسونگ' },
        { id: 'xiaomi-headphones', name: 'شیائومی' }
      ]
    },
    {
      id: 'watch',
      name: 'ساعت هوشمند',
      icon: <Watch size={18} />,
      subcategories: [
        { id: 'apple-watches', name: 'اپل' },
        { id: 'samsung-watches', name: 'سامسونگ' },
        { id: 'xiaomi-watches', name: 'شیائومی' },
        { id: 'huawei-watches', name: 'هوآوی' }
      ]
    },
    {
      id: 'speaker',
      name: 'اسپیکر',
      icon: <Speaker size={18} />,
      subcategories: [
        { id: 'jbl-speakers', name: 'جی‌بی‌ال' },
        { id: 'sony-speakers', name: 'سونی' },
        { id: 'xiaomi-speakers', name: 'شیائومی' },
        { id: 'anker-speakers', name: 'انکر' }
      ]
    },
    {
      id: 'tv',
      name: 'تلویزیون',
      icon: <Tv size={18} />,
      subcategories: [
        { id: 'lg-tvs', name: 'الجی' },
        { id: 'samsung-tvs', name: 'سامسونگ' },
        { id: 'sony-tvs', name: 'سونی' }
      ]
    },
    {
      id: 'appliance',
      name: 'لوازم خانگی',
      icon: <HouseDoor size={18} />,  // اصلاح شده
      subcategories: [
        { id: 'lg-appliances', name: 'الجی' },
        { id: 'samsung-appliances', name: 'سامسونگ' },
        { id: 'tesco-appliances', name: 'تسکو' }
      ]
    },
    {
      id: 'accessories',
      name: 'لوازم جانبی',
      icon: <ShieldCheck size={18} />,  // اصلاح شده
      subcategories: [
        { id: 'chargers', name: 'شارژر' },
        { id: 'cases', name: 'قاب و محافظ' },
        { id: 'cables', name: 'کابل' },
        { id: 'powerbanks', name: 'پاوربانک' }
      ]
    }
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    
    if (brandParam) {
      setSelectedBrand(brandParam);
    }
    
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    
    if (subcategoryParam) {
      setSelectedSubcategory(subcategoryParam);
    }
  }, [brandParam, categoryParam, subcategoryParam]);

  // به‌روزرسانی URL هنگام تغییر فیلترها
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedBrand !== 'همه') params.set('brand', selectedBrand);
    if (selectedCategory !== 'همه') params.set('category', selectedCategory);
    if (selectedSubcategory !== 'همه') params.set('subcategory', selectedSubcategory);
    
    const queryString = params.toString();
    const url = queryString ? `/products?${queryString}` : '/products';
    
    if (window.location.pathname + window.location.search !== url) {
      router.push(url, { scroll: false });
    }
  }, [selectedBrand, selectedCategory, selectedSubcategory, router]);

  const handleAddToCart = (product: any) => {
    if (!isLoggedIn) {
      localStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
      showToast.warning('برای خرید باید وارد حساب کاربری خود شوید');
      setTimeout(() => router.push('/login'), 2000);
      return;
    }
    
    addToCart(product, 1);
    showToast.success(`${product.name} به سبد خرید اضافه شد`);
  };

  const handleBrandClick = (brand: string) => {
    if (brand === selectedBrand) {
      setSelectedBrand('همه');
    } else {
      setSelectedBrand(brand);
    }
  };

  const handleCategoryClick = (categoryId: string, categoryName: string) => {
    if (categoryName === selectedCategory) {
      setSelectedCategory('همه');
      setSelectedSubcategory('همه');
    } else {
      setSelectedCategory(categoryName);
      setSelectedSubcategory('همه');
    }
  };

  const handleSubcategoryClick = (subcategoryName: string) => {
    if (subcategoryName === selectedSubcategory) {
      setSelectedSubcategory('همه');
    } else {
      setSelectedSubcategory(subcategoryName);
    }
  };

  const toggleCategory = (categoryId: string) => {
    setOpenCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleBrand = (brandId: string) => {
    setOpenBrands(prev =>
      prev.includes(brandId)
        ? prev.filter(id => id !== brandId)
        : [...prev, brandId]
    );
  };

  const handlePriceRangeApply = () => {
    setPriceRange([minPrice, maxPrice]);
    showToast.custom(`فیلتر قیمت از ${minPrice.toLocaleString()} تا ${maxPrice.toLocaleString()} تومان اعمال شد`, '#6a1b9a', '💰');
  };

  const handleResetFilters = () => {
    setSelectedBrand('همه');
    setSelectedCategory('همه');
    setSelectedSubcategory('همه');
    setPriceRange([0, 100000000]);
    setMinPrice(0);
    setMaxPrice(100000000);
    setShowInStock(false);
    router.push('/products');
    showToast.info('همه فیلترها حذف شدند');
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
  const brands = Array.from(new Set(products.map((p: any) => p.brand).filter(Boolean))).sort();
  
  // فیلتر بر اساس برند
  let filteredProducts = selectedBrand === 'همه' 
    ? products 
    : products.filter((p: any) => {
        const productBrand = p.brand?.toLowerCase().trim();
        const selectedBrandLower = selectedBrand?.toLowerCase().trim();
        return productBrand === selectedBrandLower;
      });
  
  // فیلتر بر اساس دسته‌بندی
  if (selectedCategory !== 'همه') {
    filteredProducts = filteredProducts.filter((p: any) => p.category === selectedCategory);
    
    // فیلتر بر اساس زیرشاخه
    if (selectedSubcategory !== 'همه') {
      filteredProducts = filteredProducts.filter((p: any) => 
        p.name.toLowerCase().includes(selectedSubcategory.toLowerCase())
      );
    }
  }
  
  // فیلتر بر اساس تخفیف
  if (discountParam) {
    filteredProducts = filteredProducts.filter((p: any) => p.discount > 0);
  }
  
  // فیلتر بر اساس قیمت
  filteredProducts = filteredProducts.filter((p: any) => 
    p.price >= priceRange[0] && p.price <= priceRange[1]
  );
  
  // فیلتر کالاهای موجود
  if (showInStock) {
    filteredProducts = filteredProducts.filter((p: any) => p.stock > 0);
  }
  
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
      default:
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    }
  });

  // عنوان صفحه
  const pageTitle = 
    selectedBrand !== 'همه' && selectedCategory !== 'همه' && selectedSubcategory !== 'همه' ? `محصولات ${getBrandNameInPersian(selectedBrand)} - ${selectedCategory} - ${selectedSubcategory}` :
    selectedBrand !== 'همه' && selectedCategory !== 'همه' ? `محصولات ${getBrandNameInPersian(selectedBrand)} - ${selectedCategory}` :
    selectedBrand !== 'همه' ? `محصولات برند ${getBrandNameInPersian(selectedBrand)}` :
    selectedCategory !== 'همه' && selectedSubcategory !== 'همه' ? `محصولات ${selectedCategory} - ${selectedSubcategory}` :
    selectedCategory !== 'همه' ? `محصولات دسته ${selectedCategory}` :
    'همه محصولات';

  return (
    <div>
      <Header />
      
      <Container className="py-4">
        {/* دکمه بازگشت و مسیر راهنما */}
        <div className="d-flex align-items-center mb-4">
          <Button 
            variant="link" 
            onClick={() => router.back()}
            className="p-0 me-2 text-decoration-none"
            style={{ color: '#6a1b9a' }}
          >
          <ArrowLeft size={20}/>
          </Button>
          <Link href="/" className="text-decoration-none text-muted">خانه</Link>
          <span className="mx-2 text-muted">/</span>
          <span className="text-primary">{pageTitle}</span>
        </div>

        {/* فیلترهای انتخاب شده */}
        {(selectedBrand !== 'همه' || selectedCategory !== 'همه' || selectedSubcategory !== 'همه' || showInStock || priceRange[0] > 0 || priceRange[1] < 100000000) && (
          <div className="bg-light p-3 rounded-3 mb-4">
            <div className="d-flex flex-wrap align-items-center gap-2">
              <span className="text-muted small">فیلترهای فعال:</span>
              
              {selectedBrand !== 'همه' && (
                <Badge bg="primary" className="d-flex align-items-center gap-2 px-3 py-2">
                  {getBrandNameInPersian(selectedBrand)}
                  <X 
                    size={14} 
                    style={{ cursor: 'pointer' }} 
                    onClick={() => setSelectedBrand('همه')}
                  />
                </Badge>
              )}
              
              {selectedCategory !== 'همه' && (
                <Badge bg="success" className="d-flex align-items-center gap-2 px-3 py-2">
                  {selectedCategory}
                  <X 
                    size={14} 
                    style={{ cursor: 'pointer' }} 
                    onClick={() => {
                      setSelectedCategory('همه');
                      setSelectedSubcategory('همه');
                    }}
                  />
                </Badge>
              )}
              
              {selectedSubcategory !== 'همه' && (
                <Badge bg="info" className="d-flex align-items-center gap-2 px-3 py-2">
                  {selectedSubcategory}
                  <X 
                    size={14} 
                    style={{ cursor: 'pointer' }} 
                    onClick={() => setSelectedSubcategory('همه')}
                  />
                </Badge>
              )}
              
              {showInStock && (
                <Badge bg="warning" text="dark" className="d-flex align-items-center gap-2 px-3 py-2">
                  کالاهای موجود
                  <X 
                    size={14} 
                    style={{ cursor: 'pointer' }} 
                    onClick={() => setShowInStock(false)}
                  />
                </Badge>
              )}
              
              {(priceRange[0] > 0 || priceRange[1] < 100000000) && (
                <Badge bg="secondary" className="d-flex align-items-center gap-2 px-3 py-2">
                  {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()} تومان
                  <X 
                    size={14} 
                    style={{ cursor: 'pointer' }} 
                    onClick={() => {
                      setPriceRange([0, 100000000]);
                      setMinPrice(0);
                      setMaxPrice(100000000);
                    }}
                  />
                </Badge>
              )}
              
              <Button 
                variant="link" 
                size="sm" 
                onClick={handleResetFilters}
                className="text-danger text-decoration-none ms-auto"
              >
                حذف همه
              </Button>
            </div>
          </div>
        )}

        {/* نوار ابزار */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div className="d-flex align-items-center gap-3">
            <h5 className="mb-0 fw-bold">{filteredProducts.length} محصول</h5>
            <div className="d-flex gap-2">
              <Button 
                variant={viewMode === 'grid' ? 'primary' : 'outline-primary'}
                size="sm"
                onClick={() => setViewMode('grid')}
                style={viewMode === 'grid' ? { backgroundColor: '#6a1b9a' } : { color: '#6a1b9a', borderColor: '#6a1b9a' }}
              >
                <Grid size={16} />
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'primary' : 'outline-primary'}
                size="sm"
                onClick={() => setViewMode('list')}
                style={viewMode === 'list' ? { backgroundColor: '#6a1b9a' } : { color: '#6a1b9a', borderColor: '#6a1b9a' }}
              >
                <List size={16} />
              </Button>
            </div>
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
          {/* سایدبار فیلترها با زیرشاخه */}
          <Col lg={3} className={`${showFilters ? 'd-block' : 'd-none d-lg-block'}`}>
            <div className="filters-sidebar">
              {/* دسته‌بندی با زیرشاخه */}
              <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-white py-3">
                  <h6 className="fw-bold mb-0">دسته‌بندی</h6>
                </Card.Header>
                <Card.Body className="p-0">
                  {categoryTree.map((category) => (
                    <div key={category.id} className="category-item">
                      <div 
                        className={`category-header d-flex align-items-center justify-content-between px-3 py-2 ${
                          selectedCategory === category.name ? 'active' : ''
                        }`}
                        onClick={() => handleCategoryClick(category.id, category.name)}
                      >
                        <div className="d-flex align-items-center gap-2">
                          <span className="category-icon">{category.icon}</span>
                          <span>{category.name}</span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <Badge bg={selectedCategory === category.name ? 'light' : 'secondary'}>
                            {products.filter((p: any) => p.category === category.name).length}
                          </Badge>
                          {category.subcategories && category.subcategories.length > 0 && (
                            <Button
                              variant="link"
                              size="sm"
                              className="p-0 text-decoration-none"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleCategory(category.id);
                              }}
                            >
                              {openCategories.includes(category.id) ? 
                                <ChevronUp size={16} /> : 
                                <ChevronDown size={16} />
                              }
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {/* زیرشاخه‌ها */}
                      {category.subcategories && openCategories.includes(category.id) && (
                        <div className="subcategories-list">
                          {category.subcategories.map((sub) => (
                            <div
                              key={sub.id}
                              className={`subcategory-item px-4 py-2 ${
                                selectedSubcategory === sub.name ? 'active' : ''
                              }`}
                              onClick={() => handleSubcategoryClick(sub.name)}
                            >
                              <span>{sub.name}</span>
                              <Badge bg="secondary" pill>
                                {products.filter((p: any) => 
                                  p.category === category.name && 
                                  p.name.toLowerCase().includes(sub.name.toLowerCase())
                                ).length}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </Card.Body>
              </Card>

              {/* برندها با زیرشاخه */}
              <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-white py-3">
                  <h6 className="fw-bold mb-0">برندها</h6>
                </Card.Header>
                <Card.Body className="p-0">
                  {brands.slice(0, 5).map((brand: string) => (
                    <div key={brand} className="category-item">
                      <div 
                        className={`category-header d-flex align-items-center justify-content-between px-3 py-2 ${
                          selectedBrand === brand ? 'active' : ''
                        }`}
                        onClick={() => handleBrandClick(brand)}
                      >
                        <span>{getBrandNameInPersian(brand)}</span>
                        <Badge bg={selectedBrand === brand ? 'light' : 'secondary'}>
                          {products.filter((p: any) => p.brand === brand).length}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  
                  {brands.length > 5 && (
                    <div className="text-center py-2">
                      <Button 
                        variant="link" 
                        size="sm"
                        onClick={() => toggleBrand('all')}
                        className="text-decoration-none"
                        style={{ color: '#6a1b9a' }}
                      >
                        {openBrands.includes('all') ? 'نمایش کمتر' : 'مشاهده همه برندها'}
                      </Button>
                      
                      {openBrands.includes('all') && (
                        <div className="mt-2">
                          {brands.slice(5).map((brand: string) => (
                            <div
                              key={brand}
                              className={`category-header d-flex align-items-center justify-content-between px-3 py-2 ${
                                selectedBrand === brand ? 'active' : ''
                              }`}
                              onClick={() => handleBrandClick(brand)}
                            >
                              <span>{getBrandNameInPersian(brand)}</span>
                              <Badge bg={selectedBrand === brand ? 'light' : 'secondary'}>
                                {products.filter((p: any) => p.brand === brand).length}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </Card.Body>
              </Card>

              {/* فیلتر کالاهای موجود */}
              <Card className="border-0 shadow-sm mb-4">
                <Card.Body>
                  <Form.Check 
                    type="checkbox"
                    id="inStock"
                    label="فقط کالاهای موجود"
                    checked={showInStock}
                    onChange={(e) => setShowInStock(e.target.checked)}
                    className="fw-bold"
                  />
                </Card.Body>
              </Card>

              {/* فیلتر قیمت */}
              <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-white py-3">
                  <h6 className="fw-bold mb-0">محدوده قیمت</h6>
                </Card.Header>
                <Card.Body>
                  <div className="mb-3">
                    <Form.Label className="text-muted small">حداقل قیمت: {minPrice.toLocaleString()} تومان</Form.Label>
                    <Form.Range
                      min={0}
                      max={100000000}
                      step={100000}
                      value={minPrice}
                      onChange={(e) => setMinPrice(Number(e.target.value))}
                      className="price-range"
                    />
                  </div>
                  <div className="mb-3">
                    <Form.Label className="text-muted small">حداکثر قیمت: {maxPrice.toLocaleString()} تومان</Form.Label>
                    <Form.Range
                      min={0}
                      max={100000000}
                      step={100000}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="price-range"
                    />
                  </div>
                  <div className="d-flex gap-2">
                    <Form.Control
                      type="number"
                      placeholder="از"
                      value={minPrice}
                      onChange={(e) => setMinPrice(Number(e.target.value))}
                    />
                    <Form.Control
                      type="number"
                      placeholder="تا"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                    />
                  </div>
                  <Button 
                    variant="primary" 
                    size="sm"
                    className="w-100 mt-3"
                    onClick={handlePriceRangeApply}
                    style={{ backgroundColor: '#6a1b9a', borderColor: '#6a1b9a' }}
                  >
                    اعمال محدوده قیمت
                  </Button>
                </Card.Body>
              </Card>

              {/* مرتب‌سازی */}
              <Card className="border-0 shadow-sm mb-4">
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

              {/* دکمه حذف فیلترها */}
              <Button 
                variant="outline-danger" 
                className="w-100"
                onClick={handleResetFilters}
              >
                حذف همه فیلترها
              </Button>
            </div>
          </Col>

          {/* لیست محصولات */}
          <Col lg={9}>
            {sortedProducts.length === 0 ? (
              <div className="text-center py-5">
                <h4 className="text-muted mb-3">محصولی یافت نشد</h4>
                <p className="text-muted mb-4">
                  {selectedBrand !== 'همه' && `هیچ محصولی برای برند ${getBrandNameInPersian(selectedBrand)} `}
                  {selectedCategory !== 'همه' && `در دسته ${selectedCategory} `}
                  {selectedSubcategory !== 'همه' && `با زیرشاخه ${selectedSubcategory} `}
                  یافت نشد
                </p>
                <Button 
                  variant="primary"
                  onClick={handleResetFilters}
                  style={{ backgroundColor: '#6a1b9a', borderColor: '#6a1b9a' }}
                >
                  نمایش همه محصولات
                </Button>
              </div>
            ) : (
              <Row>
                {sortedProducts.map((product: any) => (
                  <Col key={product.id} xs={12} sm={viewMode === 'grid' ? 6 : 12} md={viewMode === 'grid' ? 6 : 12} lg={viewMode === 'grid' ? 4 : 12} className="mb-4">
                    <Card className={`h-100 border-0 shadow-sm product-card ${viewMode === 'list' ? 'flex-row' : ''}`}>
                      <Link href={`/product/${product.id}`} className={`text-decoration-none ${viewMode === 'list' ? 'col-4' : ''}`}>
                        <div className="position-relative" style={{ height: viewMode === 'list' ? '150px' : '300px' }}>
                          <Image
                            src={product.imageUrl || '/images/placeholder.jpg'}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 300px"
                            style={{ objectFit: 'cover' }}
                            className={viewMode === 'list' ? 'rounded-start' : 'rounded-top'}
                          />
                          {product.discount > 0 && (
                            <Badge 
                              bg="danger" 
                              className="position-absolute top-0 end-0 m-2"
                              style={{ fontSize: '0.8rem', padding: '5px 10px' }}
                            >
                              -{product.discount}%
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
                      
                      <Card.Body className={`d-flex flex-column ${viewMode === 'list' ? 'col-8' : ''}`}>
                        <Link href={`/product/${product.id}`} className="text-decoration-none">
                          <Card.Title className="h6 mb-2">{product.name}</Card.Title>
                          <p className="small text-muted mb-2">{getBrandNameInPersian(product.brand)}</p>
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
        
        /* استایل سایدبار */
        .filters-sidebar {
          position: sticky;
          top: 90px;
          max-height: calc(100vh - 100px);
          overflow-y: auto;
          padding-right: 5px;
        }
        
        .filters-sidebar::-webkit-scrollbar {
          width: 5px;
        }
        
        .filters-sidebar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .filters-sidebar::-webkit-scrollbar-thumb {
          background: #6a1b9a;
          border-radius: 10px;
        }
        
        /* استایل دسته‌بندی‌ها */
        .category-item {
          border-bottom: 1px solid #f0f0f0;
        }
        
        .category-header {
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .category-header:hover {
          background-color: rgba(106, 27, 154, 0.05);
        }
        
        .category-header.active {
          background-color: #6a1b9a;
          color: white;
        }
        
        .category-header.active .badge {
          background-color: white !important;
          color: #6a1b9a !important;
        }
        
        .category-icon {
          color: #6a1b9a;
        }
        
        .category-header.active .category-icon {
          color: white;
        }
        
        /* استایل زیرشاخه‌ها */
        .subcategories-list {
          background-color: #f8f9fa;
        }
        
        .subcategory-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }
        
        .subcategory-item:hover {
          background-color: rgba(106, 27, 154, 0.1);
        }
        
        .subcategory-item.active {
          background-color: rgba(106, 27, 154, 0.15);
          color: #6a1b9a;
          font-weight: 500;
        }
        
        /* استایل اسلایدر قیمت */
        .price-range::-webkit-slider-thumb {
          background: #6a1b9a;
        }
        .price-range::-moz-range-thumb {
          background: #6a1b9a;
        }
        
        /* حالت لیست */
        .product-card.flex-row {
          flex-direction: row !important;
        }
        
        /* ریسپانسیو */
        @media (max-width: 992px) {
          .filters-sidebar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 9999;
            background: white;
            max-height: 100vh;
            padding: 20px;
            overflow-y: auto;
          }
        }
        
        @media (max-width: 768px) {
          .product-card.flex-row {
            flex-direction: column !important;
          }
          
          .product-card.flex-row .col-4,
          .product-card.flex-row .col-8 {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}