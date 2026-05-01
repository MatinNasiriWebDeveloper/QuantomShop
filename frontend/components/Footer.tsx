'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Dropdown, Spinner } from 'react-bootstrap';
import Link from 'next/link';
import { useQuery } from '@apollo/client';
import { 
  Globe, 
  ChevronDown, 
  Instagram, 
  Telegram, 
  Twitter, 
  Linkedin,
  Phone,
  Envelope,
  GeoAlt
} from 'react-bootstrap-icons';
import { 
  GET_CATEGORIES, 
  GET_BEST_DISCOUNTS, 
  GET_NEWEST_PRODUCTS, 
  GET_STORE_INFO 
} from '@/lib/graphql-queries';

export default function Footer() {
  const [language, setLanguage] = useState('fa');
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const { data: categoriesData, loading: categoriesLoading } = useQuery(GET_CATEGORIES);
  const { data: discountsData, loading: discountsLoading } = useQuery(GET_BEST_DISCOUNTS, {
    variables: { limit: 5 }
  });
  const { data: newestData, loading: newestLoading } = useQuery(GET_NEWEST_PRODUCTS, {
    variables: { limit: 4 }
  });
  const { data: storeData, loading: storeLoading } = useQuery(GET_STORE_INFO);

  const languages = [
    { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' }
  ];

  const currentLang = languages.find(lang => lang.code === language) || languages[0];
  const categories = categoriesData?.categories || [];
  const discounts = discountsData?.bestDiscounts || [];
  const newestProducts = newestData?.newestProducts || [];
  const storeInfo = storeData?.storeInfo;

  if (categoriesLoading || discountsLoading || newestLoading || storeLoading) {
    return (
      <footer className="bg-dark text-white pt-5 mt-5">
        <Container className="text-center py-5">
          <Spinner animation="border" variant="light" />
          <p className="mt-3 text-white-50">در حال بارگذاری...</p>
        </Container>
      </footer>
    );
  }

  return (
    <footer className="bg-6a1b9a text-white fw-bold pt-5 mt-5" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Container>
        <Row>
          {/* ستون اول: دسته‌بندی */}
          <Col md={3} className="mb-4">
            <h5 className="fw-bold mb-3">دسته‌بندی کالاها</h5>
            <Nav className="flex-column">
              {categories.slice(0, 6).map((cat: any) => (
                <Nav.Link 
                  key={cat.id}
                  href={`/products?category=${cat.slug}`} 
                  className="text-white-50 p-0 pb-2"
                >
                  {cat.name} {cat.productCount ? `(${cat.productCount})` : ''}
                </Nav.Link>
              ))}
            </Nav>
          </Col>

          {/* ستون دوم: بهترین تخفیف‌ها */}
          <Col md={2} className="mb-4">
            <h5 className="fw-bold mb-3">بهترین تخفیف‌ها</h5>
            <Nav className="flex-column">
              {discounts.map((discount: any, index: number) => (
                <Nav.Link 
                  key={index}
                  href={`/products?discount=${discount.discountPercent}`} 
                  className="text-white-50 p-0 pb-2"
                >
                  {discount.title}
                </Nav.Link>
              ))}
              <Nav.Link href="/products?filter=flash-sale" className="text-white-50 p-0 pb-2">
                فروش ویژه
              </Nav.Link>
            </Nav>
          </Col>

          {/* ستون سوم: جدیدترین محصولات */}
          <Col md={2} className="mb-4">
            <h5 className="fw-bold mb-3">جدیدترین محصولات</h5>
            <Nav className="flex-column">
              {newestProducts.slice(0, 4).map((product: any) => (
                <Nav.Link 
                  key={product.id}
                  href={`/product/${product.id}`} 
                  className="text-white-50 p-0 pb-2"
                >
                  {product.name}
                </Nav.Link>
              ))}
              <Nav.Link href="/products?sort=newest" className="text-white-50 p-0 pb-2">
                مشاهده همه
              </Nav.Link>
            </Nav>
          </Col>

          {/* ستون چهارم: آدرس و اطلاعات تماس */}
          <Col md={2} className="mb-4">
            <h5 className="fw-bold mb-3">آدرس و اطلاعات</h5>
            {storeInfo && (
              <>
                <div className="d-flex align-items-center mb-2 text-white-50">
                  <GeoAlt className="me-2" />
                  <span>{storeInfo.address}</span>
                </div>
                <div className="d-flex align-items-center mb-2 text-white-50">
                  <Phone className="me-2" />
                  <span dir="ltr">{storeInfo.phone}</span>
                </div>
                <div className="d-flex align-items-center mb-2 text-white-50">
                  <Envelope className="me-2" />
                  <span>{storeInfo.email}</span>
                </div>
              </>
            )}
          </Col>

          {/* ستون پنجم: انتخاب زبان و شبکه‌های اجتماعی */}
          <Col md={3} className="mb-4">
            {/* <h5 className="fw-bold mb-3">زبان سایت</h5>
            
            <div className="position-relative mb-4">
              <Dropdown onToggle={() => setShowLangDropdown(!showLangDropdown)}>
                <Dropdown.Toggle 
                  variant="outline-light" 
                  className="w-100 d-flex align-items-center justify-content-between"
                >
                  <span>{currentLang.flag} {currentLang.name}</span>
                  <ChevronDown />
                </Dropdown.Toggle>

                <Dropdown.Menu className="w-100">
                  {languages.map((lang) => (
                    <Dropdown.Item 
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className="d-flex align-items-center"
                    >
                      <span className="me-2">{lang.flag}</span>
                      {lang.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div> */}

            <h5 className="fw-bold mb-3">شبکه‌های اجتماعی</h5>
            <div className="d-flex gap-3">
              {storeInfo?.socialLinks && (
                <>
                  <a href={storeInfo.socialLinks.instagram} className="text-white-50 hover-text-primary">
                    <Instagram size={24} />
                  </a>
                  <a href={storeInfo.socialLinks.telegram} className="text-white-50 hover-text-primary">
                    <Telegram size={24} />
                  </a>
                  <a href={storeInfo.socialLinks.twitter} className="text-white-50 hover-text-primary">
                    <Twitter size={24} />
                  </a>
                  <a href={storeInfo.socialLinks.linkedin} className="text-white-50 hover-text-primary">
                    <Linkedin size={24} />
                  </a>
                </>
              )}
            </div>
          </Col>
        </Row>

        <hr className="bg-secondary" />

        <Row className="py-3">
          <Col className="text-center text-white-50">
            <p className="mb-0">
              © {new Date().getFullYear()} کوانتوم شاپ - تمامی حقوق محفوظ است
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}