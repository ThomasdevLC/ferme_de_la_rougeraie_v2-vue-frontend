export function formatFloat(value: number): string {
  return Number.isInteger(value) ? value.toString() : value.toFixed(2);
}
