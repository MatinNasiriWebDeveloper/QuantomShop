const { gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar Upload

  type File {
    filename: String!
    mimetype: String!
    url: String!
  }

  type Product {
    id: ID!
    name: String!
    price: Float!
    finalPrice: Float!
    description: String
    imageUrl: String
    category: String
    brand: String
    discount: Int
    originalPrice: Float
    stock: Int!
    createdAt: String!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    phone: String!
    role: String!
    avatar: String
    createdAt: String!
  }

  type Address {
    id: ID!
    street: String!
    city: String!
    state: String!
    zipCode: String!
    userId: ID!
  }

  type OrderItem {
    productId: ID!
    productName: String
    quantity: Int!
    price: Float!
  }

  type Order {
    id: ID!
    userId: ID!
    products: [OrderItem!]!
    totalAmount: Float!
    status: String!
    shippingAddress: String!
    paymentMethod: String
    createdAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Setting {
    id: ID!
    key: String!
    value: String!
    type: String!
  }

  type OtpResponse {
    success: Boolean!
    message: String!
    expiresIn: Int
  }

  type VerifyOtpResponse {
    success: Boolean!
    message: String!
    token: String
  }

  type Category {
    id: ID!
    name: String!
    slug: String!
    productCount: Int
  }

  type Discount {
    id: ID!
    title: String!
    description: String
    discountPercent: Int!
    validUntil: String
    products: [Product!]!
  }

  type StoreInfo {
    address: String!
    phone: String!
    email: String!
    socialLinks: SocialLinks!
  }

  type SocialLinks {
    instagram: String
    telegram: String
    twitter: String
    linkedin: String
  }

  type Stone {
    id: ID!
    name: String!
    price: Float!
    imageUrl: String
    category: String!
    origin: String!
    description: String
    stock: Int!
    createdAt: String!
  }

  input OrderItemInput {
    productId: ID!
    quantity: Int!
    price: Float!
  }

  input RegisterInput {
    name: String!
    email: String!
    password: String!
    phone: String!
    avatar: String
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input ProductInput {
    name: String!
    price: Float!
    description: String
    category: String
    imageUrl: String
    stock: Int!
    brand: String
    discount: Int
    originalPrice: Float
  }

  input UpdateUserInput {
    name: String
    email: String
    phone: String
    password: String
    avatar: String
  }

  input StoneInput {
    name: String!
    price: Float!
    imageUrl: String
    category: String!
    origin: String!
    description: String
    stock: Int!
  }

  input CategoryInput {
    name: String!
    slug: String!
  }

  type Query {
    # Product queries
    products: [Product!]!
    product(id: ID!): Product
    productsByCategory(category: String!): [Product!]!
    searchProducts(keyword: String!): [Product!]!
    discountedProducts: [Product!]!
    
    # User queries
    me: User
    user(id: ID!): User
    users: [User!]!
    
    # Order queries
    orders(userId: ID!): [Order!]!
    order(id: ID!): Order
    allOrders: [Order!]!
    
    # Setting queries
    getSetting(key: String!): Setting
    getAllSettings: [Setting!]!
    
    # Stone queries
    stones: [Stone!]!
    stone(id: ID!): Stone
    stonesByCategory(category: String!): [Stone!]!
    
    # Category queries
    categories: [Category!]!
    
    # Discount queries
    bestDiscounts(limit: Int): [Discount!]!
    
    # Newest products
    newestProducts(limit: Int): [Product!]!
    
    # Store info
    storeInfo: StoreInfo!
  }

  type Mutation {
    # Product mutations
    createProduct(input: ProductInput!): Product!
    updateProduct(id: ID!, input: ProductInput!): Product!
    deleteProduct(id: ID!): Boolean!
    updateProductStock(id: ID!, quantity: Int!): Product!
    
    # User mutations
    registerUser(input: RegisterInput!): AuthPayload!
    loginUser(input: LoginInput!): AuthPayload!
    updateUser(id: ID!, input: UpdateUserInput!): User!
    deleteUser(id: ID!): Boolean!
    
    # Order mutations
    createOrder(userId: ID!, products: [OrderItemInput!]!, shippingAddress: String!, paymentMethod: String): Order!
    updateOrderStatus(id: ID!, status: String!): Order!
    cancelOrder(id: ID!): Order!
    deleteOrder(id: ID!): Boolean!
    
    # Setting mutations
    updateSetting(key: String!, value: String!, type: String!): Setting!
    
    # Upload mutation
    uploadAvatar(file: Upload!): File!
    
    # OTP mutations
    forgotPassword(phone: String!): OtpResponse!
    verifyOtp(phone: String!, code: String!): VerifyOtpResponse!
    resetPassword(phone: String!, token: String!, newPassword: String!): AuthPayload!
    
    # Stone mutations
    createStone(input: StoneInput!): Stone!
    updateStone(id: ID!, input: StoneInput!): Stone!
    deleteStone(id: ID!): Boolean!
    
    # Category mutations
    createCategory(input: CategoryInput!): Category!
    updateCategory(id: ID!, input: CategoryInput!): Category!
    deleteCategory(id: ID!): Boolean!
  }
`;

module.exports = typeDefs;