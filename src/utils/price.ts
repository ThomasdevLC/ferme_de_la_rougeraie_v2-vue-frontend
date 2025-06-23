// src/utils/price.ts

/**
 * Converts a euro price to cents in a deterministic way:
 * 1. on fige le float à 2 décimales
 * 2. on supprime le point et on parse en int
 */
export function convertPriceToCents(price: number): number {
  const fixed = price.toFixed(2);      // ex. price = 2.995 → "3.00", price = 2.99 → "2.99"
  const digits = fixed.replace('.', ''); // "300" ou "299"
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
