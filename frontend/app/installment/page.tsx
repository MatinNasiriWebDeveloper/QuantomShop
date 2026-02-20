'use client';

import { Container } from 'react-bootstrap';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function InstallmentPage() {
  return (
    <div>
      <Header />
      <Container className="py-5">
        <h1>خرید اقساطی</h1>
        <p>صفحه خرید اقساطی کوانتوم</p>
      </Container>
      <Footer />
    </div>
  );
}