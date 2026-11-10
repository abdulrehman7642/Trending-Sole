import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { CartItem, Page, Product, ProductColor } from '../types';

interface AppContextType {
  refreshCatalog: () => Promise<void>;
  products: Product[];
  catalogLoading: boolean;
  catalogError: string | null;
  page: Page;
  pageParams: Record<string, string>;
  navigate: (page: Page, params?: Record<string, string>) => void;

  clearCart: () => void;
  cartItems: CartItem[];
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (product: Product, size: string, color: ProductColor, qty?: number) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateQty: (productId: string, size: string, color: string, qty: number) => void;
  cartTotal: number;
  cartCount: number;

  wishlist: string[];
  toggleWishlist: (productId: string) => void;

  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState<string | null>(null);

  const refreshCatalog = async () => {
    setCatalogLoading(true);
    try {
    const [{ data, error }, summary] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('product_rating_summary').select('product_id, average_rating, rating_count'),
    ]);
    if (error || summary.error) setCatalogError('Unable to load products. Please try again later.');
    else {
      setCatalogError(null);
      const ratings = new Map((summary.data || []).map(row => [row.product_id, row]));
      setProducts((data || []).map((p) => { const aggregate = ratings.get(p.id); return { ...p, subCategory: p.sub_category, salePrice: p.sale_price == null ? undefined : Number(p.sale_price), price: Number(p.price), rating: Number(aggregate?.average_rating || 0), reviewCount: Number(aggregate?.rating_count || 0), isNew: p.is_new, isFeatured: p.is_featured }; }));
    }
    } catch {
      setCatalogError('Unable to load products. Please try again later.');
    } finally {
      setCatalogLoading(false);
    }
  };
  useEffect(() => { void refreshCatalog(); }, []);

  const [page, setPage] = useState<Page>(window.location.pathname === '/admin' ? 'admin-dashboard' : window.location.pathname === '/track-order' ? 'track-order' : 'home');
  const [pageParams, setPageParams] = useState<Record<string, string>>({});
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [toast, setToast] = useState<AppContextType['toast']>(null);

  const navigate = (newPage: Page, params: Record<string, string> = {}) => {
    setPage(newPage);
    window.history.replaceState(null, '', newPage.startsWith('admin-') ? '/admin' : newPage === 'track-order' ? '/track-order' : '/');
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (product: Product, size: string, color: ProductColor, qty = 1) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (i) => i.product.id === product.id && i.size === size && i.color.name === color.name
      );
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id && i.size === size && i.color.name === color.name
            ? { ...i, quantity: i.quantity + qty }
            : i
        );
      }
      return [...prev, { product, size, color, quantity: qty }];
    });
    showToast('Added to cart!', 'success');
  };

  const removeFromCart = (productId: string, size: string, color: string) => {
    setCartItems((prev) =>
      prev.filter(
        (i) => !(i.product.id === productId && i.size === size && i.color.name === color)
      )
    );
  };

  const updateQty = (productId: string, size: string, color: string, qty: number) => {
    if (qty < 1) {
      removeFromCart(productId, size, color);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) =>
        i.product.id === productId && i.size === size && i.color.name === color
          ? { ...i, quantity: qty }
          : i
      )
    );
  };

  const cartTotal = cartItems.reduce(
    (sum, i) => sum + (i.product.salePrice ?? i.product.price) * i.quantity,
    0
  );

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <AppContext.Provider
      value={{
        products, catalogLoading, catalogError, refreshCatalog,
        page,
        pageParams,
        navigate,
        clearCart: () => setCartItems([]),
        cartItems,
        cartOpen,
        setCartOpen,
        addToCart,
        removeFromCart,
        updateQty,
        cartTotal,
        cartCount,
        wishlist,
        toggleWishlist,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
