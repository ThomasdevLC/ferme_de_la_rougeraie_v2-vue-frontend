<template>
  <nav class="bg-white border-b border-blue-2 px-13 py-4 relative w-full  ">
    <img src="/assets/header.png"
         alt="Background"
         class="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 opacity-95" />


    <div class="relative z-10 flex justify-between items-center mx-auto">
      <img
        src="/assets/logo.png"
        alt="logo"
        :class="['transition-all duration-500', scrolled ? 'w-24' : 'w-40']"
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
</template>


<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useUIStore } from '@/stores/ui-store.ts'
import { useUserStore } from '@/stores/user-store.ts'
import { useCartStore } from '@/stores/cart-store.ts'
import { UserRoundCheck, UserRound, ShoppingBag } from 'lucide-vue-next'
import UserMenu from '@/components/user/UserMenu.vue'

const ui = useUIStore()
const user = useUserStore()
const cart = useCartStore()

const scrolled = ref(false)
const router = useRouter()

function handleScroll() {
  if (router.currentRoute.value.path !== '/products') {
    return
  }
  scrolled.value = window.scrollY >= 186
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

