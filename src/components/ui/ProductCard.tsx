import { useState } from 'react';
import { Product } from '../../types';
import { formatPrice } from '../../data/products';
import { useApp } from '../../context/AppContext';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { navigate, toggleWishlist, wishlist } = useApp();
  const [imgIdx, setImgIdx] = useState(0);
  const [hovered, setHovered] = useState(false);
  const isWishlisted = wishlist.includes(product.id);
  const hasDiscount = product.salePrice !== undefined;
  const discount = hasDiscount
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;

  return (
    <div
      className="group flex flex-col bg-card rounded-sm overflow-hidden transition-shadow hover:shadow-lg cursor-pointer"
      onMouseEnter={() => { setHovered(true); if (product.images[1]) setImgIdx(1); }}
      onMouseLeave={() => { setHovered(false); setImgIdx(0); }}
    >
      {/* Image */}
      <div
        className="relative overflow-hidden bg-stone-100 aspect-[3/4]"
        onClick={() => navigate('pdp', { id: product.id })}
      >
        {/* Fill the mobile frame behind images of different proportions. */}
        <img
          src={product.images[imgIdx]}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-lg opacity-60 sm:hidden"
        />
        <img
          src={product.images[imgIdx]}
          alt={product.name}
          className="relative w-full h-full object-contain sm:object-cover transition-transform duration-500 sm:group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="bg-primary text-ivory text-[10px] tracking-widest uppercase px-2.5 py-1 font-semibold">
              New
            </span>
          )}
          {hasDiscount && (
            <span className="bg-terracotta text-white text-[10px] tracking-widest uppercase px-2.5 py-1 font-semibold">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 hover:bg-white"
          aria-label="Toggle wishlist"
        >
          <svg className={`w-4 h-4 transition-colors ${isWishlisted ? 'text-terracotta fill-terracotta' : 'text-slate'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Quick view */}
        {onQuickView && (
          <button
            onClick={(e) => { e.stopPropagation(); onQuickView(product); }}
            className="hidden sm:block absolute bottom-3 inset-x-3 bg-primary/90 backdrop-blur-sm text-ivory text-[10px] tracking-widest uppercase py-2.5 text-center sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 transition-all sm:translate-y-2 sm:group-hover:translate-y-0 font-semibold"
          >
            Quick View
          </button>
        )}
      </div>

      {onQuickView && (
        <button
          onClick={() => onQuickView(product)}
          className="sm:hidden bg-primary/90 text-ivory text-[10px] tracking-widest uppercase py-2.5 text-center font-semibold"
        >
          Quick View
        </button>
      )}

      {/* Info */}
      <div className="p-2.5 sm:p-4 min-w-0 flex flex-col gap-1" onClick={() => navigate('pdp', { id: product.id })}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[10px] tracking-widest uppercase text-muted font-medium">
              {product.subCategory}
            </p>
            <h3 className="font-serif text-lg text-primary leading-tight mt-0.5">{product.name}</h3>
          </div>
          {/* Rating */}
          <div className="flex items-center gap-1 flex-shrink-0 mt-1">
            <svg className="w-3 h-3 text-gold fill-gold" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01z" />
            </svg>
            <span className="text-[10px] text-muted">{product.reviewCount ? product.rating.toFixed(1) : 'New'}</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
          {hasDiscount ? (
            <>
              <span className="text-sm font-semibold text-terracotta">{formatPrice(product.salePrice!)}</span>
              <span className="text-xs text-muted line-through">{formatPrice(product.price)}</span>
            </>
          ) : (
            <span className="text-sm font-semibold text-primary">{formatPrice(product.price)}</span>
          )}
        </div>

        {/* Color dots */}
        <div className="flex gap-1.5 mt-2">
          {product.colors.slice(0, 4).map((color) => (
            <span
              key={color.name}
              title={color.name}
              className="w-3.5 h-3.5 rounded-full border border-border"
              style={{ backgroundColor: color.hex }}
            />
          ))}
          {product.colors.length > 4 && (
            <span className="text-[10px] text-muted">+{product.colors.length - 4}</span>
          )}
        </div>
      </div>
    </div>
  );
}
