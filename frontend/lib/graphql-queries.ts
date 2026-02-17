import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql`
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

export const GET_FEATURED_PRODUCTS = gql`
  query GetFeaturedProducts {
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

export const GET_DISCOUNTED_PRODUCTS = gql`
  query GetDiscountedProducts {
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
      originalPrice
      stock
    }
  }
`;