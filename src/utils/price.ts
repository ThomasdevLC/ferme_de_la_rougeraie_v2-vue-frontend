import type { CartItem } from '@/models/cart/cart-item'

/**
 * Converts a euro price to cents :
 * 1. Fixes the price to 2 decimal
 * 2. Removes the decimal point and parses it as an integer
 */
export function convertPriceToCents(price: number): number {
  const fixed = price.toFixed(2);
  const digits = fixed.replace('.', '');
  return parseInt(digits, 10);
}

/**
 * Formats a price in cents into a euro price
 */
export function formatPrice(priceInCents: number): string {
  return (priceInCents / 100).toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Computes and formats the total for a cart item (unit price × quantity).
 */
export function getItemTotal(item: CartItem): string {
  const unitPriceInCents = convertPriceToCents(item.product.price)
  const totalInCents = Math.round(unitPriceInCents * item.quantity)
  return formatPrice(totalInCents)
}
