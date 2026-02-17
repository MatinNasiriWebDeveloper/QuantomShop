'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import Header from '@/components/Header';
import { showToast } from '@/components/ToastProvider';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      price
      finalPrice
      description
      imageUrl
      category
      brand
      discount
      stock
    }
  }
`;

export default function ProductsPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { loading, error, data } = useQuery(GET_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('همه');

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleAddToCart = async (product: any) => {
    if (!isLoggedIn) {
      showToast.warning('برای افزودن به سبد خرید ابتدا وارد شوید');
      setTimeout(() => router.push('/login'), 1500);
      return;
    }

    const loadingToast = showToast.loading('در حال افزودن به سبد خرید...');

    try {
      // API افزودن به سبد خرید
      await new Promise(resolve => setTimeout(resolve, 1000)); // شبیه‌سازی
      
      toast.dismiss(loadingToast);
      showToast.success(`"${product.name}" به سبد خرید اضافه شد`);
    } catch (error) {
      toast.dismiss(loadingToast);
      showToast.error('خطا در افزودن به سبد خرید');
    }
  };

  const handleAddToWishlist = async (product: any) => {
    if (!isLoggedIn) {
      showToast.warning('برای افزودن به علاقه‌مندی‌ها ابتدا وارد شوید');
      setTimeout(() => router.push('/login'), 1500);
      return;
    }

    try {
      // API افزودن به علاقه‌مندی‌ها
      await new Promise(resolve => setTimeout(resolve, 500)); // شبیه‌سازی
      showToast.success(`"${product.name}" به علاقه‌مندی‌ها اضافه شد`);
    } catch (error) {
      showToast.error('خطا در افزودن به علاقه‌مندی‌ها');
    }
  };

  if (loading) return (
    <div>
      <Header />
      <Container className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">در حال بارگذاری...</span>
        </div>
        <p className="mt-2">در حال بارگذاری محصولات...</p>
      </Container>
    </div>
  );

  if (error) return (
    <div>
      <Header />
      <Container className="text-center py-5">
        <div className="alert alert-danger">
          خطا در بارگذاری محصولات: {error.message}
        </div>
      </Container>
    </div>
  );

  const products = data?.products || [];
  
  const categories = ['همه', ...new Set(products.map((p: any) => p.category))];
  
  const filteredProducts = products.filter((product: any) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'همه' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <Header />
      
      <Container className="py-4">
        <h1 className="text-center mb-4">محصولات فروشگاه</h1>
        
        <Row className="mb-4">
          <Col md={6} className="mx-auto">
            <Form.Control
              type="text"
              placeholder="جستجو در محصولات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="py-2"
            />
          </Col>
        </Row>
        
        <Row className="mb-4">
          <Col className="d-flex justify-content-center gap-2 flex-wrap">
            {categories.map((category: string) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'primary' : 'outline-primary'}
                onClick={() => setSelectedCategory(category)}
                style={{ 
                  backgroundColor: selectedCategory === category ? '#6a1b9a' : 'transparent',
                  borderColor: '#6a1b9a',
                  color: selectedCategory === category ? 'white' : '#6a1b9a'
                }}
              >
                {category}
              </Button>
            ))}
          </Col>
        </Row>
        
        {filteredProducts.length === 0 ? (
          <div className="text-center py-5">
            <h4>محصولی یافت نشد</h4>
            <Button 
              variant="link" 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('همه');
              }}
              style={{ color: '#6a1b9a' }}
            >
              نمایش همه محصولات
            </Button>
          </div>
        ) : (
          <Row>
            {filteredProducts.map((product: any) => (
              <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                <Card className="h-100 shadow-sm">
                  <Link href={`/product/${product.id}`}>
                    <div className="position-relative" style={{ height: '200px' }}>
                      <Image
                        src={product.imageUrl || '/images/placeholder.jpg'}
                        alt={product.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="rounded-top"
                      />
                      {product.discount > 0 && (
                        <div className="position-absolute top-0 end-0 bg-danger text-white px-2 py-1 m-2 rounded">
                          {product.discount}% تخفیف
                        </div>
                      )}
                    </div>
                  </Link>
                  
                  <Card.Body>
                    <Link href={`/product/${product.id}`} className="text-decoration-none text-dark">
                      <Card.Title className="h6">{product.name}</Card.Title>
                      <Card.Text className="small text-muted">
                        {product.brand} - {product.category}
                      </Card.Text>
                    </Link>
                    
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div>
                        {product.discount > 0 ? (
                          <>
                            <span className="text-muted text-decoration-line-through small me-2">
                              {product.price.toLocaleString()}
                            </span>
                            <span className="fw-bold text-primary">
                              {product.finalPrice.toLocaleString()} تومان
                            </span>
                          </>
                        ) : (
                          <span className="fw-bold text-primary">
                            {product.price.toLocaleString()} تومان
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="d-flex gap-2 mt-3">
                      <Button 
                        variant="primary" 
                        size="sm"
                        className="flex-grow-1"
                        style={{ backgroundColor: '#6a1b9a', borderColor: '#6a1b9a' }}
                        onClick={() => handleAddToCart(product)}
                      >
                        افزودن به سبد
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleAddToWishlist(product)}
                      >
                        ❤️
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
}