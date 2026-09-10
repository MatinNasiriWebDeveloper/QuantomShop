'use client';

import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import Header from '@/components/Header';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { STONES } from '@/lib/mock-data';

export default function StonesPage() {
  const stones = STONES;

  return (
    <div>
      <Header />
      
      <Container className="py-5">
        <h1 className="text-center mb-5">سنگ‌های ساختمانی و تزئینی</h1>
        
        {stones.length === 0 ? (
          <div className="text-center py-5">
            <h4 className="text-muted">هیچ سنگی یافت نشد</h4>
          </div>
        ) : (
          <Row>
            {stones.map((stone: any) => (
              <Col key={stone.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                <Card className="h-100 shadow-sm">
                  <Link href={`/stones/${stone.id}`} className="text-decoration-none text-dark">
                    <div className="position-relative" style={{ height: '200px' }}>
                      <Image
                        src={stone.imageUrl || '/images/placeholder.jpg'}
                        alt={stone.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="rounded-top"
                      />
                    </div>
                  </Link>
                  <Card.Body>
                    <Card.Title>{stone.name}</Card.Title>
                    <Card.Text className="text-muted">
                      دسته: {stone.category} | کشور: {stone.origin}
                    </Card.Text>
                    <Card.Text className="small text-muted">
                      {stone.description?.substring(0, 50)}...
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="h5 text-primary">{stone.price.toLocaleString()} تومان</span>
                      <Link href={`/stones/${stone.id}`}>
                        <Button variant="primary" size="sm">مشاهده</Button>
                      </Link>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
      
      <Footer />
    </div>
  );
}