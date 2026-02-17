/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'dkstatics-public.digikala.com',  // دامنه دیجی‌کالا
      'localhost',                       // برای لوکال
      'via.placeholder.com',              // برای placeholder
      'example.com'                       // برای نمونه
    ],
    // یا اگر از نسخه جدید Next.js استفاده می‌کنی:
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'dkstatics-public.digikala.com',
    //     pathname: '/**',
    //   },
    // ],
  },
};

module.exports = nextConfig;