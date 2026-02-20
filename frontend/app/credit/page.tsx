'use client';

import { Container } from 'react-bootstrap';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CreditPage() {
  return (
    <div>
      <Header />
      <Container className="py-5">
        <h1>خرید اعتباری</h1>
        <p>صفحه خرید اعتباری کوانتوم</p>
      </Container>
      <Footer />
    </div>
  );
}