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

// —————————————————————————————————————————
// 1) PROPS & EMITS pour supporter v-model
// —————————————————————————————————————————
const props = defineProps<{
  modelValue: Date | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: Date | null): void
}>()

// —————————————————————————————————————————
// 2) ÉTAT LOCAL & SYNCHRONISATION avec v-model
// —————————————————————————————————————————
const innerDate = ref<Date|null>(props.modelValue)

// si le parent change modelValue, on le reflète localement
watch(() => props.modelValue, v => {
  innerDate.value = v
})
// si l’utilisateur sélectionne une date, on émet l’update
watch(innerDate, v => {
  emit('update:modelValue', v)
})

// —————————————————————————————————————————
// 3) CALCUL DES BORNES DE SEMAINE
// —————————————————————————————————————————
const today     = new Date()
const weekStart = computed(() => startOfWeek(today, { weekStartsOn: 1 })) // lundi
const minDate   = computed(() => weekStart.value)                         // date min
const maxDate   = computed(() => addDays(weekStart.value, 13))            // dimanche S+1

// —————————————————————————————————————————
// 4) JOURS AUTORISÉS & DÉSACTIVÉS
// —————————————————————————————————————————
// on bloque tous les jours de la semaine sauf mardi (2) et vendredi (5)
const disabledDays = [0,1,3,4,6]

// générer la liste de tous les mardis et vendredis dans la plage
function listPickupCandidates(): Date[] {
  const dates: Date[] = []
  for (
    let d = new Date(minDate.value);
    d <= maxDate.value;
    d.setDate(d.getDate() + 1)
  ) {
    const dow = d.getDay() === 0 ? 7 : d.getDay()  // dimanche→7
    if (dow === 2 || dow === 5) {
      dates.push(new Date(d))                       // mardi ou vendredi
    }
  }
  return dates
}

// désactiver les dates candidates dont le cutoff (veille à 21h) est déjà passé
const disabledDates = computed(() => {
  const now = new Date()
  return listPickupCandidates().filter(d => {
    const cutoff = new Date(d)
    cutoff.setDate(cutoff.getDate() - 1) // veille
    cutoff.setHours(21, 0, 0, 0)          // 21:00
    return now > cutoff                   // true → on désactive
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
