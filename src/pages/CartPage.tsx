import { useApp } from '../context/AppContext';
import { formatPrice } from '../data/products';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQty, cartTotal, navigate } = useApp();
  return (
    <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-10 min-h-screen">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted mb-8">
        <button onClick={() => navigate('home')} className="hover:text-primary transition-colors">Home</button>
        <span>/</span>
        <span className="text-primary">Shopping Cart</span>
      </div>

      <h1 className="font-serif text-4xl text-primary mb-10">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
          <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center">
            <svg className="w-9 h-9 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
          <div>
            <p className="font-serif text-2xl text-primary">Your cart is empty</p>
            <p className="text-sm text-muted mt-2">Discover our premium footwear collection.</p>
          </div>
          <button
            onClick={() => navigate('plp-men')}
            className="bg-primary text-ivory text-xs tracking-widest uppercase px-8 py-4 font-semibold hover:bg-slate transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-0">
            <div className="hidden sm:grid grid-cols-12 text-[10px] tracking-widest uppercase text-muted border-b border-border pb-3 mb-4 gap-4">
              <span className="col-span-6">Product</span>
              <span className="col-span-2 text-center">Price</span>
              <span className="col-span-2 text-center">Quantity</span>
              <span className="col-span-2 text-right">Total</span>
            </div>

            {cartItems.map((item, i) => (
              <div key={i} className="grid grid-cols-1 sm:grid-cols-12 gap-4 py-6 border-b border-border items-center">
                {/* Product */}
                <div className="sm:col-span-6 flex gap-4">
                  <button
                    onClick={() => navigate('pdp', { id: item.product.id })}
                    className="w-20 h-24 bg-stone-100 flex-shrink-0 overflow-hidden"
                  >
                    <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                  </button>
                  <div className="flex flex-col justify-between py-1">
                    <div>
                      <button
                        onClick={() => navigate('pdp', { id: item.product.id })}
                        className="font-serif text-lg text-primary hover:text-slate transition-colors leading-tight"
                      >
                        {item.product.name}
                      </button>
                      <p className="text-xs text-muted mt-1">
                        Size: {item.size} · Color: {item.color.name}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id, item.size, item.color.name)}
                      className="text-xs text-terracotta hover:underline self-start"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="sm:col-span-2 text-center">
                  {item.product.salePrice ? (
                    <div>
                      <span className="text-sm font-semibold text-terracotta block">{formatPrice(item.product.salePrice)}</span>
                      <span className="text-xs text-muted line-through">{formatPrice(item.product.price)}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-primary font-semibold">{formatPrice(item.product.price)}</span>
                  )}
                </div>

                {/* Qty */}
                <div className="sm:col-span-2 flex justify-center">
                  <div className="flex items-center border border-border rounded-sm">
                    <button
                      onClick={() => updateQty(item.product.id, item.size, item.color.name, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-primary/5 transition-colors"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-xs font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.product.id, item.size, item.color.name, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-primary/5 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="sm:col-span-2 text-right">
                  <span className="text-sm font-semibold text-primary">
                    {formatPrice((item.product.salePrice ?? item.product.price) * item.quantity)}
                  </span>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between pt-6">
              <button
                onClick={() => navigate('plp-men')}
                className="text-xs tracking-widest uppercase text-slate hover:text-primary transition-colors flex items-center gap-2"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                Continue Shopping
              </button>
            </div>
          </div>

          {/* Order summary */}
          <div className="bg-card border border-border p-6 rounded-sm h-fit space-y-5">
            <h2 className="font-serif text-2xl text-primary">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="font-medium text-primary">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between"><span className="text-muted">Delivery</span><span>Free</span></div>
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex justify-between font-semibold text-lg">
                <span className="text-primary font-sans">Total</span>
                <span className="font-serif text-primary">{formatPrice(cartTotal)}</span>
              </div>
              
            </div>

            <button
              onClick={() => navigate('checkout')}
              className="w-full bg-primary text-ivory text-xs tracking-widest uppercase py-4 font-semibold hover:bg-slate transition-colors rounded-sm"
            >
              Proceed to Checkout
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-muted">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2zm10-10V7a4 4 0 0 0-8 0v4h8z" />
              </svg>
              Cash on Delivery
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
