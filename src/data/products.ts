export const formatPrice = (price: number) => new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED' }).format(price);
