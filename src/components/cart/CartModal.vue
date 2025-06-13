<template>
  <Modal v-model="ui.cartOpen" :closable="true" :closeOnBackdrop="true" >

    <template #header>
      <div class="flex gap-3 items-center">
        <ShoppingBag class="w-8 h-8" />
        <h1 class="text-2xl font-bold">Panier</h1>
        <p v-if="!cart.isEmpty" class="text-gray-500">{{ cart.numberOfProducts }} article(s)</p>
      </div>
    </template>

    <template #default>
      <OrderConfirmation
        v-if="displayMessage"
        :userFirstName="user.firstName"
        :pickup="displayPickupLabel"
        @follow-orders="goToOrders"
      />

      <div v-else class="p-4 space-y-4">
        <div v-if="cart.isEmpty" class="text-gray-500 text-center">Votre panier est vide.</div>

        <div v-else class="flex flex-col space-y-4">
          <CartItem v-for="item in cart.items" :key="item.product.id" :item="item" />

          <p class="flex justify-end text-xl font-semibold">Total : {{ cart.cartTotal }}</p>

          <div v-if="user.isLoggedIn" class="flex flex-col space-y-4 ">
            <label class="font-semibold">Jour de retrait :</label>

            <CartCalendar
              v-model="pickupDate"
              :min-date="minDate"
              :max-date="maxDate"
            :disabled-days="disabledDays"
            :disabled-dates="disabledDates"
            />
            <button
              class="bg-primary text-white px-4 py-2 hover:bg-opacity-90 cursor-pointer w-fit mx-auto"
              @click="placeOrder"
            >
              Valider commande
            </button>
          </div>

          <p v-if="errorMessage" class="text-red-500 text-center font-semibold">
            {{ errorMessage }}
          </p>

          <div v-else-if="!user.isLoggedIn" class="mt-6 text-center">
            <p class="text-gray-500 mb-4">Veuillez vous connecter pour passer une commande.</p>
            <router-link
              to="/login"
              class="text-primary font-medium flex items-center gap-1 justify-center"
              @click="ui.closeCart()"
            >
              Se connecter
              <ArrowRightFromLine class="w-4 h-4" />
            </router-link>
          </div>
        </div>
      </div>
    </template>
  </Modal>
</template>


<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUIStore } from '@/stores/ui-store'
import { useCartStore } from '@/stores/cart-store'
import { useUserStore } from '@/stores/user-store'
import { handleAxiosError } from '@/utils/handle-axios-error'
import { addDays, startOfWeek } from 'date-fns'
import { format } from 'date-fns'
import { ShoppingBag, ArrowRightFromLine } from 'lucide-vue-next'

import Modal from '@/components/ui/ModalComponent.vue'
import CartItem from '@/components/cart/CartItem.vue'
import OrderConfirmation from '@/components/cart/OrderConfirmation.vue'
import CartCalendar from '@/components/cart/CartCalendar.vue'

const ui = useUIStore()
const cart = useCartStore()
const user = useUserStore()
const router = useRouter()

// UI state
const displayMessage = ref(false)
const errorMessage   = ref<string|null>(null)

// 1) Panier
const pickupDate = ref<Date|null>(null)
const today      = new Date()

// 2) Jours de semaine autorisés (0=dimanche…6=samedi)
const disabledDays = [0,1,3,4,6]  // seuls mardi(2) et vendredi(5) restent actifs

const weekStart = startOfWeek(today, { weekStartsOn: 1 }) // lundi
const minDate   = computed(() => weekStart)
const maxDate   = computed(() => addDays(weekStart, 13))  // +13j = dimanche semaine suivante

// 4) Construire la liste des mardis/vendredis dans cette plage
function listPickupCandidates(): Date[] {
  const dates: Date[] = []
  for (let d = new Date(minDate.value); d <= maxDate.value; d.setDate(d.getDate()+1)) {
    const dow = d.getDay() === 0 ? 7 : d.getDay()
    if (dow === 2 || dow === 5) {
      dates.push(new Date(d))
    }
  }
  return dates
}

// 5) Désactiver les dates dont le cutoff (veille à 21h) est passé
const disabledDates = computed(() => {
  const now = new Date()
  return listPickupCandidates().filter(d => {
    const cutoff = new Date(d)
    cutoff.setDate(cutoff.getDate() - 1)
    cutoff.setHours(21,0,0,0)
    return now > cutoff
  })
})

// 6) Libellé humain pour OrderConfirmation
const displayPickupLabel = computed(() => {
  if (!pickupDate.value) return ''
  return pickupDate.value
    .toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: '2-digit' })
})

// 7) Navigation
function goToOrders() {
  router.push('/orders')
  ui.closeCart()
}

// 8) Soumission
async function placeOrder() {
  if (!pickupDate.value) return
  const isoDate = format(pickupDate.value, 'yyyy-MM-dd')
  try {
    await cart.submitOrder(isoDate)
    displayMessage.value = true
    await new Promise(r => setTimeout(r, 5000))
    ui.closeCart()
    displayMessage.value = false
    pickupDate.value = null
  } catch (err) {
    errorMessage.value = handleAxiosError(err)
  }
}

</script>

<style scoped>
.pickup-picker {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
</style>
