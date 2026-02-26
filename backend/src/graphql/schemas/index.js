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
    description: String
    imageUrl: String
    parentId: ID
    order: Int!
    isActive: Boolean!
    productCount: Int
    children: [Category!]
  }

  type CategoryImage {
    id: ID!
    name: String!
    imageUrl: String!
    link: String!
    order: Int!
    active: Boolean!
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

  type CategoryItem {
    id: ID!
    name: String!
    imageUrl: String!
    link: String!
  }

  type CategorySection {
    id: ID!
    title: String!
    viewAllLink: String!
    icon: String!
    categories: [CategoryItem!]!
  }

  type FAQ {
    id: ID!
    question: String!
    answer: String!
    category: String
    order: Int
    isActive: Boolean!
    createdAt: String!
  }

  type ChatMessage {
    id: ID!
    userId: ID!
    message: String!
    isBot: Boolean!
    rating: Int
    createdAt: String!
  }

  type ChatMessageResponse {
    id: ID!
    user_message: String!
    bot_response: String!
    created_at: String!
  }

  type ChatResponse {
    answer: String!
    category: String
    suggestions: [String!]
  }

  type ChatHistory {
    messages: [ChatMessage!]!
    totalCount: Int!
  }

  type BotTraining {
    id: ID!
    question: String!
    answer: String!
    category: String!
    usageCount: Int!
    createdAt: String!
  }

  type BotStats {
    totalConversations: Int!
    totalMessages: Int!
    popularQuestions: [PopularQuestion!]!
    satisfactionRate: Float!
    intentStats: [IntentStat!]!
    dailyStats: [DailyStat!]!
  }

  type PopularQuestion {
    question: String!
    count: Int!
    category: String!
  }

  type IntentStat {
    intent: String!
    count: Int!
  }

  type DailyStat {
    date: String!
    count: Int!
  }

  type UnansweredQuestion {
    id: ID!
    question: String!
    askedAt: String!
    userId: ID
    userName: String
  }

  type BotQuickReply {
    id: ID!
    title: String!
    keywords: [String!]!
    response: String!
    category: String!
    order: Int!
    isActive: Boolean!
  }

  type BotConversation {
    id: ID!
    userId: ID!
    startTime: String!
    endTime: String
    messageCount: Int!
    resolved: Boolean!
  }

  type BotFeedback {
    id: ID!
    messageId: ID!
    userId: ID!
    rating: Int!
    comment: String
    createdAt: String!
  }

  input TrainBatchInput {
    question: String!
    answer: String!
    category: String!
  }

  input QuickReplyInput {
    title: String!
    keywords: [String!]!
    response: String!
    category: String!
    order: Int
    isActive: Boolean
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
    description: String
    imageUrl: String
    parentId: ID
    order: Int
    isActive: Boolean
  }

  input CategoryImageInput {
    name: String!
    imageUrl: String!
    link: String!
    order: Int
    active: Boolean
  }

  input FAQInput {
    question: String!
    answer: String!
    category: String
    order: Int
    isActive: Boolean
  }

  input ChatMessageInput {
    userId: ID!
    message: String!
  }

  type Query {
    products: [Product!]!
    product(id: ID!): Product
    productsByCategory(category: String!): [Product!]!
    searchProducts(keyword: String!): [Product!]!
    discountedProducts: [Product!]!
    bestSellers(limit: Int): [Product!]!
    me: User
    user(id: ID!): User
    users: [User!]!
    orders(userId: ID!): [Order!]!
    order(id: ID!): Order
    allOrders: [Order!]!
    getSetting(key: String!): Setting
    getAllSettings: [Setting!]!
    stones: [Stone!]!
    stone(id: ID!): Stone
    stonesByCategory(category: String!): [Stone!]!
    categories: [Category!]!
    categoryImages: [CategoryImage!]!
    activeCategoryImages: [CategoryImage!]!
    categorySections: [CategorySection!]!
    bestDiscounts(limit: Int): [Discount!]!
    newestProducts(limit: Int): [Product!]!
    storeInfo: StoreInfo!
    getFAQs(category: String): [FAQ!]!
    searchFAQ(question: String!): [FAQ!]!
    getChatHistory(userId: ID!, limit: Int, offset: Int): ChatHistory!
    getUnansweredQuestions: [UnansweredQuestion!]!
    getBotTrainingData(category: String): [BotTraining!]!
    getBotStats: BotStats!
    searchInChatHistory(userId: ID!, keyword: String!): [ChatMessage!]!
    getQuickReplies(category: String): [BotQuickReply!]!
    getActiveConversations: [BotConversation!]!
    getBotFeedbackStats(startDate: String, endDate: String): [BotFeedback!]!
  }

  type Mutation {
    createProduct(input: ProductInput!): Product!
    updateProduct(id: ID!, input: ProductInput!): Product!
    deleteProduct(id: ID!): Boolean!
    updateProductStock(id: ID!, quantity: Int!): Product!
    registerUser(input: RegisterInput!): AuthPayload!
    loginUser(input: LoginInput!): AuthPayload!
    updateUser(id: ID!, input: UpdateUserInput!): User!
    deleteUser(id: ID!): Boolean!
    createOrder(userId: ID!, products: [OrderItemInput!]!, shippingAddress: String!, paymentMethod: String): Order!
    updateOrderStatus(id: ID!, status: String!): Order!
    cancelOrder(id: ID!): Order!
    deleteOrder(id: ID!): Boolean!
    updateSetting(key: String!, value: String!, type: String!): Setting!
    uploadAvatar(file: Upload!): File!
    forgotPassword(phone: String!): OtpResponse!
    verifyOtp(phone: String!, code: String!): VerifyOtpResponse!
    resetPassword(phone: String!, token: String!, newPassword: String!): AuthPayload!
    createStone(input: StoneInput!): Stone!
    updateStone(id: ID!, input: StoneInput!): Stone!
    deleteStone(id: ID!): Boolean!
    createCategory(input: CategoryInput!): Category!
    updateCategory(id: ID!, input: CategoryInput!): Category!
    deleteCategory(id: ID!): Boolean!
    createCategoryImage(input: CategoryImageInput!): CategoryImage!
    updateCategoryImage(id: ID!, input: CategoryImageInput!): CategoryImage!
    deleteCategoryImage(id: ID!): Boolean!
    createFAQ(input: FAQInput!): FAQ!
    updateFAQ(id: ID!, input: FAQInput!): FAQ!
    deleteFAQ(id: ID!): Boolean!
    saveMessage(user_message: String!, bot_response: String!): ChatMessageResponse!
    sendChatMessage(userId: ID!, message: String!): ChatResponse!
    clearChatHistory(userId: ID!): Boolean!
    trainBot(question: String!, answer: String!, category: String!): BotTraining!
    trainBotBatch(inputs: [TrainBatchInput!]!): Int!
    deleteTrainingData(id: ID!): Boolean!
    markQuestionAsAnswered(unansweredId: ID!, answer: String!): BotTraining!
    rateBotResponse(messageId: ID!, rating: Int!, comment: String): Boolean!
    createQuickReply(input: QuickReplyInput!): BotQuickReply!
    updateQuickReply(id: ID!, input: QuickReplyInput!): BotQuickReply!
    deleteQuickReply(id: ID!): Boolean!
    endConversation(userId: ID!): BotConversation!
    exportChatHistory(userId: ID!): String!
    importTrainingData(file: Upload!): Int!
  }

  type Subscription {
    newMessage(userId: ID!): ChatMessage!
    botTyping(userId: ID!): Boolean!
    conversationStatus(userId: ID!): String!
  }
`;

module.exports = typeDefs;