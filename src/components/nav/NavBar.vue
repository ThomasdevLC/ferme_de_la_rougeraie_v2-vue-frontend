<template >
  <nav class=" border-b border-blue-2 px-13 py-4 relative w-full  "
       :class="[ scrolled ? 'bg-white' : 'bg-white/80']"
  >
    <img src="/assets/header.png"
         alt="Background"
         class="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 opacity-95" />


    <div class="relative z-10 flex justify-between items-center mx-auto">
      <img
        src="/assets/logo.png"
        alt="logo"
        :class="['transition-all duration-500', scrolled ? 'w-24' : 'w-36']"
      />

      <ul class="flex space-x-8 text-[1.7rem] font-semibold text-gray-700">
        <li @click="ui.closeUserMenu">
          <RouterLink to="/about" class="hover:text-primary transition" active-class="text-primary">
            À propos
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/products" class="hover:text-primary transition" active-class="text-primary">
            Produits
          </RouterLink>
        </li>
        <li>
          <button @click="ui.toggleUserMenu" aria-label="Compte utilisateur" class="cursor-pointer">
            <span v-if="user.isLoggedIn">
              <UserRoundCheck class="w-8 h-8 text-primary transition" />
            </span>
            <span v-else>
              <UserRound class="w-8 h-8 transition" />
            </span>
          </button>
          <UserMenu />
        </li>

        <li>
          <div class="relative cursor-pointer hover:text-black transition" @click="ui.openCart">
            <ShoppingBag class="w-9 h-9 transition bg-white " />
            <div v-if="!cart.isEmpty"
                 class="absolute bottom-6 left-9 w-[22px] h-[22px] rounded-full bg-primary text-white text-xs flex items-center justify-center z-20">
              {{ cart.numberOfProducts }}
            </div>
          </div>
        </li>
      </ul>
    </div>
  </nav>
  <div class="">
    <MessageInfosMarquee v-if="displayMarquee" class="w-full"  />
  </div>
</template>


<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useUIStore } from '@/stores/ui-store.ts'
import { useUserStore } from '@/stores/user-store.ts'
import { useCartStore } from '@/stores/cart-store.ts'
import { UserRoundCheck, UserRound, ShoppingBag } from 'lucide-vue-next'
import UserMenu from '@/components/user/UserMenu.vue'
import MessageInfosMarquee from '@/components/message/MessageInfosMarquee.vue'

const ui = useUIStore()
const user = useUserStore()
const cart = useCartStore()

const router = useRouter()
const route = router.currentRoute


const scrolled = ref(false)

function handleScroll() {
  scrolled.value = window.scrollY >= 160
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})

const displayMarquee = computed(() => {
  return route.value.path === '/products' && !scrolled.value && !ui.cartOpen
})
</script>
