'use client';

import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
import { PRODUCTS } from '@/lib/mock-data';

const categoryIcons: Record<string, string> = {
  'گوشی موبایل': '📱',
  'تبلت': '📱',
  'لپ تاپ': '💻',
  'هدفون و هندزفری': '🎧',
  'ساعت هوشمند': '⌚',
  'اسپیکر': '🔊',
  'تلویزیون': '📺',
  'لوازم خانگی': '🏠',
  'لوازم جانبی': '🔌',
};

const categorySections = Array.from(new Set(PRODUCTS.map((p) => p.category)))
  .map((category) => ({
    title: category,
    icon: categoryIcons[category] || '🛍️',
    viewAllLink: `/products?category=${encodeURIComponent(category)}`,
    products: PRODUCTS.filter((p) => p.category === category),
  }))
  .filter((section) => section.products.length > 0);

interface CategorySectionProps {
  section: (typeof categorySections)[0];
}

const CategorySection = ({ section }: CategorySectionProps) => {
  return (
    <div className="category-section mb-5">
      <div className="d-flex justify-content-between align-items-center mb-3 px-2">
        <div className="d-flex align-items-center gap-2">
          <span className="fs-4">{section.icon}</span>
          <h3 className="fw-bold mb-0 fs-4">{section.title}</h3>
        </div>
        <Link href={section.viewAllLink} className="text-decoration-none text-primary small fw-medium">
          مشاهده همه
        </Link>
      </div>

      <div className="category-grid">
        <Row className="g-3">
          {section.products.map((product) => (
            <Col key={product.id} xs={6} sm={4} md={3} lg={2} className="mb-3">
              <Link href={`/product/${product.id}`} className="text-decoration-none">
                <div className="category-card text-center p-2 rounded-3 hover-shadow transition-all">
                  <div className="category-image-container mx-auto mb-2">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={100}
                      height={100}
                      className="img-fluid rounded-2"
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <h4 className="category-name small fw-medium text-dark mb-0">{product.name}</h4>
                </div>
              </Link>
            </Col>
          ))}
        </Row>
      </div>

      <style jsx>{`
        .category-card {
          background-color: #ffffff;
          transition: all 0.3s ease;
          border: 1px solid #f0f0f0;
          height: 100%;
        }

        .category-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(106, 27, 154, 0.15) !important;
          border-color: #6a1b9a;
        }

        .category-image-container {
          width: 100%;
          height: auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .category-image-container img {
          max-width: 100%;
          max-height: 100px;
          object-fit: contain;
        }

        .category-name {
          font-size: 0.85rem;
          line-height: 1.4;
          color: #333;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .category-name {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default function CategorySections() {
  return (
    <Container className="my-5">
      <div className="section-divider mb-5"></div>

      {categorySections.map((section) => (
        <CategorySection key={section.title} section={section} />
      ))}

      <style jsx global>{`
        .category-section {
          margin-bottom: 3rem;
        }

        .category-section:last-child {
          margin-bottom: 0;
        }

        .section-divider {
          height: 2px;
          background: linear-gradient(90deg, transparent, #6a1b9a, transparent);
          opacity: 0.3;
        }

        .hover-shadow {
          transition: all 0.3s ease;
        }

        .hover-shadow:hover {
          box-shadow: 0 8px 20px rgba(0,0,0,0.1) !important;
        }

        @media (max-width: 768px) {
          .category-section .row {
            margin-left: -5px;
            margin-right: -5px;
          }

          .category-section .col-6 {
            padding-left: 5px;
            padding-right: 5px;
          }
        }
      `}</style>
    </Container>
  );
}
