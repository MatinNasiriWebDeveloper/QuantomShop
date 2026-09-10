'use client';

import { useParams } from 'next/navigation';
import { Container, Row, Col, Badge, Button } from 'react-bootstrap';
import { ArrowLeft, CalendarEvent, EmojiFrown } from 'react-bootstrap-icons';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface ContentItem {
  id: number;
  image: string;
  title: string;
  publishedAt: string;
  paragraphs: string[];
}

const CONTENT_ITEMS: ContentItem[] = [
  {
    id: 1,
    image: 'https://dkstatics-public.digikala.com/digikala-content-x-post-media/91c65b6c948ea547921a93ef7391894287ae34d6_1766333864.jpg?x-oss-process=image/resize,m_fill,h_600,w_1000',
    title: 'یکی از عجیب‌ترین خوش‌بو‌کننده‌های بازار را بشناسید',
    publishedAt: '۱۴۰۴/۰۴/۱۲',
    paragraphs: [
      'در میان انبوه خوش‌بوکننده‌های خانگی موجود در بازار، مدل‌هایی پیدا می‌شوند که با طراحی غیرمعمول و رایحه‌ای متفاوت، توجه بسیاری از خریداران را به خود جلب کرده‌اند. این محصولات معمولاً ترکیبی از فناوری پخش رایحه و طراحی دکوراتیو هستند که می‌توانند فضای خانه یا محل کار را به‌طور کامل متحول کنند.',
      'یکی از ویژگی‌های جالب این دسته از محصولات، امکان تنظیم شدت رایحه و زمان‌بندی پخش هوشمند آن‌هاست. برخی مدل‌ها حتی از طریق اپلیکیشن موبایل قابل کنترل هستند و کاربر می‌تواند از راه دور رایحه دلخواه خود را در محیط پخش کند.',
      'کارشناسان کوانتوم شاپ توصیه می‌کنند پیش از خرید هر خوش‌بوکننده، به ظرفیت مخزن، مدت‌زمان کارکرد با یک بار پرشدن و سازگاری آن با فضای مورد نظر توجه ویژه‌ای داشته باشید تا بهترین تجربه را از استفاده آن به دست آورید.',
    ],
  },
  {
    id: 2,
    image: 'https://dkstatics-public.digikala.com/digikala-content-x-post-media/1d9e7bd16189fd339f22a056dd61e0d30e8bf9ae_1768470540.jpg?x-oss-process=image/resize,m_fill,h_600,w_1000',
    title: 'ابروهایتان را به‌طور طبیعی حالت دهید',
    publishedAt: '۱۴۰۴/۰۴/۱۸',
    paragraphs: [
      'حالت‌دهی طبیعی ابرو یکی از موضوعاتی است که این روزها توجه زیادی را به خود جلب کرده است. برخلاف روش‌های قدیمی که نیاز به اصلاح شدید یا استفاده از محصولات سنگین داشتند، تکنیک‌های جدید بر حفظ فرم طبیعی ابرو تمرکز دارند.',
      'استفاده از ژل‌های شفاف‌ابرو و برس‌های مخصوص، به شما این امکان را می‌دهد که بدون نیاز به آرایش پیچیده، ابروهایی مرتب و طبیعی داشته باشید. این محصولات معمولاً سبک هستند و احساس سنگینی روی پوست ایجاد نمی‌کنند.',
      'در انتخاب محصول مناسب برای حالت‌دهی ابرو، توجه به نوع پوست و رنگ طبیعی موهای ابرو اهمیت زیادی دارد. مشاوره با متخصصان زیبایی می‌تواند در انتخاب بهترین گزینه کمک بزرگی باشد.',
    ],
  },
  {
    id: 3,
    image: 'https://dkstatics-public.digikala.com/digikala-content-x-post-media/ac71f16505fff48b7971735d51cea6da06768cc7_1767415636.jpg?x-oss-process=image/resize,m_fill,h_600,w_1000',
    title: 'آموزش ساخت نیمکت چوب و سیم‌پیچ',
    publishedAt: '۱۴۰۴/۰۳/۲۵',
    paragraphs: [
      'ساخت وسایل دکوراتیو با ترکیب چوب و سیم‌پیچ فلزی یکی از سرگرمی‌های محبوب در میان علاقه‌مندان به کارهای دستی است. این نوع نیمکت‌ها معمولاً ساختاری ساده اما بادوام دارند و می‌توانند جلوه‌ای متفاوت به فضای خانه یا حیاط بدهند.',
      'برای ساخت این نوع نیمکت، معمولاً از چوب‌های طبیعی مقاوم در برابر رطوبت و سیم‌پیچ‌های فلزی رنگ‌شده استفاده می‌شود. رعایت نکات ایمنی در برش و پرداخت چوب از اهمیت بالایی برخوردار است.',
      'این پروژه برای افرادی که به دنبال یک فعالیت خلاقانه در اوقات فراغت هستند، گزینه‌ای مناسب به شمار می‌رود و نیازی به ابزار پیچیده یا تخصص حرفه‌ای ندارد.',
    ],
  },
  {
    id: 4,
    image: 'https://dkstatics-public.digikala.com/digikala-content-x-post-media/2c27be8081d0883b7b55b6fe3e3b58a459b5badd_1769551937.jpg?x-oss-process=image/resize,m_fill,h_600,w_1000',
    title: 'تجهیزاتی که در هر موقعیتی به کمکتان می‌آیند',
    publishedAt: '۱۴۰۴/۰۵/۰۲',
    paragraphs: [
      'داشتن تجهیزات کمکی و ایمنی مناسب می‌تواند در موقعیت‌های غیرمنتظره تفاوت زیادی ایجاد کند. از کیف‌های امداد اولیه گرفته تا ابزارهای چندکاره، این محصولات برای استفاده در سفر، کوهنوردی یا حتی مواقع اضطراری در خانه طراحی شده‌اند.',
      'یکی از مزیت‌های این نوع تجهیزات، طراحی جمع‌وجور و قابل‌حمل بودن آن‌هاست که امکان نگهداری در کیف، خودرو یا کوله‌پشتی را فراهم می‌کند.',
      'کارشناسان توصیه می‌کنند همیشه یک ست پایه از این تجهیزات را در دسترس داشته باشید، چرا که در بسیاری از موقعیت‌های اضطراری، دسترسی سریع به ابزار مناسب اهمیت زیادی دارد.',
    ],
  },
  {
    id: 5,
    image: 'https://dkstatics-public.digikala.com/digikala-content-x-post-media/99badfcebf995e41d04f08a98d9220c26b54b5df_1768204386.jpg?x-oss-process=image/resize,m_fill,h_600,w_1000',
    title: 'معرفی جامته‌ای ۷۵ سوراخ برای علاقه‌مندان به ابزار',
    publishedAt: '۱۴۰۴/۰۴/۳۰',
    paragraphs: [
      'برای افرادی که به‌طور مرتب با ابزارهای برقی کار می‌کنند، داشتن یک سازمان‌دهنده مناسب برای مته‌ها و سرپیچ‌ها می‌تواند کیفیت کار را به‌طور محسوسی افزایش دهد. جامته‌ای‌های چندسوراخه دقیقاً برای همین منظور طراحی شده‌اند.',
      'این محصولات معمولاً از جنس پلاستیک مقاوم یا فلز ساخته می‌شوند و امکان دسته‌بندی مته‌ها بر اساس سایز را فراهم می‌کنند، که این موضوع در پروژه‌های حرفه‌ای بسیار کاربردی است.',
      'انتخاب یک جامته‌ای با ظرفیت مناسب، به شما کمک می‌کند فضای کارگاه یا جعبه‌ابزار خود را منظم‌تر نگه دارید و در زمان کار، مته مورد نیاز را سریع‌تر پیدا کنید.',
    ],
  },
  {
    id: 6,
    image: 'https://dkstatics-public.digikala.com/digikala-content-x-post-media/9de85f42787e21d1a37e373e4e49a585bc628524_1768469771.jpg?x-oss-process=image/resize,m_fill,h_600,w_1000',
    title: 'کانسیلری با پیگمنت بالا برای پوشش کامل',
    publishedAt: '۱۴۰۴/۰۵/۰۵',
    paragraphs: [
      'کانسیلرهای با پیگمنت بالا یکی از پرکاربردترین محصولات آرایشی هستند که برای پوشاندن دور چشم، جوش‌ها و لکه‌های پوستی استفاده می‌شوند. این محصولات با یک لایه نازک، پوششی یکدست و طبیعی ایجاد می‌کنند.',
      'فرمولاسیون این نوع کانسیلرها معمولاً به‌گونه‌ای طراحی شده که دوام بالایی داشته باشد و در طول روز دچار جمع‌شدگی یا تغییر رنگ نشود.',
      'برای بهترین نتیجه، توصیه می‌شود کانسیلر را متناسب با رنگ پوست انتخاب کرده و پیش از اعمال آرایش نهایی، به‌خوبی با پن یا اسفنج مخصوص بلند شود.',
    ],
  },
  {
    id: 7,
    image: 'https://dkstatics-public.digikala.com/digikala-content-x-post-media/c89660d790d683ff92e7a3aa4e7958d095107172_1767521278.jpg?x-oss-process=image/resize,m_fill,h_600,w_1000',
    title: 'ساخت جامدادی خلاقانه با ابزار ساده',
    publishedAt: '۱۴۰۴/۰۴/۰۸',
    paragraphs: [
      'ساخت وسایل کاربردی مانند جامدادی با استفاده از مواد بازیافتی و ابزار ساده، یکی از فعالیت‌های خلاقانه و مقرون‌به‌صرفه است که هم برای بزرگسالان و هم کودکان جذاب است.',
      'با استفاده از مقوا، پارچه یا حتی بطری‌های پلاستیکی می‌توان جامدادی‌هایی زیبا و کاربردی ساخت که علاوه بر کاهش زباله، فضایی شخصی‌سازی‌شده برای نگهداری وسایل تحریر فراهم می‌کند.',
      'این نوع پروژه‌ها می‌توانند به‌عنوان یک فعالیت آموزشی و سرگرم‌کننده در کنار کودکان نیز انجام شوند و به تقویت خلاقیت آن‌ها کمک کنند.',
    ],
  },
  {
    id: 8,
    image: 'https://dkstatics-public.digikala.com/digikala-content-x-post-media/f3dcdea13f34c57ed1bf6e911332e7582098c9a5_1767707615.jpg?x-oss-process=image/resize,m_fill,h_600,w_1000',
    title: 'بررسی سه‌پایه Puluz PU3096 برای عکاسان',
    publishedAt: '۱۴۰۴/۰۵/۱۰',
    paragraphs: [
      'سه‌پایه‌های عکاسی از جمله تجهیزات ضروری برای هر عکاس، چه حرفه‌ای و چه آماتور، به شمار می‌روند. مدل‌های سبک و قابل‌حمل مانند Puluz PU3096 به دلیل طراحی جمع‌وجور، گزینه‌ای مناسب برای سفر و عکاسی خیابانی هستند.',
      'این سه‌پایه‌ها معمولاً از آلومینیوم یا فایبر کربن ساخته می‌شوند تا وزن کمی داشته باشند و در عین حال پایداری کافی برای نگهداری دوربین و موبایل را فراهم کنند.',
      'قابلیت تنظیم ارتفاع، زاویه‌های چرخشی متعدد و سازگاری با انواع دوربین‌ها و گوشی‌های هوشمند، از مهم‌ترین مزیت‌های این دسته از سه‌پایه‌ها به شمار می‌رود.',
    ],
  },
];

