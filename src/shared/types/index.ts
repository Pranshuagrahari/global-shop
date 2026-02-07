// User Roles
export type UserRole = 'admin' | 'seller' | 'user';

// User Interface
export interface IUser {
  uid: string;
  email: string | null;
  role: UserRole;
  displayName?: string | null;
  photoURL?: string | null;
  createdAt: number;
}

// Seller Profile Interface
export interface ISellerProfile {
  uid: string; // Same as User UID
  businessName: string;
  businessAddress?: string;
  razorpayAccountId?: string;
  isVerified: boolean;
  status: 'pending' | 'active' | 'suspended';
  createdAt: number;
}

// Product Interface
export interface IProduct {
  id: string;
  sellerId: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  description: string;
  imageUrl: string;
  createdAt: number; // Timestamp or number
  updatedAt?: number;
  sku?: string;
  qrUrl?: string;
  variantId?: string;
}

export interface IBatchUploadStats {
  total: number;
  success: number;
  failed: number;
  errors: { row: number; error: string; data: any }[];
}

// Cart Item & Order Item
export interface ICartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  sellerId: string;
  imageUrl?: string;
}

export interface IOrderItem extends ICartItem {
  // Can add snapshot specific details here if needed
}

// Order Interface
export interface IOrder {
  id: string;
  customerId: string;
  customerName?: string;
  sellerId: string;
  items: IOrderItem[];
  totalAmount: number;
  platformFee: number;
  sellerAmount: number;
  status: 'created' | 'paid' | 'failed' | 'delivered';
  paymentId?: string;
  razorpayOrderId?: string;
  createdAt: number;
  updatedAt: number;
}

// Transaction Interface
export interface ITransaction {
  id: string;
  orderId: string;
  sellerId: string;
  amount: number;
  type: 'credit' | 'debit';
  status: 'pending' | 'success' | 'failed';
  timestamp: number;
}

// QR Payload Interface
export interface IQRPayload {
  sellerId?: string; // For Static Shop QR
  orderId?: string;  // For Dynamic Order QR
  amount?: number;
  type: 'static' | 'dynamic';
}
