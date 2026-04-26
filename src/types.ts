export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  status?: 'pending' | 'approved' | 'rejected';
  reply?: {
    comment: string;
    date: string;
    author: string;
    thankedBy?: string[]; // Danh sách email người dùng đã cảm ơn
  };
}

// Thay đổi từ union type cố định sang string để hỗ trợ thêm danh mục động từ Admin
export type Category = string;

export interface Fruit {
  id: string;
  name: string;
  category: Category;
  price: number;
  image: string;
  description: string;
  unit: string;
  color: string;
  reviews?: Review[];
  stock?: number;
  salePrice?: number;
  flashSaleExpiry?: string;
}

export interface Bundle {
  id: string;
  name: string;
  productIds: string[];
  price: number;
  originalPrice: number;
  image: string;
  description: string;
  unit: string;
  color: string;
  isBundle: boolean;
}

export type CartItem = Omit<Fruit, 'id' | 'stock' | 'reviews' | 'category'> &
  Partial<Bundle> & {
    id: string;
    quantity: number;
    category?: Category;
  };

export interface PointTransaction {
  id: string;
  amount: number; // Số điểm cộng (+) hoặc trừ (-)
  type: 'earn' | 'spend';
  description: string;
  date: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  address?: string;
  password?: string;
  wishlist?: string[]; // Lưu mảng ID của các sản phẩm yêu thích
  birthday?: string;
  gender?: string;
  points?: number;
  role?: 'user' | 'admin' | 'staff';
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image: string;
  author: string;
  category: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minOrder?: number;
  description: string;
  expiry: string;
}

export interface ShippingLog {
  status: string;
  location: string;
  time: string;
  desc: string;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  total: number;
  address: string;
  paymentMethod: string;
  status: string;
  items: CartItem[];
  created_at?: string;
  date?: string;
  isLocal?: boolean;
  carrier?: 'GHTK' | 'GHN';
  trackingNumber?: string;
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: 'create' | 'update' | 'delete' | 'list' | 'get' | 'write' | 'read';
  path: string | null;
  authInfo: {
    userId: string;
    email: string;
    emailVerified: boolean;
    isAnonymous: boolean;
    providerInfo: { providerId: string; displayName: string; email: string; }[];
  }
}