export default function ContentPage() {
  const params = useParams();
  const rawId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const numericId = Number(rawId);
  const contentItem = CONTENT_ITEMS.find((item) => item.id === numericId);

  return (
    <div>
      <Header />

      <Container className="py-5">
        {contentItem ? (
          <Row className="justify-content-center">
            <Col lg={9}>
              <div className="position-relative rounded-4 overflow-hidden mb-4 shadow-sm" style={{ height: '360px' }}>
                <Image
                  src={contentItem.image}
                  alt={contentItem.title}
                  fill
                  sizes="(max-width: 992px) 100vw, 900px"
                  style={{ objectFit: 'cover' }}
                  priority
                />
              </div>

              <Badge bg="light" text="dark" className="mb-3 px-3 py-2">مجله کوانتوم شاپ</Badge>
              <h1 className="h3 fw-bold mb-2">{contentItem.title}</h1>
              <div className="d-flex align-items-center gap-2 text-muted small mb-4">
                <CalendarEvent size={16} />
                <span>تاریخ انتشار: {contentItem.publishedAt}</span>
              </div>

              {contentItem.paragraphs.map((paragraph, index) => (
                <p key={index} className="text-muted mb-3" style={{ lineHeight: 2 }}>
                  {paragraph}
                </p>
              ))}

              <Link href="/" className="d-inline-flex align-items-center gap-2 text-decoration-none mt-3" style={{ color: '#6a1b9a' }}>
                <ArrowLeft />
                بازگشت به صفحه اصلی
              </Link>
            </Col>
          </Row>
        ) : (
          <Row className="justify-content-center">
            <Col lg={6} className="text-center py-5">
              <EmojiFrown size={64} className="text-muted mb-4" />
              <h2 className="h4 fw-bold mb-3">محتوای مورد نظر پیدا نشد</h2>
              <p className="text-muted mb-4">
                متأسفانه محتوایی با این مشخصات در دسترس نیست. ممکن است لینک اشتباه باشد یا محتوا حذف شده باشد.
              </p>
              <Link href="/">
                <Button
                  className="fw-bold border-0 px-4"
                  style={{ background: 'linear-gradient(135deg, #6a1b9a 0%, #9c27b0 100%)' }}
                >
                  بازگشت به صفحه اصلی
                </Button>
              </Link>
            </Col>
          </Row>
        )}
      </Container>

      <Footer />
    </div>
  );
}
