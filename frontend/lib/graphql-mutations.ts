import { gql } from '@apollo/client';

// ========== PRODUCT MUTATIONS ==========
export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: ProductInput!) {
    createProduct(input: $input) {
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

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $input: ProductInput!) {
    updateProduct(id: $id, input: $input) {
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

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`;

export const UPDATE_PRODUCT_STOCK = gql`
  mutation UpdateProductStock($id: ID!, $quantity: Int!) {
    updateProductStock(id: $id, quantity: $quantity) {
      id
      stock
    }
  }
`;

// ========== STONE MUTATIONS ==========
export const CREATE_STONE = gql`
  mutation CreateStone($input: StoneInput!) {
    createStone(input: $input) {
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

export const UPDATE_STONE = gql`
  mutation UpdateStone($id: ID!, $input: StoneInput!) {
    updateStone(id: $id, input: $input) {
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

export const DELETE_STONE = gql`
  mutation DeleteStone($id: ID!) {
    deleteStone(id: $id)
  }
`;

// ========== CATEGORY MUTATIONS ==========
export const CREATE_CATEGORY = gql`
  mutation CreateCategory($input: CategoryInput!) {
    createCategory(input: $input) {
      id
      name
      slug
    }
  }
`;

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($id: ID!, $input: CategoryInput!) {
    updateCategory(id: $id, input: $input) {
      id
      name
      slug
    }
  }
`;

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id)
  }
`;

// ========== USER MUTATIONS ==========
export const REGISTER_USER = gql`
  mutation RegisterUser($input: RegisterInput!) {
    registerUser(input: $input) {
      token
      user {
        id
        name
        email
        phone
        role
        avatar
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser($input: LoginInput!) {
    loginUser(input: $input) {
      token
      user {
        id
        name
        email
        phone
        role
        avatar
      }
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      name
      email
      phone
      avatar
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

// ========== ORDER MUTATIONS ==========
export const CREATE_ORDER = gql`
  mutation CreateOrder($userId: ID!, $products: [OrderItemInput!]!, $shippingAddress: String!, $paymentMethod: String) {
    createOrder(userId: $userId, products: $products, shippingAddress: $shippingAddress, paymentMethod: $paymentMethod) {
      id
      totalAmount
      status
      createdAt
    }
  }
`;

export const UPDATE_ORDER_STATUS = gql`
  mutation UpdateOrderStatus($id: ID!, $status: String!) {
    updateOrderStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

export const CANCEL_ORDER = gql`
  mutation CancelOrder($id: ID!) {
    cancelOrder(id: $id) {
      id
      status
    }
  }
`;

export const DELETE_ORDER = gql`
  mutation DeleteOrder($id: ID!) {
    deleteOrder(id: $id)
  }
`;

// ========== SETTING MUTATIONS ==========
export const UPDATE_SETTING = gql`
  mutation UpdateSetting($key: String!, $value: String!, $type: String!) {
    updateSetting(key: $key, value: $value, type: $type) {
      id
      key
      value
      type
    }
  }
`;

// ========== OTP MUTATIONS ==========
export const FORGOT_PASSWORD = gql`
  mutation ForgotPassword($phone: String!) {
    forgotPassword(phone: $phone) {
      success
      message
      expiresIn
    }
  }
`;

export const VERIFY_OTP = gql`
  mutation VerifyOtp($phone: String!, $code: String!) {
    verifyOtp(phone: $phone, code: $code) {
      success
      message
      token
    }
  }
`;

export const RESET_PASSWORD = gql`
  mutation ResetPassword($phone: String!, $token: String!, $newPassword: String!) {
    resetPassword(phone: $phone, token: $token, newPassword: $newPassword) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

// ========== UPLOAD MUTATIONS ==========
export const UPLOAD_AVATAR = gql`
  mutation UploadAvatar($file: Upload!) {
    uploadAvatar(file: $file) {
      url
      filename
      mimetype
    }
  }
`;

// ========== REVIEW MUTATIONS ==========
export const ADD_REVIEW = gql`
  mutation AddReview($input: ReviewInput!) {
    addReview(input: $input) {
      id
      rating
      comment
      createdAt
    }
  }
`;

export const LIKE_REVIEW = gql`
  mutation LikeReview($reviewId: ID!) {
    likeReview(reviewId: $reviewId) {
      id
      likes
    }
  }
`;

export const DISLIKE_REVIEW = gql`
  mutation DislikeReview($reviewId: ID!) {
    dislikeReview(reviewId: $reviewId) {
      id
      dislikes
    }
  }
`;