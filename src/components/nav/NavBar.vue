<template>
  <nav class="border-b border-blue-2 bg-white px-13 py-4 relative w-full">
    <img
      src="/assets/header.png"
      alt="Background"
      class="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 opacity-95"
    />

    <div class="relative z-10 flex flex-col md:flex-row md:justify-between md:items-center mx-auto">
      <img
        src="/assets/logo.png"
        alt="logo"
        :class="['transition-all duration-500 mx-auto md:mx-0', scrolled ? 'w-24' : 'w-36']"
      />

      <ul
        class="flex flex-wrap md:space-x-8 text-[1.7rem] font-semibold text-gray-700 justify-center md:justify-start"
      >
        <li class="w-1/2 text-center md:w-auto" @click="ui.closeUserMenu">
          <RouterLink to="/about" class="hover:text-primary transition" active-class="text-primary">
            À propos
          </RouterLink>
        </li>
        <li class="w-1/2 text-center md:w-auto">
          <RouterLink
            to="/products"
            class="hover:text-primary transition"
            active-class="text-primary"
          >
            Produits
          </RouterLink>
        </li>
        <li class="w-1/2 text-center pt-4 pl-8 md:w-auto md:ml-auto md:p-0" :class="['order-last md:order-none']">
          <button @click="ui.toggleUserMenu" aria-label="Compte utilisateur" class="cursor-pointer">
            <span v-if="user.isLoggedIn">
              <UserRoundCheck class="w-8 h-8 text-primary transition " />
            </span>
            <span v-else>
              <UserRound class=" w-8 h-8 transition md:p-0" />
            </span>
          </button>
          <UserMenu />
        </li>
        <li class="w-1/2 flex justify-center pt-4 pr-8 md:w-auto md:p-0 " :class="['order-last md:order-none']">
          <div class="relative cursor-pointer hover:text-black transition" @click="ui.openCart">
            <ShoppingBag class="w-9 h-9 transition bg-white" />
            <div
              v-if="!cart.isEmpty"
              class="absolute bottom-6 left-9 w-[22px] h-[22px] rounded-full bg-primary text-white text-xs flex items-center justify-center z-20"
            >
              {{ cart.numberOfProducts }}
            </div>
          </div>
        </li>
      </ul>
    </div>
  </nav>
  <div class="">
    <MessageInfosMarquee v-if="displayMarquee" class="w-full" />
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
  if (window.innerWidth < 768) {
    scrolled.value = false
  } else {
    scrolled.value = window.scrollY >= 100
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  scrolled.value = false
})

const displayMarquee = computed(() => {
  return route.value.path === '/products' && !scrolled.value && !ui.cartOpen
})
</script>
