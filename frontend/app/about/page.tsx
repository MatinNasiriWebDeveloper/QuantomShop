'use client';

import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Truck, ShieldCheck, Headset, ArrowRepeat, Award, People, BoxSeam, GraphUp } from 'react-bootstrap-icons';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const STATS = [
  { icon: <Award size={28} />, value: '۸ سال', label: 'سابقه فعالیت' },
  { icon: <BoxSeam size={28} />, value: '+۱۲,۰۰۰', label: 'محصول متنوع' },
  { icon: <People size={28} />, value: '+۲۵۰,۰۰۰', label: 'مشتری راضی' },
  { icon: <GraphUp size={28} />, value: '+۹۸٪', label: 'رضایت مشتریان' },
];

const FEATURES = [
  {
    icon: <Truck size={30} />,
    title: 'ارسال سریع',
    desc: 'ارسال به سراسر کشور با سریع‌ترین زمان تحویل و امکان ارسال رایگان برای خریدهای بالای ۲۰۰ هزار تومان.',
  },
  {
    icon: <ShieldCheck size={30} />,
    title: 'پرداخت امن',
    desc: 'درگاه پرداخت مطمئن و رمزنگاری‌شده برای حفظ امنیت اطلاعات بانکی و شخصی شما در تمام مراحل خرید.',
  },
  {
    icon: <Headset size={30} />,
    title: 'پشتیبانی ۲۴/۷',
    desc: 'تیم پشتیبانی کوانتوم شاپ به‌صورت شبانه‌روزی آماده پاسخ‌گویی به سوالات و پیگیری سفارش‌های شماست.',
  },
  {
    icon: <ArrowRepeat size={30} />,
    title: 'ضمانت بازگشت کالا',
    desc: 'امکان بازگشت کالا تا ۷ روز پس از تحویل، بدون نیاز به دلیل خاص و با بازگشت کامل وجه.',
  },
];

export default function AboutPage() {
  return (
    <div>
      <Header />

      <section
        className="text-white py-5"
        style={{ background: 'linear-gradient(135deg, #6a1b9a 0%, #9c27b0 100%)' }}
      >
        <Container>
          <Row className="align-items-center">
            <Col lg={7}>
              <Badge bg="light" text="dark" className="mb-3 px-3 py-2">درباره کوانتوم شاپ</Badge>
              <h1 className="display-6 fw-bold mb-3">فروشگاهی برای زندگی امروز شما</h1>
              <p className="lead opacity-75 mb-0">
                کوانتوم شاپ از سال ۱۳۹۷ با هدف ساده‌سازی تجربه خرید آنلاین در ایران فعالیت خود را آغاز کرد.
                امروز با هزاران محصول متنوع در حوزه دیجیتال، لوازم خانگی و کالای دکوراتیو، تلاش می‌کنیم
                خریدی سریع، مطمئن و لذت‌بخش را برای هر ایرانی فراهم کنیم.
              </p>
            </Col>
            <Col lg={5} className="text-center mt-4 mt-lg-0">
              <BoxSeam size={140} className="opacity-75" />
            </Col>
          </Row>
        </Container>
      </section>

      <Container className="py-5">
        <Row className="g-4 mb-5">
          {STATS.map((stat) => (
            <Col key={stat.label} xs={6} md={3}>
              <Card className="border-0 shadow-sm h-100 text-center">
                <Card.Body className="p-4">
                  <div
                    className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: '60px', height: '60px', backgroundColor: 'rgba(106, 27, 154, 0.1)', color: '#6a1b9a' }}
                  >
                    {stat.icon}
                  </div>
                  <h3 className="fw-bold mb-1">{stat.value}</h3>
                  <p className="text-muted small mb-0">{stat.label}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Row className="align-items-center mb-5">
          <Col lg={6} className="mb-4 mb-lg-0">
            <h2 className="h3 fw-bold mb-3">داستان کوانتوم شاپ</h2>
            <p className="text-muted mb-3">
              همه‌چیز از یک ایده ساده شروع شد: خرید آنلاین باید سریع، شفاف و قابل‌اعتماد باشد. تیم کوانتوم شاپ
              با گردآوری بهترین برندهای موبایل، لپ‌تاپ، لوازم صوتی‌تصویری و کالای دکوراتیو، فروشگاهی ساخته
              که در آن مشتری با خیال راحت خرید می‌کند.
            </p>
            <p className="text-muted mb-0">
              امروز کوانتوم شاپ با شبکه‌ای گسترده از تأمین‌کنندگان معتبر و انبارهای مجهز، سفارش‌ها را در
              کوتاه‌ترین زمان ممکن به دست مشتریان در سراسر ایران می‌رساند و همچنان بر اصل «مشتری اول» پایبند است.
            </p>
          </Col>
          <Col lg={6}>
            <h2 className="h3 fw-bold mb-3">ماموریت ما</h2>
            <p className="text-muted mb-3">
              ماموریت ما در کوانتوم شاپ، دسترسی آسان و مطمئن هر ایرانی به کالاهای باکیفیت با قیمتی منصفانه است.
              ما معتقدیم خرید اینترنتی باید تجربه‌ای خوشایند باشد، نه دغدغه‌ای اضافه.
            </p>
            <p className="text-muted mb-0">
              با ارائه گزینه‌های متنوع پرداخت از جمله خرید اعتباری و اقساطی، کیف پول داخلی و ضمانت بازگشت کالا،
              تلاش می‌کنیم این تجربه را برای همه مشتریان ساده‌تر کنیم.
            </p>
          </Col>
        </Row>

        <section className="mb-5">
          <h2 className="h3 fw-bold text-center mb-4">چرا کوانتوم شاپ؟</h2>
          <Row className="g-4">
            {FEATURES.map((feature) => (
              <Col key={feature.title} md={6} lg={3}>
                <Card className="border-0 shadow-sm h-100 text-center">
                  <Card.Body className="p-4">
                    <div
                      className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                      style={{ width: '64px', height: '64px', backgroundColor: 'rgba(106, 27, 154, 0.1)', color: '#6a1b9a' }}
                    >
                      {feature.icon}
                    </div>
                    <h5 className="fw-bold mb-2">{feature.title}</h5>
                    <p className="text-muted small mb-0">{feature.desc}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        <section
          className="text-center text-white rounded-4 p-5"
          style={{ background: 'linear-gradient(135deg, #6a1b9a 0%, #9c27b0 100%)' }}
        >
          <h2 className="h3 fw-bold mb-3">آماده شروع خرید هستید؟</h2>
          <p className="lead opacity-75 mb-4">
            هزاران محصول متنوع با بهترین قیمت منتظر شماست.
          </p>
          <Link href="/products">
            <Button variant="light" size="lg" className="fw-bold px-5">
              مشاهده محصولات
            </Button>
          </Link>
        </section>
      </Container>

      <Footer />
    </div>
  );
}
