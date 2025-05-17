export function pickupLabel(pickup: 'TUESDAY' | 'THURSDAY'): string {
  return pickup === 'TUESDAY' ? 'Mardi' : 'Jeudi'
}
