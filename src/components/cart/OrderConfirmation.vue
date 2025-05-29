<template>
  <div
    class="text-center font-semibold text-xl flex flex-col justify-center space-y-8 min-h-48 p-8"
  >
    <img :src="planeLogo" alt="plane logo" class="w-14 mx-auto" />

    <p>
      Merci {{ userFirstName }}, votre commande a bien été envoyée !<br />
      À {{ pickup === 'TUESDAY' ? 'mardi' : 'jeudi' }}.
    </p>
    <button
      class="w-fit mx-auto cursor-pointer rounded-xs bg-primary text-white text-base font-medium px-4 py-2 hover:bg-opacity-90 "
      @click="$emit('follow-orders')"    >
      Suivre vos commandes
    </button>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import planeLogo from '/assets/plane.png'

defineProps<{
  userFirstName: string
  pickup: 'TUESDAY' | 'THURSDAY'
}>()

defineEmits<{
  (e: 'follow-orders'): void
}>()

</script>
