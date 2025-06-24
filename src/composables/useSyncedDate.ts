import { ref, watch, type Ref } from 'vue'
import { parseISO, format } from 'date-fns'

/**
 * Syncs a Ref<string> containing an ISO date (YYYY-MM-DD)
 * with a Ref<Date | null> for use in calendar components.
 *
 * @param isoStringRef  a Ref containing the ISO date string
 * @returns a Ref<Date | null> that automatically stays in sync
 */

export function useSyncedDate(isoStringRef: Ref<string>) {
  const date = ref<Date|null>(null)

  watch(
    isoStringRef,
    iso => {
      date.value = iso ? parseISO(iso) : null
    },
    { immediate: true },
  )

  watch(date, d => {
    isoStringRef.value = d ? format(d, 'yyyy-MM-dd') : ''
  })

  return date
}
