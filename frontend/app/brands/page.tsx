'use client';

import { useState } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Button, Badge } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Search, StarFill, Star } from 'react-bootstrap-icons';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { PRODUCTS } from '@/lib/mock-data';

const brandCount = (nameEn: string) =>
  PRODUCTS.filter((p) => p.brand.toLowerCase() === nameEn.toLowerCase()).length;

const brands = [
  {
    id: 1,
    name: 'اپل',
    nameEn: 'Apple',
    logo: '/images/products/app.webp',
    category: 'apple',
    description: 'برند آمریکایی تولیدکننده محصولات الکترونیکی پیشرفته',
    since: 1976,
    country: 'آمریکا',
    rating: 4.8,
  },
  {
    id: 2,
    name: 'سامسونگ',
    nameEn: 'Samsung',
    logo: '/images/products/sam.webp',
    category: 'samsung',
    description: 'برند کرهای تولیدکننده انواع گوشی، لپ تاپ و لوازم خانگی',
    since: 1938,
    country: 'کره جنوبی',
    rating: 4.7,
  },
  {
    id: 3,
    name: 'سونی',
    nameEn: 'Sony',
    logo: '/images/products/so.webp',
    category: 'sony',
    description: 'برند ژاپنی تولیدکننده محصولات صوتی و تصویری',
    since: 1946,
    country: 'ژاپن',
    rating: 4.6,
  },
  {
    id: 4,
    name: 'الجی',
    nameEn: 'LG',
    logo: '/images/products/lg.webp',
    category: 'lg',
    description: 'برند کرهای تولیدکننده لوازم خانگی و الکترونیک',
    since: 1958,
    country: 'کره جنوبی',
    rating: 4.5,
  },
  {
    id: 5,
    name: 'هایلو',
    nameEn: 'Haylou',
    logo: '/images/products/haylou.webp',
    category: 'haylou',
    description: 'برند چینی تولیدکننده هدفون و ساعت هوشمند',
    since: 2018,
    country: 'چین',
    rating: 4.3,
  },
  {
    id: 6,
    name: 'جی‌بی‌ال',
    nameEn: 'JBL',
    logo: '/images/products/jbl.webp',
    category: 'jbl',
    description: 'برند آمریکایی تولیدکننده سیستم‌های صوتی',
    since: 1946,
    country: 'آمریکا',
    rating: 4.7,
  },
  {
    id: 7,
    name: 'نوکیا',
    nameEn: 'Nokia',
    logo: '/images/products/noki.webp',
    category: 'nokia',
    description: 'برند فنلاندی تولیدکننده گوشی موبایل',
    since: 1865,
    country: 'فنلاند',
    rating: 4.2,
  },
  {
    id: 8,
    name: 'تی‌پی‌لینک',
    nameEn: 'TP-Link',
    logo: '/images/products/tp.webp',
    category: 'tp-link',
    description: 'برند چینی تولیدکننده تجهیزات شبکه',
    since: 1996,
    country: 'چین',
    rating: 4.4,
  },
  {
    id: 9,
    name: 'تسکو',
    nameEn: 'Tesco',
    logo: '/images/products/tsco.webp',
    category: 'tesco',
    description: 'برند انگلیسی تولیدکننده لوازم خانگی',
    since: 1919,
    country: 'انگلیس',
    rating: 4.1,
  },
  {
    id: 10,
    name: 'انکر',
    nameEn: 'Anker',
    logo: '/images/products/anker.webp',
    category: 'anker',
    description: 'برند چینی تولیدکننده شارژر و پاوربانک',
    since: 2011,
    country: 'چین',
    rating: 4.6,
  },
  {
    id: 11,
    name: 'ایسر',
    nameEn: 'Acer',
    logo: '/images/products/as.webp',
    category: 'acer',
    description: 'برند تایوانی تولیدکننده لپ تاپ و کامپیوتر',
    since: 1976,
    country: 'تایوان',
    rating: 4.3,
  },
  {
    id: 12,
    name: 'ایسوس',
    nameEn: 'Asus',
    logo: '/images/products/as.webp',
    category: 'asus',
    description: 'برند تایوانی تولیدکننده لپ تاپ و قطعات کامپیوتر',
    since: 1989,
    country: 'تایوان',
    rating: 4.5,
  },
].map((brand) => ({ ...brand, productCount: brandCount(brand.category) }));

