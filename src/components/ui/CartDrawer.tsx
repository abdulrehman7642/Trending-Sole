import { useApp } from '../../context/AppContext';
import { formatPrice } from '../../data/products';

export default function CartDrawer() {
  const { cartOpen, setCartOpen, cartItems, removeFromCart, updateQty, cartTotal, navigate } = useApp();

  return (
    <>
      {/* Overlay */}
      {cartOpen && (
        <div
          className="fixed inset-0 bg-primary/40 z-40 backdrop-blur-sm"
          onClick={() => setCartOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-full max-w-md bg-ivory z-50 flex flex-col shadow-2xl transition-transform duration-300 ${
          cartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <h2 className="font-serif text-2xl text-primary">
            Your Cart
            {cartItems.length > 0 && (
              <span className="font-sans text-sm text-muted ml-2 font-normal">({cartItems.length} items)</span>
            )}
          </h2>
          <button onClick={() => setCartOpen(false)} className="text-slate hover:text-primary transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center">
                <svg className="w-7 h-7 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>
              <div>
                <p className="font-serif text-xl text-primary">Your cart is empty</p>
                <p className="text-sm text-muted mt-1">Discover something you love.</p>
              </div>
              <button
                onClick={() => { navigate('plp-men'); setCartOpen(false); }}
                className="mt-2 bg-primary text-ivory text-xs tracking-widest uppercase px-6 py-3 font-semibold hover:bg-slate transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {cartItems.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div
                    className="w-20 h-24 bg-stone-100 flex-shrink-0 overflow-hidden cursor-pointer"
                    onClick={() => { navigate('pdp', { id: item.product.id }); setCartOpen(false); }}
                  >
                    <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif text-base text-primary leading-tight">{item.product.name}</h4>
                      <p className="text-xs text-muted mt-1">
                        Size {item.size} · {item.color.name}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-border rounded-sm">
                        <button
                          onClick={() => updateQty(item.product.id, item.size, item.color.name, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-sm hover:bg-primary/5 transition-colors"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-xs font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.product.id, item.size, item.color.name, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-sm hover:bg-primary/5 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-primary">
                          {formatPrice((item.product.salePrice ?? item.product.price) * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.size, item.color.name)}
                          className="text-muted hover:text-terracotta transition-colors"
                          aria-label="Remove"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-border px-6 py-5 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted">Subtotal</span>
              <span className="font-semibold text-primary">{formatPrice(cartTotal)}</span>
            </div>
            <p className="text-xs text-muted">Free delivery across the UAE.</p>
            <button
              onClick={() => { navigate('checkout'); setCartOpen(false); }}
              className="w-full bg-primary text-ivory text-xs tracking-widest uppercase py-4 font-semibold hover:bg-slate transition-colors"
            >
              Proceed to Checkout
            </button>
            <button
              onClick={() => { navigate('cart'); setCartOpen(false); }}
              className="w-full text-xs tracking-widest uppercase text-slate hover:text-primary transition-colors py-1"
            >
              View Full Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
