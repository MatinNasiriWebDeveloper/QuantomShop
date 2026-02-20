import 'bootstrap/dist/css/bootstrap.min.css';
import ToastProvider from '@/components/ToastProvider';
import ApolloProviderWrapper from '../components/ApolloProviderWrapper';
import { CartProvider } from './context/CartContext';
import { Vazirmatn } from 'next/font/google';
import './globals.css';

// پیکربندی فونت وزیرمتن
const vazirmatn = Vazirmatn({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '700', '800', '900'],
  variable: '--font-vazirmatn',
  display: 'swap',
  preload: true,
  fallback: ['Tahoma', 'Arial', 'sans-serif'],
});

export const metadata = {
  title: 'کوانتوم شاپ',
  description: 'فروشگاه اینترنتی کوانتوم شاپ',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable}`}>
      <body style={{ fontFamily: 'var(--font-vazirmatn)' }}>
        <ApolloProviderWrapper>
          <CartProvider>
            <ToastProvider />
            {children}
          </CartProvider>
        </ApolloProviderWrapper>
      </body>
    </html>
  );
}