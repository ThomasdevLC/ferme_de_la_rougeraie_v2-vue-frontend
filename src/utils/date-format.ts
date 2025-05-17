export function formatDate(dateStr: string | { date: string }): string {
  const rawDate = typeof dateStr === 'string' ? dateStr : dateStr.date;
  const date = new Date(rawDate);

  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
