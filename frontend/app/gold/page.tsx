'use client';

import { Container } from 'react-bootstrap';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function GoldPage() {
  return (
    <div>
      <Header />
      <Container className="py-5">
        <h1>Quantom Gold</h1>
        <p>صفحه طلای دیجیتال کوانتوم</p>
      </Container>
      <Footer />
    </div>
  );
}