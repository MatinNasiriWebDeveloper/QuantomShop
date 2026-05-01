'use client';

import { Card, Badge } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  price: number;
  finalPrice: number;
  description?: string;
  imageUrl?: string;
  category?: string;
  brand?: string;
  originalPrice?: number;
  discount?: number;
}

interface ProductCardProps {
  product: Product;
  showBadge?: boolean;
  badgeText?: string;
  badgeColor?: string;
  priceColor?: string;
}

export default function ProductCard({ 
  product, 
  showBadge = false, 
  badgeText = 'ویژه',
  badgeColor = 'primary',
  priceColor = 'text-dark'
}: ProductCardProps) {
  
  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US') + ' تومان';
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : product.discount || 0;



  return (
    <Link href={`/product/${product.id}`} className="text-decoration-none">
      <Card className="h-400 border-0" style={{ cursor: 'pointer' }}>
        <div className="position-relative" style={{ height: '200px' , width: '180px' }}>
          <Image
            src={product.imageUrl || '/images/placeholder.jpg'}
            alt={product.name}
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-top"
          />
          {showBadge && (
            <Badge 
              bg={badgeColor}
              className="position-absolute top-0 end-0 m-2"
              style={{ zIndex: 5 }}
            >
              {badgeText}
            </Badge>
          )}
        </div>
        
        <Card.Body className="text-center">
          <Card.Title className="h6 mb-2 fw-bold">{product.name}</Card.Title>
          
          {product.brand && (
            <Card.Text className="small text-muted mb-2">
              {product.brand}
            </Card.Text>
          )}
          
          <div className="mt-2">
            {discountPercentage > 0 ? (
              <>
                <span className="text-muted text-decoration-line-through small me-2 en-number">
                  {formatPrice(product.originalPrice || product.price)}
                </span>
                <span className={`fw-bold ${priceColor} en-number`}>
                  {formatPrice(product.finalPrice || product.price)}
                </span>
                <Badge bg="danger" className="me-2">
                  {discountPercentage}%
                </Badge>
              </>
            ) : (
              <span className={`fw-bold ${priceColor} en-number`}>
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </Card.Body>
      </Card>
    </Link>
  );
}