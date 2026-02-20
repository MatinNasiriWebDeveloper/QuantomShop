'use client';

import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

// ========== داده‌های استاتیک دسته‌بندی‌ها با ۱۱ محصول ==========
const categorySections = [
  {
    id: 1,
    title: 'مد و پوشاک زنانه',
    viewAllLink: '/products?category=women-fashion',
    icon: '👗',
    categories: [
      { id: 1, name: 'تا‌پ و بلوز', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/949d1d00-4598-4e42-a237-b23edc42156a.png', link: '/products?category=women-tops' },
      { id: 2, name: 'لباس مجلسی', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/fae75909-3903-4436-95a9-52f2cf4f1388.png', link: '/products?category=women-dresses' },
      { id: 3, name: 'لباس ورزشی', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/ddc82077-0e49-4a79-b80f-011dd351fff1.png', link: '/products?category=women-activewear' },
      { id: 4, name: 'شلوار و لگینگ', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/5fff67a3-e50a-4bda-9d03-4e1575d60dc3.png', link: '/products?category=women-pants' },
      { id: 5, name: 'صندل و کفش', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/b2b845a9-9aed-4caf-8ec8-e99ce7e35016.png', link: '/products?category=women-sandals' },
      { id: 6, name: 'کفش زنانه', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/2108ffef-3b21-4558-ac81-fd2d073836ee.png', link: '/products?category=women-shoes' },
      { id: 7, name: 'کیف دستی', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/0f7c6e45-4159-44af-aa70-0ff1a5de2bb7.png', link: '/products?category=handbags' },
      { id: 8, name: 'شومیز', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/1e8b7c3d-4f5a-4b3c-9d8e-7f6a5b4c3d2e.png', link: '/products?category=women-blouses' },
      { id: 9, name: 'مانتو', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/2f9c8d7e-6a5b-4c3d-8e1f-9b7a6c5d4e3f.png', link: '/products?category=women-manteau' },
      { id: 10, name: 'شال و روسری', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/3e0d9c8b-7a6f-5e4d-9c8b-7a6f5e4d3c2b.png', link: '/products?category=scarves' },
      { id: 11, name: 'لباس خواب', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/4f1e0d9c-8b7a-6f5e-4d3c-2b1a0f9e8d7c.png', link: '/products?category=women-nightwear' }
    ]
  },
  {
    id: 2,
    title: 'مد و پوشاک مردانه',
    viewAllLink: '/products?category=men-fashion',
    icon: '👔',
    categories: [
      { id: 12, name: 'تی‌شرت و پولوشرت', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/61c2d7a8-f258-4989-b749-9a1a2ce40051.png', link: '/products?category=men-tshirts' },
      { id: 13, name: 'شلوار مردانه', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/0195f5fa-0adf-4629-ba35-c93635560d5f.png', link: '/products?category=men-pants' },
      { id: 14, name: 'چمدان و ساک', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/0590db80-6cd0-49a8-acda-646992097e7f.png', link: '/products?category=luggage' },
      { id: 15, name: 'لباس ورزشی', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/e549e35d-29ba-4eb3-a363-a72e6be06f43.png', link: '/products?category=men-sportswear' },
      { id: 16, name: 'کفش مردانه', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/7f7cf18d-70e0-4714-9289-27d7ab56d268.png', link: '/products?category=men-shoes' },
      { id: 17, name: 'اکسسوری', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/0e2f1515-27b0-415e-9c61-9832a670d7be.png', link: '/products?category=men-accessories' },
      { id: 18, name: 'کت و ژاکت', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/6785260a-7af4-49f8-bc32-a9c7e7e87e80.png', link: '/products?category=men-jackets' },
      { id: 19, name: 'پیراهن مردانه', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/5a6b7c8d-9e0f-1a2b-3c4d-5e6f7a8b9c0d.png', link: '/products?category=men-shirts' },
      { id: 20, name: 'سویشرت', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/6b7c8d9e-0f1a-2b3c-4d5e-6f7a8b9c0d1e.png', link: '/products?category=men-sweatshirts' },
      { id: 21, name: 'شلوار جین', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/7c8d9e0f-1a2b-3c4d-5e6f-7a8b9c0d1e2f.png', link: '/products?category=men-jeans' },
      { id: 22, name: 'کمربند', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/8d9e0f1a-2b3c-4d5e-6f7a-8b9c0d1e2f3a.png', link: '/products?category=belts' }
    ]
  },
  {
    id: 3,
    title: 'زیبایی و مراقبت شخصی',
    viewAllLink: '/products?category=beauty',
    icon: '💄',
    categories: [
      { id: 23, name: 'آرایشی', imageUrl: 'https://a.nooncdn.com/mpcms/EN0002/assets/6d373cd8-7882-4180-8b7b-ea68b14a0e26.png', link: '/products?category=makeup' },
      { id: 24, name: 'مراقبت از پوست', imageUrl: 'https://a.nooncdn.com/mpcms/EN0002/assets/3060d6af-f35f-46fd-98c5-abf9787d8f54.png', link: '/products?category=skincare' },
      { id: 25, name: 'ابزار حالت‌دهنده مو', imageUrl: 'https://a.nooncdn.com/mpcms/EN0002/assets/4113ec52-1d33-4ae3-919a-9f7d0160944b.png', link: '/products?category=hair-styling' },
      { id: 26, name: 'مراقبت از مو', imageUrl: 'https://a.nooncdn.com/mpcms/EN0002/assets/951e3d25-8d3d-4e7c-8bb7-de97dd512748.png', link: '/products?category=hair-care' },
      { id: 27, name: 'وسایل برقی شخصی', imageUrl: 'https://a.nooncdn.com/mpcms/EN0002/assets/90166f31-ab2b-4a25-afa4-a7bf1f4c04fd.png', link: '/products?category=personal-care-electronics' },
      { id: 28, name: 'آقایان', imageUrl: 'https://a.nooncdn.com/mpcms/EN0002/assets/91db993e-7e37-4200-9f1f-17f7d99017ab.png', link: '/products?category=men-grooming' },
      { id: 29, name: 'حمام و بدن', imageUrl: 'https://a.nooncdn.com/mpcms/EN0002/assets/9e6e4e3f-9a5f-48e4-bd35-a0b3fed5b672.png', link: '/products?category=bath-body' },
      { id: 30, name: 'عطر و ادکلن', imageUrl: 'https://a.nooncdn.com/mpcms/EN0002/assets/0a1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d.png', link: '/products?category=fragrance' },
      { id: 31, name: 'کرم ضد آفتاب', imageUrl: 'https://a.nooncdn.com/mpcms/EN0002/assets/1b2c3d4e-5f6a-7b8c-9d0e-1f2a3b4c5d6e.png', link: '/products?category=sunscreen' },
      { id: 32, name: 'ماسک صورت', imageUrl: 'https://a.nooncdn.com/mpcms/EN0002/assets/2c3d4e5f-6a7b-8c9d-0e1f-2a3b4c5d6e7f.png', link: '/products?category=face-mask' },
      { id: 33, name: 'لوازم اصلاح', imageUrl: 'https://a.nooncdn.com/mpcms/EN0002/assets/3d4e5f6a-7b8c-9d0e-1f2a-3b4c5d6e7f8a.png', link: '/products?category=shaving' }
    ]
  },
  {
    id: 4,
    title: 'ساعت',
    viewAllLink: '/products?category=watches',
    icon: '⌚',
    categories: [
      { id: 34, name: 'کاسیو', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/52035218-7d01-4f46-b814-110f4a7c6ed9.png', link: '/products?brand=casio' },
      { id: 35, name: 'تامی هیلفیگر', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/ae80f216-8371-4906-ae7d-0ae380930192.png', link: '/products?brand=tommy-hilfiger' },
      { id: 36, name: 'فسیل', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/f47aab20-47ce-45a1-bc3e-c352e5f7301f.png', link: '/products?brand=fossil' },
      { id: 37, name: 'هوگو باس', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/ae4a0e05-4d32-40e9-966f-bac7a60b3ecd.png', link: '/products?brand=hugo-boss' },
      { id: 38, name: 'گس', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/5df17566-f166-4b36-8ddf-61fbe2fc0850.png', link: '/products?brand=guess' },
      { id: 39, name: 'پلیس', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/84ba1302-c9ba-4f7c-bc89-9359879ca739.png', link: '/products?brand=police' },
      { id: 40, name: 'لاکوست', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/93f6b4bf-fe6b-47f8-addb-ca964a3dd1a5.png', link: '/products?brand=lacoste' },
      { id: 41, name: 'سواتچ', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/4e5f6a7b-8c9d-0e1f-2a3b-4c5d6e7f8a9b.png', link: '/products?brand=swatch' },
      { id: 42, name: 'سی‌تی‌زنی', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/5f6a7b8c-9d0e-1f2a-3b4c-5d6e7f8a9b0c.png', link: '/products?brand=citizen' },
      { id: 43, name: 'سیکو', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/6a7b8c9d-0e1f-2a3b-4c5d-6e7f8a9b0c1d.png', link: '/products?brand=seiko' },
      { id: 44, name: 'اسمارت واچ', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/7b8c9d0e-1f2a-3b4c-5d6e-7f8a9b0c1d2e.png', link: '/products?category=smart-watches' }
    ]
  },
  {
    id: 5,
    title: 'ورزش و سفر',
    viewAllLink: '/products?category=sports-outdoors',
    icon: '⚽',
    categories: [
      { id: 45, name: 'اسکوتر', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/272f9599-717b-421c-8ffa-2de7d26954bc.png', link: '/products?category=scooters' },
      { id: 46, name: 'بدنسازی', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/7f40f5fc-2ae3-4b46-b3b8-49a7fd519b25.png', link: '/products?category=fitness' },
      { id: 47, name: 'کمپینگ و کوهنوردی', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/c502f313-1de1-4ba6-a80b-4080b6e867d7.png', link: '/products?category=camping' },
      { id: 48, name: 'ورزش‌های راکتی', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/c1cd9b68-2c5a-4236-bfc2-a64561ef7599.png', link: '/products?category=racquet-sports' },
      { id: 49, name: 'یوگا', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/1d975f4c-530b-4a2a-8066-f2564d423dea.png', link: '/products?category=yoga' },
      { id: 50, name: 'دوچرخه‌سواری', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/0ade9726-15c4-4a06-9505-09dd4433c8e5.png', link: '/products?category=cycling' },
      { id: 51, name: 'ورزش‌های رزمی', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/e70c7797-f0ad-4057-bd80-2ac3d54cd452.png', link: '/products?category=combat-sports' },
      { id: 52, name: 'طناب زدن', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/8c9d0e1f-2a3b-4c5d-6e7f-8a9b0c1d2e3f.png', link: '/products?category=jump-rope' },
      { id: 53, name: 'دمبل و هالتر', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/9d0e1f2a-3b4c-5d6e-7f8a-9b0c1d2e3f4a.png', link: '/products?category=dumbbells' },
      { id: 54, name: 'تشک ورزشی', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/0e1f2a3b-4c5d-6e7f-8a9b-0c1d2e3f4a5b.png', link: '/products?category=yoga-mat' },
      { id: 55, name: 'کوله پشتی', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/1f2a3b4c-5d6e-7f8a-9b0c-1d2e3f4a5b6c.png', link: '/products?category=backpacks' }
    ]
  },
  {
    id: 6,
    title: 'خودرو',
    viewAllLink: '/products?category=automotive',
    icon: '🚗',
    categories: [
      { id: 56, name: 'لوازم داخلی', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/2120f2ac-3e79-40d2-a84c-578ff0e07d7a.png', link: '/products?category=car-interior' },
      { id: 57, name: 'قطعات یدکی', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/143abe68-ee00-4bc2-92b5-b7fd9b0e8d0b.png', link: '/products?category=auto-parts' },
      { id: 58, name: 'مراقبت از خودرو', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/c8012584-14b5-4fdc-8ed6-71b1f08718e1.png', link: '/products?category=car-care' },
      { id: 59, name: 'الکترونیک خودرو', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/a2597d10-a413-40ba-adea-4bd378cb03a4.png', link: '/products?category=car-electronics' },
      { id: 60, name: 'ابزار', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/337770ea-189c-4ad1-b7b6-db5adec6be51.png', link: '/products?category=auto-tools' },
      { id: 61, name: 'روغن و مایعات', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/432b239a-86dd-4993-9296-483c6f0363e3.png', link: '/products?category=auto-fluids' },
      { id: 62, name: 'موتورسیکلت', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/a1d29a06-2116-4e81-9e5f-60f6babd6e6a.png', link: '/products?category=motorcycle' },
      { id: 63, name: 'ضد یخ', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/2a3b4c5d-6e7f-8a9b-0c1d-2e3f4a5b6c7d.png', link: '/products?category=antifreeze' },
      { id: 64, name: 'باتری ماشین', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/3b4c5d6e-7f8a-9b0c-1d2e-3f4a5b6c7d8e.png', link: '/products?category=car-battery' },
      { id: 65, name: 'لاستیک', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/4c5d6e7f-8a9b-0c1d-2e3f-4a5b6c7d8e9f.png', link: '/products?category=tires' },
      { id: 66, name: 'چراغ خودرو', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/5d6e7f8a-9b0c-1d2e-3f4a-5b6c7d8e9f0a.png', link: '/products?category=car-lights' }
    ]
  },
  {
    id: 7,
    title: 'لوازم التحریر و اداری',
    viewAllLink: '/products?category=stationery',
    icon: '📚',
    categories: [
      { id: 67, name: 'ماشین حساب', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/60ce4222-a434-400a-988f-2915b6c97be9.png', link: '/products?category=calculators' },
      { id: 68, name: 'نوشت‌افزار', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/dd153427-f9d1-4eef-a928-df32d4f328eb.png', link: '/products?category=writing-supplies' },
      { id: 69, name: 'دفتر و یادداشت', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/32ad9a12-c6f5-4322-bf90-a6ceab98ae98.png', link: '/products?category=notebooks' },
      { id: 70, name: 'لوازم میز کار', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/4a92ef9e-dd30-4389-889c-f0224ce00b7b.png', link: '/products?category=desk-accessories' },
      { id: 71, name: 'تخته وایت‌برد', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/7fcf73a4-5c59-4a14-91c3-f6b33807927c.png', link: '/products?category=whiteboards' },
      { id: 72, name: 'چسب و چسب‌کاری', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/c890c5f4-34ed-4c59-b0c8-ac07374dc674.png', link: '/products?category=adhesives' },
      { id: 73, name: 'برچسب و مهر', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/eeb22af7-b881-46a9-9e99-56bc9428961a.png', link: '/products?category=labels-stamps' },
      { id: 74, name: 'خودکار', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/6e7f8a9b-0c1d-2e3f-4a5b-6c7d8e9f0a1b.png', link: '/products?category=pens' },
      { id: 75, name: 'مداد', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/7f8a9b0c-1d2e-3f4a-5b6c-7d8e9f0a1b2c.png', link: '/products?category=pencils' },
      { id: 76, name: 'پاک‌کن', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/8a9b0c1d-2e3f-4a5b-6c7d-8e9f0a1b2c3d.png', link: '/products?category=erasers' },
      { id: 77, name: 'تراش', imageUrl: 'https://a.nooncdn.com/mpcms/EN0001/assets/9b0c1d2e-3f4a-5b6c-7d8e-9f0a1b2c3d4e.png', link: '/products?category=sharpeners' }
    ]
  }
];

interface CategorySectionProps {
  section: typeof categorySections[0];
}

const CategorySection = ({ section }: CategorySectionProps) => {
  return (
    <div className="category-section mb-5">
      {/* هدر بخش */}
      <div className="d-flex justify-content-between align-items-center mb-3 px-2">
        <div className="d-flex align-items-center gap-2">
          <span className="fs-4">{section.icon}</span>
          <h3 className="fw-bold mb-0 fs-4">{section.title}</h3>
        </div>
        <Link href={section.viewAllLink} className="text-decoration-none text-primary small fw-medium">
          مشاهده همه
        </Link>
      </div>

      {/* دسته‌بندی‌ها */}
      <div className="category-grid">
        <Row className="g-3">
          {section.categories.map((category) => (
            <Col key={category.id} xs={6} sm={4} md={3} lg={2} className="mb-3">
              <Link href={category.link} className="text-decoration-none">
                <div className="category-card text-center p-2 rounded-3 hover-shadow transition-all">
                  <div className="category-image-container mx-auto mb-2">
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      width={100}
                      height={100}
                      className="img-fluid rounded-2"
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <h4 className="category-name small fw-medium text-dark mb-0">{category.name}</h4>
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
  const [hoveredSection, setHoveredSection] = useState<number | null>(null);

  return (
    <Container className="my-5">
      {/* خط جداکننده بالای بخش‌ها */}
      <div className="section-divider mb-5"></div>

      {/* تمام بخش‌های دسته‌بندی */}
      {categorySections.map((section) => (
        <CategorySection key={section.id} section={section} />
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