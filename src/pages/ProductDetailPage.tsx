import ProductRatingForm from '../components/ui/ProductRatingForm';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../data/products';
import { ProductColor } from '../types';
import ProductCard from '../components/ui/ProductCard';

export default function ProductDetailPage() {
  const { pageParams, products, catalogLoading } = useApp();
  const product = products.find((p) => p.id === pageParams.id);
  if (!product) return <p className="p-10">{catalogLoading ? 'Loading product?' : 'Product not found.'}</p>;
  return <ProductDetail key={product.id} product={product} />;
}

function ProductDetail({ product }: { product: import('../types').Product }) {
  const { navigate, addToCart, toggleWishlist, wishlist, showToast, products } = useApp();

  const [selectedImg, setSelectedImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'material'>('description');
  const [imgZoom, setImgZoom] = useState(false);

  const isWishlisted = wishlist.includes(product.id);
  const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    if (!selectedSize) {
      showToast('Please select a size', 'error');
      return;
    }
    addToCart(product, selectedSize, selectedColor, qty);
  };

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-5 flex items-center gap-2 text-xs text-muted">
        <button onClick={() => navigate('home')} className="hover:text-primary transition-colors">Home</button>
        <span>/</span>
        <button onClick={() => navigate(`plp-${product.category}` as any)} className="hover:text-primary transition-colors capitalize">
          {product.category}
        </button>
        <span>/</span>
        <span className="text-primary truncate max-w-48">{product.name}</span>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image gallery */}
          <div className="flex flex-wrap gap-4">
            {/* Thumbnails */}
            <div className="hidden sm:flex flex-col gap-3 w-16 flex-shrink-0">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImg(i)}
                  className={`w-16 h-20 overflow-hidden bg-stone-100 rounded-sm border-2 transition-colors ${
                    i === selectedImg ? 'border-primary' : 'border-transparent hover:border-border'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main image */}
            <div
              className="flex-1 bg-stone-100 rounded-sm overflow-hidden relative cursor-zoom-in aspect-[4/5]"
              onClick={() => setImgZoom(true)}
            >
              <img
                src={product.images[selectedImg]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.salePrice && (
                <div className="absolute top-4 left-4 bg-terracotta text-white text-[10px] tracking-widest uppercase px-3 py-1.5 font-semibold">
                  Sale
                </div>
              )}
              {product.isNew && !product.salePrice && (
                <div className="absolute top-4 left-4 bg-primary text-ivory text-[10px] tracking-widest uppercase px-3 py-1.5 font-semibold">
                  New
                </div>
              )}
            </div>
            {product.images.length > 1 && <div className="flex sm:hidden gap-2 w-full overflow-x-auto" aria-label="Product images">{product.images.map((img, i) => <button type="button" key={img} onClick={() => setSelectedImg(i)} aria-label={`View product image ${i + 1}`} aria-pressed={selectedImg === i} className={`w-14 h-16 shrink-0 overflow-hidden border-2 ${selectedImg === i ? 'border-primary' : 'border-transparent'}`}><img src={img} alt="" className="w-full h-full object-cover" /></button>)}</div>}
          </div>

          {/* Product info */}
          <div className="flex flex-col gap-6 lg:pt-4">
            <div>
              <p className="text-xs tracking-widest uppercase text-muted">{product.subCategory} · SKU: {product.sku}</p>
              <h1 className="font-serif text-4xl text-primary mt-2 leading-tight">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mt-3">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-gold fill-gold' : 'text-border fill-border'}`}
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-muted">{product.reviewCount ? `${product.rating.toFixed(1)} out of 5 (${product.reviewCount} ${product.reviewCount === 1 ? 'rating' : 'ratings'})` : 'No ratings yet'}</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 py-4 border-y border-border">
              {product.salePrice ? (
                <>
                  <span className="font-serif text-3xl text-terracotta font-medium">{formatPrice(product.salePrice)}</span>
                  <span className="text-lg text-muted line-through">{formatPrice(product.price)}</span>
                  <span className="bg-terracotta/10 text-terracotta text-xs px-2.5 py-1 font-semibold">
                    {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
                  </span>
                </>
              ) : (
                <span className="font-serif text-3xl text-primary font-medium">{formatPrice(product.price)}</span>
              )}
            </div>

            {/* Color selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs tracking-widest uppercase font-semibold text-primary">
                  Color: <span className="font-normal text-slate">{selectedColor.name}</span>
                </h3>
              </div>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    title={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor.name === color.name ? 'border-primary scale-110' : 'border-border hover:border-slate'
                    }`}
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
            </div>

            {/* Size selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs tracking-widest uppercase font-semibold text-primary">
                  Size: <span className="font-normal text-slate">{selectedSize || 'Select a size'}</span>
                </h3>
                <button className="text-xs text-gold hover:underline">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[48px] h-10 px-3 border rounded-sm text-sm transition-all ${
                      selectedSize === size
                        ? 'bg-primary text-ivory border-primary'
                        : 'border-border text-slate hover:border-primary hover:text-primary'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-gold' : 'bg-terracotta'}`} />
              <span className="text-xs text-muted">
                {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
              </span>
            </div>

            {/* Quantity + Actions */}
            <div className="flex gap-3">
              <div className="flex items-center border border-border rounded-sm">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-10 h-12 flex items-center justify-center text-lg hover:bg-primary/5 transition-colors"
                >
                  −
                </button>
                <span className="w-12 text-center text-sm font-medium">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="w-10 h-12 flex items-center justify-center text-lg hover:bg-primary/5 transition-colors"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-primary text-ivory text-xs tracking-widest uppercase py-3 font-semibold hover:bg-slate transition-colors"
              >
                Add to Cart
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`w-12 h-12 border rounded-sm flex items-center justify-center transition-colors ${
                  isWishlisted ? 'border-terracotta text-terracotta bg-terracotta/5' : 'border-border text-slate hover:border-terracotta hover:text-terracotta'
                }`}
                aria-label="Wishlist"
              >
                <svg className={`w-5 h-5 ${isWishlisted ? 'fill-terracotta' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>

            {/* Buy now */}
            <button
              onClick={() => {
                if (!selectedSize) { showToast('Please select a size', 'error'); return; }
                addToCart(product, selectedSize, selectedColor, qty);
                navigate('checkout');
              }}
              className="w-full border border-primary text-primary text-xs tracking-widest uppercase py-3.5 font-semibold hover:bg-primary hover:text-ivory transition-colors"
            >
              Buy Now
            </button>

            {/* Delivery info */}
            <div className="bg-card border border-border rounded-sm p-4 space-y-3">
              {[
                { icon: '🚚', text: 'Free delivery across the UAE' },
                { icon: '↩', text: 'Easy 30-day returns & exchanges' },
                { icon: '📦', text: 'Cash on Delivery available nationwide' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3 text-xs text-slate">
                  <span>{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="flex border-b border-border">
            {(['description', 'material'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-xs tracking-widest uppercase font-semibold px-6 py-4 border-b-2 transition-colors capitalize ${
                  activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-primary'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="py-8 max-w-3xl">
            {activeTab === 'description' && (
              <p className="text-sm text-slate leading-relaxed">{product.description}</p>
            )}
            {activeTab === 'material' && (
              <div className="space-y-3">
                <p className="text-sm text-slate leading-relaxed">{product.material}</p>
                <div className="border-t border-border pt-4 mt-4">
                  <h4 className="text-xs tracking-widest uppercase font-semibold text-primary mb-3">Care Instructions</h4>
                  <ul className="space-y-1.5 text-sm text-slate">
                    <li>• Clean with a soft, damp cloth</li>
                    <li>• Store in the original box or a breathable dust bag</li>
                    <li>• Avoid prolonged exposure to direct sunlight</li>
                    <li>• Use appropriate conditioner for leather uppers</li>
                  </ul>
                </div>
              </div>
            )}

          </div>
        </div>

        <ProductRatingForm productId={product.id} />

        {/* Related products */}
        <div className="mt-8">
          <h2 className="font-serif text-3xl text-primary mb-8">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>

      {/* Image zoom modal */}
      {imgZoom && (
        <div
          className="fixed inset-0 z-50 bg-primary/90 flex items-center justify-center p-4"
          onClick={() => setImgZoom(false)}
        >
          <img
            src={product.images[selectedImg]}
            alt={product.name}
            className="max-w-full max-h-full object-contain"
          />
          <button className="absolute top-4 right-4 text-ivory text-2xl" onClick={() => setImgZoom(false)}>×</button>
        </div>
      )}
    </div>
  );
}
