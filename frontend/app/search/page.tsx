'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Container, Row, Col, Card, Alert, Badge } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { PRODUCTS } from '@/lib/mock-data';

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchPageContent />
    </Suspense>
  );
}

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const normalizedQuery = query.trim().toLowerCase();

  const results = normalizedQuery
    ? PRODUCTS.filter((p) =>
        p.name.toLowerCase().includes(normalizedQuery) ||
        p.brand.toLowerCase().includes(normalizedQuery) ||
        p.category.toLowerCase().includes(normalizedQuery)
      )
    : [];

  return (
    <div>
      <Header />

      <Container className="py-5">
        <h2 className="mb-4">نتایج جستجو برای: "{query}"</h2>

        {results.length === 0 && (
          <Alert variant="info">
            هیچ محصولی با این مشخصات پیدا نشد.
          </Alert>
        )}

        {results.length > 0 && (
          <Row>
            {results.map((product) => (
              <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                <Link href={`/product/${product.id}`} className="text-decoration-none">
                  <Card className="h-100 product-card border-0 shadow-sm">
                    <div style={{ position: 'relative', height: '200px' }}>
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        style={{ objectFit: 'contain' }}
                        className="p-3"
                      />
                      {product.discount > 0 && (
                        <Badge
                          bg="danger"
                          className="position-absolute top-0 end-0 m-2"
                        >
                          {product.discount}% تخفیف
                        </Badge>
                      )}
                    </div>
                    <Card.Body>
                      <Card.Title className="h6 text-dark">{product.name}</Card.Title>
                      <Card.Text className="text-primary fw-bold">
                        {product.finalPrice.toLocaleString()} تومان
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      <Footer />
    </div>
  );
}