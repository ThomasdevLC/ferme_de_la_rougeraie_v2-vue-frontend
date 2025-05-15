/**
 * Converts a euro price  to cents
 */
export function convertPriceToCents(price: number): number {
  return Math.round(price * 100);
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
