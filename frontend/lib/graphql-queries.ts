import { gql } from '@apollo/client';

// ========== PRODUCT QUERIES ==========
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

export const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
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

export const GET_PRODUCTS_BY_CATEGORY = gql`
  query GetProductsByCategory($category: String!) {
    productsByCategory(category: $category) {
      id
      name
      price
      finalPrice
      imageUrl
      brand
    }
  }
`;

export const SEARCH_PRODUCTS = gql`
  query SearchProducts($keyword: String!) {
    searchProducts(keyword: $keyword) {
      id
      name
      price
      finalPrice
      imageUrl
      category
    }
  }
`;

export const GET_DISCOUNTED_PRODUCTS = gql`
  query GetDiscountedProducts {
    discountedProducts {
      id
      name
      price
      finalPrice
      imageUrl
      discount
    }
  }
`;

// ========== PRODUCT DETAILS QUERY ==========
export const GET_PRODUCT_DETAILS = gql`
  query GetProductDetails($id: ID!) {
    product(id: $id) {
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

// ========== STONE QUERIES ==========
export const GET_STONES = gql`
  query GetStones {
    stones {
      id
      name
      price
      imageUrl
      category
      origin
      description
      stock
      createdAt
    }
  }
`;

export const GET_STONE = gql`
  query GetStone($id: ID!) {
    stone(id: $id) {
      id
      name
      price
      imageUrl
      category
      origin
      description
      stock
    }
  }
`;

export const GET_STONES_BY_CATEGORY = gql`
  query GetStonesByCategory($category: String!) {
    stonesByCategory(category: $category) {
      id
      name
      price
      imageUrl
      category
      origin
    }
  }
`;

// ========== CATEGORY QUERIES ==========
export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
      slug
      productCount
    }
  }
`;

// ========== CATEGORY IMAGE QUERIES (اضافه شده) ==========
export const GET_CATEGORY_IMAGES = gql`
  query GetCategoryImages {
    categoryImages {
      id
      name
      imageUrl
      link
      order
      active
    }
  }
`;

export const GET_ACTIVE_CATEGORY_IMAGES = gql`
  query GetActiveCategoryImages {
    activeCategoryImages {
      id
      name
      imageUrl
      link
      order
    }
  }
`;

// ========== DISCOUNT QUERIES ==========
export const GET_BEST_DISCOUNTS = gql`
  query GetBestDiscounts($limit: Int) {
    bestDiscounts(limit: $limit) {
      title
      description
      discountPercent
      validUntil
      products {
        id
        name
        price
        finalPrice
        imageUrl
      }
    }
  }
`;

// ========== NEWEST PRODUCTS QUERIES ==========
export const GET_NEWEST_PRODUCTS = gql`
  query GetNewestProducts($limit: Int) {
    newestProducts(limit: $limit) {
      id
      name
      price
      finalPrice
      imageUrl
      createdAt
    }
  }
`;

// ========== STORE INFO QUERIES ==========
export const GET_STORE_INFO = gql`
  query GetStoreInfo {
    storeInfo {
      address
      phone
      email
      socialLinks {
        instagram
        telegram
        twitter
        linkedin
      }
    }
  }
`;

// ========== USER QUERIES ==========
export const GET_ME = gql`
  query GetMe {
    me {
      id
      name
      email
      phone
      role
      avatar
      createdAt
    }
  }
`;

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
      phone
      role
      avatar
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
      phone
      role
      avatar
    }
  }
`;

// ========== ORDER QUERIES ==========
export const GET_ORDERS = gql`
  query GetOrders($userId: ID!) {
    orders(userId: $userId) {
      id
      totalAmount
      status
      shippingAddress
      paymentMethod
      createdAt
      products {
        productId
        quantity
        price
      }
    }
  }
`;

export const GET_ORDER = gql`
  query GetOrder($id: ID!) {
    order(id: $id) {
      id
      userId
      totalAmount
      status
      shippingAddress
      paymentMethod
      createdAt
      products {
        productId
        quantity
        price
      }
    }
  }
`;

export const GET_ALL_ORDERS = gql`
  query GetAllOrders {
    allOrders {
      id
      userId
      totalAmount
      status
      createdAt
    }
  }
`;

// ========== SETTING QUERIES ==========
export const GET_SETTING = gql`
  query GetSetting($key: String!) {
    getSetting(key: $key) {
      id
      key
      value
      type
    }
  }
`;

export const GET_ALL_SETTINGS = gql`
  query GetAllSettings {
    getAllSettings {
      id
      key
      value
      type
    }
  }
`;

// ========== BEST SELLERS QUERY ==========
export const GET_BEST_SELLERS = gql`
  query GetBestSellers($limit: Int) {
    bestSellers(limit: $limit) {
      id
      name
      price
      finalPrice
      imageUrl
      discount
      brand
    }
  }
`;