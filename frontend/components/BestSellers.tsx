'use client';

import { useState, useEffect, useRef } from 'react';
import { Container } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { ChevronLeft, ChevronRight } from 'react-bootstrap-icons';

// استایل‌های مربوط به Swiper
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const GET_BEST_SELLERS = gql`
  query GetBestSellers($limit: Int) {
    bestSellers(limit: $limit) {
      id
      name
      price
      finalPrice
      imageUrl
      discount
      brand
    }
  }
`;

interface Product {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  finalPrice: number;
  discount?: number;
  brand?: string;
}

export default function BestSellers() {
  const [swiper, setSwiper] = useState<any>(null);
  const [showPrevButton, setShowPrevButton] = useState(false);
  const [showNextButton, setShowNextButton] = useState(true);
  const swiperRef = useRef<any>(null);

  const { loading, error, data } = useQuery(GET_BEST_SELLERS, {
    variables: { limit: 18 }
  });

  useEffect(() => {
    import('swiper/react').then(({ Swiper, SwiperSlide }) => {
      if (typeof window !== 'undefined') {
        setSwiper({ Swiper, SwiperSlide });
      }
    });
  }, []);

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US') + ' تومان';
  };

  if (loading || !swiper) return (
    <Container className="my-5">
      <div className="bg-white rounded-3 p-3 shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3 px-2">
          <h5 className="fw-bold mb-0 fs-5">پرفروش‌ترین کالاها</h5>
        </div>
        <div className="d-flex gap-3 overflow-hidden">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="placeholder-glow" style={{ width: '280px' }}>
              <div className="placeholder bg-secondary" style={{ width: '70px', height: '70px', borderRadius: '8px' }}></div>
              <div className="placeholder bg-secondary col-8 mt-2"></div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );

  if (error) return null;

  const { Swiper, SwiperSlide } = swiper;
  const products = data?.bestSellers || [];

  if (products.length === 0) return null;

  // گروه‌بندی محصولات به صورت 6 تایی برای هر اسلاید
  const groupedProducts = [];
  for (let i = 0; i < products.length; i += 6) {
    groupedProducts.push(products.slice(i, i + 6));
  }

  return (
    <Container className="my-5">
      <div className="bg-white rounded-3 p-3 shadow-sm position-relative">
        {/* ========== هدر بخش ========== */}
        <div className="d-flex justify-content-between align-items-center mb-3 px-2">
          <div className="d-flex align-items-center gap-2">
            {/* آیکون روند جستجو */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#f9a825">
              <path d="M9.5 3C13.09 3 16 5.91 16 9.5C16 11.11 15.41 12.59 14.44 13.73L14.71 14H15.5L20.5 19L19 20.5L14 15.5V14.71L13.73 14.44C12.59 15.41 11.11 16 9.5 16C5.91 16 3 13.09 3 9.5C3 5.91 5.91 3 9.5 3M9.5 5C7 5 5 7 5 9.5C5 12 7 14 9.5 14C12 14 14 12 14 9.5C14 7 12 5 9.5 5Z" />
            </svg>
            <h5 className="fw-bold mb-0 fs-5">پرفروش‌ترین کالاها</h5>
          </div>
          <Link href="/products?sort=best-selling" className="text-decoration-none text-primary small">
            مشاهده همه
          </Link>
        </div>

        {/* ========== اسلایدر ========== */}
        <div className="position-relative">
          <Swiper
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 1.2 },
              1024: { slidesPerView: 1.5 },
              1280: { slidesPerView: 2 }
            }}
            onSwiper={(swiper: any) => {
              swiperRef.current = swiper;
              setShowPrevButton(false);
              setShowNextButton(true);
            }}
            onSlideChange={(swiper: any) => {
              setShowPrevButton(!swiper.isBeginning);
              setShowNextButton(!swiper.isEnd);
            }}
            dir="rtl"
            className="best-sellers-swiper"
          >
            {groupedProducts.map((group, groupIndex) => (
              <SwiperSlide key={groupIndex}>
                <div className="d-flex flex-column gap-2">
                  {/* 3 ردیف 2 تایی */}
                  {[0, 2, 4].map((startIndex) => (
                    <div key={startIndex} className="d-flex gap-3">
                      {/* محصول اول */}
                      {group[startIndex] && (
                        <Link href={`/product/${group[startIndex].id}`} className="text-decoration-none flex-grow-1">
                          <div className="d-flex align-items-center gap-2 p-2 rounded-2 hover-shadow transition-all">
                            <div className="bg-light rounded-2 overflow-hidden flex-shrink-0" style={{ width: '86px', height: '86px' }}>
                              <Image
                                src={group[startIndex].imageUrl || '/images/placeholder.jpg'}
                                alt={group[startIndex].name}
                                width={86}
                                height={86}
                                style={{ objectFit: 'contain' }}
                                className="img-fluid"
                              />
                            </div>
                            <span className="text-secondary-500 fw-bold fs-4 flex-shrink-0" style={{ color: '#f9a825' }}>
                              {groupIndex * 6 + startIndex + 1}
                            </span>
                            <div className="flex-grow-1">
                              <p className="text-dark small mb-0 text-truncate-2" style={{ fontSize: '12px', lineHeight: '1.4' }}>
                                {group[startIndex].name}
                              </p>
                            </div>
                          </div>
                        </Link>
                      )}
                      
                      {/* محصول دوم */}
                      {group[startIndex + 1] && (
                        <Link href={`/product/${group[startIndex + 1].id}`} className="text-decoration-none flex-grow-1">
                          <div className="d-flex align-items-center gap-2 p-2 rounded-2 hover-shadow transition-all">
                            <div className="bg-light rounded-2 overflow-hidden flex-shrink-0" style={{ width: '86px', height: '86px' }}>
                              <Image
                                src={group[startIndex + 1].imageUrl || '/images/placeholder.jpg'}
                                alt={group[startIndex + 1].name}
                                width={86}
                                height={86}
                                style={{ objectFit: 'contain' }}
                                className="img-fluid"
                              />
                            </div>
                            <span className="text-secondary-500 fw-bold fs-4 flex-shrink-0" style={{ color: '#f9a825' }}>
                              {groupIndex * 6 + startIndex + 2}
                            </span>
                            <div className="flex-grow-1">
                              <p className="text-dark small mb-0 text-truncate-2" style={{ fontSize: '12px', lineHeight: '1.4' }}>
                                {group[startIndex + 1].name}
                              </p>
                            </div>
                          </div>
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* ========== دکمه‌های ناوبری با جهت درست و رنگ تیره‌تر ========== */}
          
          {/* ✅ دکمه چپ (previous) - باید در سمت راست باشد با آیکون راست */}
          {showPrevButton && (
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="position-absolute top-50 translate-middle-y btn btn-light rounded-circle shadow-lg d-none d-lg-flex align-items-center justify-content-center navigation-button"
              style={{ 
                width: '48px', 
                height: '48px', 
                zIndex: 10, 
                right: '-10px',           // ✅ در سمت راست
                transform: 'translateY(-50%)',
                backgroundColor: '#ffffff',
                border: '1px solid #e0e0e0',
                opacity: 0.95,
                boxShadow: '0 4px 12px rgba(0,0,0,0.25) !important'
              }}
            >
              <ChevronRight size={24} color="#333333" />  {/* ✅ آیکون راست */}
            </button>
          )}
          
          {/* ✅ دکمه راست (next) - باید در سمت چپ باشد با آیکون چپ */}
          {showNextButton && (
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="position-absolute top-50 translate-middle-y btn btn-light rounded-circle shadow-lg d-none d-lg-flex align-items-center justify-content-center navigation-button"
              style={{ 
                width: '48px', 
                height: '48px', 
                zIndex: 10, 
                left: '-10px',             // ✅ در سمت چپ
                transform: 'translateY(-50%)',
                backgroundColor: '#ffffff',
                border: '1px solid #e0e0e0',
                opacity: 0.95,
                boxShadow: '0 4px 12px rgba(0,0,0,0.25) !important'
              }}
            >
              <ChevronLeft size={24} color="#333333" />   {/* ✅ آیکون چپ */}
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .hover-shadow:hover {
          background-color: #f8f9fa;
          transition: all 0.3s ease;
        }
        .text-truncate-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .transition-all {
          transition: all 0.3s ease;
        }
        .best-sellers-swiper {
          padding: 8px 0;
        }
        
        .best-sellers-swiper .swiper-slide {
          height: auto;
        }
        
        .text-secondary-500 {
          color: #f9a825;
          min-width: 30px;
          text-align: center;
        }
        
        /* ========== استایل دکمه‌های ناوبری ========== */
        .navigation-button {
          transition: all 0.2s ease;
          background-color: white !important;
          border: 1px solid #cccccc !important;
        }
        
        .navigation-button:hover {
          background-color: #f5f5f5 !important;
          transform: translateY(-50%) scale(1.1) !important;
          border-color: #999999 !important;
          box-shadow: 0 6px 16px rgba(0,0,0,0.3) !important;
        }
        
        .navigation-button:active {
          transform: translateY(-50%) scale(0.95) !important;
        }
        
        @media (max-width: 768px) {
          .best-sellers-swiper .d-flex.gap-3 {
            gap: 0.5rem !important;
          }
        }
      `}</style>
    </Container>
  );
}