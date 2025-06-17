/**
 * Format a date string or object into a localized French date.
 *
 * @param dateStr         - ISO string or object with a date string ({ date: string })
 * @param includeWeekday  - If true,  weekday in full
 * @param includeYear     - If true,  year
 * @returns               - Formatted date
 */
export function formatDate(
  dateStr: string | { date: string },
  includeWeekday: boolean = false,
  includeYear: boolean = true
): string {
  const rawDate = typeof dateStr === 'string' ? dateStr : dateStr.date;
  const date = new Date(
    rawDate.includes(' ') ? rawDate.replace(' ', 'T') : rawDate
  );

  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    ...(includeYear ? { year: 'numeric' } : {}),
    ...(includeWeekday ? { weekday: 'long' } : {}),
  };

  return date.toLocaleDateString('fr-FR', options);
}


