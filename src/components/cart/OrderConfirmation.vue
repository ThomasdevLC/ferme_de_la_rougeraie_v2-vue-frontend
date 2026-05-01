<template>
  <div
    class="text-center  text-xl flex flex-col justify-center space-y-8 min-h-48 p-8"
  >
    <img :src="planeLogo" alt="plane logo" class="w-14 mx-auto" />

    <p>
      Merci {{ userFirstName }}, votre commande a bien été {{ action }}  !<br />
       À {{ pickup  }}.
    </p>
    <button
      class="w-fit mx-auto cursor-pointer rounded-xs bg-primary text-white test-sm font-medium px-4 py-2 hover:bg-opacity-90 "
      @click="$emit('follow-orders')"    >
      Suivre vos commandes
    </button>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue'
import planeLogo from '/assets/plane.png'
import { useCartStore } from '@/stores/cart-store'

const cartStore = useCartStore()

const { userFirstName, pickup } = defineProps<{
  userFirstName: string
  pickup: string
}>()

const action = computed(() =>
  cartStore.isEditing ? 'modifiée' : 'envoyée'
)

defineEmits<{
  (e: 'follow-orders'): void
}>()




</script>
