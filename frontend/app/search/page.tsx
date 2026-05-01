'use client';

import { useSearchParams } from 'next/navigation';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import Image from 'next/image';

// یک تابع ساختگی برای دریافت محصولات از API یا دیتابیس
const fetchSearchResults = async (query: string) => {
  // در اینجا باید به API واقعی خود درخواست بفرستید
  // این فقط یک نمونه است
  const response = await fetch(`/api/products/search?q=${query}`);
  if (!response.ok) {
    throw new Error('خطا در دریافت نتایج');
  }
  return response.json();
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query) {
      setLoading(true);
      fetchSearchResults(query)
        .then((data) => {
          setResults(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [query]);

  return (
    <Container className="py-5">
      <h2 className="mb-4">نتایج جستجو برای: "{query}"</h2>
      
      {loading && (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">در حال جستجو...</p>
        </div>
      )}

      {error && (
        <Alert variant="danger">
          {error}
        </Alert>
      )}

      {!loading && !error && results.length === 0 && (
        <Alert variant="info">
          هیچ محصولی با این مشخصات پیدا نشد.
        </Alert>
      )}

      {!loading && !error && results.length > 0 && (
        <Row>
          {results.map((product) => (
            <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Card className="h-100 product-card">
                <div style={{ position: 'relative', height: '200px' }}>
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    style={{ objectFit: 'contain' }}
                    className="p-3"
                  />
                </div>
                <Card.Body>
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text className="text-primary fw-bold">
                    {product.price.toLocaleString()} تومان
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}