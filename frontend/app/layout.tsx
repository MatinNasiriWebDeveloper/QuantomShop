import 'bootstrap/dist/css/bootstrap.min.css';
import ToastProvider from '@/components/ToastProvider';
import ApolloProviderWrapper from '../components/ApolloProviderWrapper';
import { CartProvider } from './context/CartContext';
import './globals.css';

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
    <html lang="fa" dir="rtl">
      <body>
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