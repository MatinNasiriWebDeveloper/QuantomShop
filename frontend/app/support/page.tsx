'use client';

import { Container } from 'react-bootstrap';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatBot from '@/components/ChatBot'

export default function SupportPage() {
  return (
    <div>
      <Header />
      <Container className="py-5">
        <h1>پشتیبانی</h1>
        <p>صفحه پشتیبانی و سوالات متداول</p>
      </Container>
      <ChatBot/>
      <Footer />
    </div>
  );
}