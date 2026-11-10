export type Category = 'men' | 'women' | 'kids';
export type SubCategory = 'sneakers' | 'formal' | 'casual' | 'sandals' | 'boots' | 'sports';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: Category;
  subCategory: SubCategory;
  price: number;
  salePrice?: number;
  images: string[];
  sizes: string[];
  colors: ProductColor[];
  rating: number;
  reviewCount: number;
  stock: number;
  isNew: boolean;
  isFeatured: boolean;
  description: string;
  material: string;
  sku: string;
  tags: string[];
}

export interface CartItem {
  product: Product;
  size: string;
  color: ProductColor;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  email: string;
  phone: string;
  date: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  paymentMethod: 'cod' | 'online';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  items: { product: string; size: string; color: string; qty: number; price: number }[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  address: string;
  city: string;
  postalCode: string;
}

export type Page =
  | 'home'
  | 'plp-men'
  | 'plp-women'
  | 'plp-kids'
  | 'plp-new'
  | 'plp-sale'
  | 'pdp'
  | 'cart'
  | 'checkout'
  | 'order-confirm'
  | 'track-order'
  | 'account'
  | 'admin-dashboard'
  | 'admin-products'
  | 'admin-add-product'
  | 'admin-orders'
  | 'admin-inventory'
  | 'admin-promotions'
  | 'admin-subscribers'
  | 'admin-customers'
  | 'admin-analytics';