export default function BrandsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('همه');

  // استخراج کشورهای منحصر به فرد
  const countries = ['همه', ...Array.from(new Set(brands.map(b => b.country)))];

  // فیلتر برندها بر اساس جستجو و کشور
  const filteredBrands = brands.filter(brand => {
    const matchesSearch = brand.name.includes(searchTerm) || 
                         brand.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         brand.description.includes(searchTerm);
    const matchesCountry = selectedCountry === 'همه' || brand.country === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  const handleBrandClick = (category: string) => {
    router.push(`/products?brand=${category}`);
  };

  const renderRating = (rating: number) => {
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

  return (
    <div>
      <Header />
      
      <Container className="py-4">
        {/* عنوان صفحه */}
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold mb-3">برندهای معتبر</h1>
          <p className="lead text-muted">
            بیش از {brands.length} برند معتبر جهانی با بهترین قیمت و کیفیت
          </p>
        </div>

        {/* نوار جستجو و فیلتر */}
        <Row className="mb-5">
          <Col md={8} className="mx-auto">
            <InputGroup className="mb-3">
              <Form.Control
                placeholder="جستجوی برند..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="py-3"
              />
              <Button variant="primary" style={{ backgroundColor: '#6a1b9a', borderColor: '#6a1b9a' }}>
                <Search size={20} />
              </Button>
            </InputGroup>

            <div className="d-flex gap-2 flex-wrap justify-content-center">
              {countries.map(country => (
                <Button
                  key={country}
                  variant={selectedCountry === country ? 'primary' : 'outline-primary'}
                  onClick={() => setSelectedCountry(country)}
                  style={selectedCountry === country ? 
                    { backgroundColor: '#6a1b9a', borderColor: '#6a1b9a' } : 
                    { color: '#6a1b9a', borderColor: '#6a1b9a' }
                  }
                >
                  {country}
                </Button>
              ))}
            </div>
          </Col>
        </Row>

        {/* لیست برندها */}
        <Row>
          {filteredBrands.map((brand) => (
            <Col key={brand.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Card 
                className="h-100 border-0 shadow-sm brand-card"
                style={{ cursor: 'pointer' }}
                onClick={() => handleBrandClick(brand.category)}
              >
                <div className="text-center p-4">
                  <div className="brand-logo mb-3">
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      width={100}
                      height={100}
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <h5 className="fw-bold mb-1">{brand.name}</h5>
                  <p className="text-muted small mb-2">{brand.nameEn}</p>
                  
                  <div className="d-flex justify-content-center gap-1 mb-2">
                    {renderRating(brand.rating)}
                    <span className="text-muted small me-2">({brand.rating})</span>
                  </div>

                  <p className="small text-muted mb-2">{brand.description}</p>
                  
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <Badge bg="light" text="dark" className="px-3 py-2">
                      {brand.productCount} محصول
                    </Badge>
                    <Badge bg="light" text="dark" className="px-3 py-2">
                      {brand.country}
                    </Badge>
                  </div>

                  <Button 
                    variant="primary" 
                    size="sm"
                    className="mt-3 w-100"
                    style={{ backgroundColor: '#6a1b9a', borderColor: '#6a1b9a' }}
                  >
                    مشاهده محصولات
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {filteredBrands.length === 0 && (
          <div className="text-center py-5">
            <h4 className="text-muted">برندی یافت نشد</h4>
            <Button 
              variant="primary" 
              className="mt-3"
              style={{ backgroundColor: '#6a1b9a', borderColor: '#6a1b9a' }}
              onClick={() => {
                setSearchTerm('');
                setSelectedCountry('همه');
              }}
            >
              نمایش همه برندها
            </Button>
          </div>
        )}
      </Container>

      <Footer />

      <style jsx>{`
        .brand-card {
          transition: all 0.3s ease;
          overflow: hidden;
        }
        .brand-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.2) !important;
        }
        .brand-logo {
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
}