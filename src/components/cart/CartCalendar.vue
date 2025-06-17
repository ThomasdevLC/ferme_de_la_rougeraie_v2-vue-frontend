<template>
  <div class="pickup-picker">
    <label for="pickup">Date de retrait</label>
    <PvCalendar
      id="pickup"
      v-model="innerDate"
      :min-date="minDate"
      :max-date="maxDate"
      :disabled-days="disabledDays"
      :disabled-dates="disabledDates"
      date-format="dd/mm/yy"
      locale="fr"
      :show-icon="true"
      input-class="p-inputtext"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { startOfWeek, addDays } from 'date-fns'
import PvCalendar from 'primevue/calendar'

const props = defineProps<{ modelValue: Date | null }>()
const emit  = defineEmits<{ (e: 'update:modelValue', val: Date | null): void }>()

const innerDate = ref<Date|null>(props.modelValue)
watch(() => props.modelValue, v => innerDate.value = v)
watch(innerDate, v => emit('update:modelValue', v))

const today     = new Date()
const weekStart = computed(() => startOfWeek(today, { weekStartsOn: 1 }))
const minDate   = computed(() => weekStart.value)
const maxDate   = computed(() => addDays(weekStart.value, 13))

const disabledDays = [0,1,3,4,6]

/**
 * Generates all Tuesdays and Fridays between minDate and maxDate.
 *
 * @returns An array of candidate pickup dates.
 */

function getPickupDateOptions(): Date[] {
  const dates: Date[] = []
  for (
    let d = new Date(minDate.value);
    d <= maxDate.value;
    d.setDate(d.getDate() + 1)
  ) {
    const dayOfWeekNumber = d.getDay() === 0 ? 7 : d.getDay()
    if (dayOfWeekNumber === 2 || dayOfWeekNumber === 5) dates.push(new Date(d))
  }
  return dates
}

/**
 * The exact date/time  after which next week’s
 * pickup dates become selectable.
 */
const unlockNextWeek = computed(() => {
  const fridayThisWeek = new Date(weekStart.value)
  fridayThisWeek.setDate(fridayThisWeek.getDate() + 4)
  fridayThisWeek.setHours(0,0,0,0)
  return fridayThisWeek
})

//const unlockNextWeek = computed(() => {
//  const thursday = new Date(weekStart.value)
 // thursday.setDate(thursday.getDate() + 3)
 // thursday.setHours(21, 0, 0, 0)
 // return thursday
//})

/**
 * Computes which dates should be disabled in the calendar:
 *   1. All dates falling in next week before unlockNextWeek.
 *   2. Any date whose cutoff (the day before at 21:00) has already passed.
 */
const disabledDates = computed(() => {
  const now = new Date()
  return getPickupDateOptions().filter(d => {
    const cutoff = new Date(d)
    cutoff.setDate(cutoff.getDate() - 1)
    cutoff.setHours(21, 0, 0, 0)

    const isNextWeek = d > addDays(weekStart.value, 6)
    if (isNextWeek && now < unlockNextWeek.value) {
      return true
    }
    return now > cutoff
  })
})
</script>

<style scoped>
.pickup-picker {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 240px;
}
</style>
