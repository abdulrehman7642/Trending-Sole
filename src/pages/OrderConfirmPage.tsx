import { useApp } from '../context/AppContext';
export default function OrderConfirmPage() {
  const { pageParams, navigate } = useApp();
  if (!pageParams.orderNumber) return <div className="p-10">No order to display.</div>;
  return <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center"><h1 className="text-4xl">Thank you for your order</h1><p className="mt-5 break-all">Order number: <strong>{pageParams.orderNumber}</strong></p><p className="mt-3 text-sm text-muted">Payment is due on delivery.</p>{pageParams.notificationStatus !== 'sent' && <p role="alert" className="mt-4 text-terracotta">Your order was saved, but the store notification could not be sent. Please contact the store with your order number.</p>}<button onClick={() => navigate('track-order', { orderNumber: pageParams.orderNumber })} className="border border-primary px-6 py-3 mt-8">Track order</button><button onClick={() => navigate('home')} className="bg-primary text-ivory px-6 py-3 mt-8">Continue shopping</button></div>;
}
