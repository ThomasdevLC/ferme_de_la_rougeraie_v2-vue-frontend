<template>
  <nav class="border-b border-black bg-white px-4 md:px-13 py-3 md:py-4 relative w-full">
    <div class="relative z-10 flex items-center justify-between mx-auto py-4 md:py-8">

      <!-- Burger button — mobile only -->
      <button
        class="md:hidden cursor-pointer"
        aria-label="Menu"
        @click="mobileMenuOpen = !mobileMenuOpen"
      >
        <Menu v-if="!mobileMenuOpen" class="w-6 h-6" />
        <X v-else class="w-6 h-6" />
      </button>

      <!-- Nav links — desktop only -->
      <ul class="hidden md:flex items-center space-x-8 text-[1.3rem] font-semibold text-gray-700">
        <li @click="ui.closeUserMenu">
          <RouterLink
            to="/about"
            class="hover:text-primary transition"
            active-class="border-b-2 border-primary pb-0.5"
          >
            À propos
          </RouterLink>
        </li>
        <li>
          <RouterLink
            to="/products"
            class="hover:text-primary transition"
            active-class="border-b-2 border-primary pb-0.5"
          >
            Produits
          </RouterLink>
        </li>
      </ul>

      <!-- Logo (centered) -->
      <button
        type="button"
        class="absolute left-1/2 -translate-x-1/2"
        aria-label="Accès administrateur"
        @click="handleLogoClick"
      >
        <img src="/assets/logo.png" alt="logo" class="w-16 md:w-26" />
      </button>

      <!-- Right icons -->
      <ul class="flex items-center gap-4 md:gap-8">
        <li>
          <button @click="ui.toggleUserMenu" aria-label="Compte utilisateur" class="cursor-pointer">
            <span v-if="user.isLoggedIn">
              <UserRoundCheck class="w-6 h-6 md:w-7 md:h-7 text-primary transition" />
            </span>
            <span v-else>
              <UserRound class="w-6 h-6 md:w-7 md:h-7 transition" />
            </span>
          </button>
          <UserMenu />
        </li>
        <li>
          <div class="relative cursor-pointer hover:text-black transition" @click="ui.openCart">
            <ShoppingBag class="w-6 h-6 md:w-7 md:h-7 transition bg-white" />
            <div
              v-if="!cart.isEmpty"
              class="absolute -top-2 -right-2 w-[18px] h-[18px] md:w-[20px] md:h-[20px] rounded-full bg-primary text-white text-xs flex items-center justify-center z-20"
            >
              {{ cart.numberOfProducts }}
            </div>
          </div>
        </li>
      </ul>

    </div>
  </nav>

  <!-- Mobile menu dropdown -->
  <Transition
    enter-active-class="transition-all duration-200 ease-out"
    enter-from-class="opacity-0 -translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-150 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-2"
  >
    <div
      v-if="mobileMenuOpen"
      class="md:hidden relative z-10 bg-white border-b border-black px-6 py-4 flex flex-col gap-4 text-base font-semibold text-gray-700"
    >
      <RouterLink
        to="/about"
        class="hover:text-primary transition py-1"
        active-class="text-primary border-b border-primary w-fit"
        @click="mobileMenuOpen = false"
      >
        À propos
      </RouterLink>
      <RouterLink
        to="/products"
        class="hover:text-primary transition py-1"
        active-class="text-primary border-b border-primary w-fit"
        @click="mobileMenuOpen = false"
      >
        Produits
      </RouterLink>
    </div>
  </Transition>

  <div>
    <MessageInfosMarquee v-if="displayMarquee" class="w-full" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, computed, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useUIStore } from '@/stores/ui-store.ts'
import { useUserStore } from '@/stores/user-store.ts'
import { useCartStore } from '@/stores/cart-store.ts'
import { UserRoundCheck, UserRound, ShoppingBag, Menu, X } from 'lucide-vue-next'
import UserMenu from '@/components/user/UserMenu.vue'
import MessageInfosMarquee from '@/components/message/MessageInfosMarquee.vue'

const ui = useUIStore()
const user = useUserStore()
const cart = useCartStore()

const router = useRouter()
const route = router.currentRoute

const scrolled = ref(false)
const mobileMenuOpen = ref(false)
const ADMIN_LOGIN_URL = `${import.meta.env.VITE_API_BASE_URL}/login`

watch(
  () => route.value.path,
  () => { mobileMenuOpen.value = false },
)

function handleScroll() {
  scrolled.value =
    window.innerWidth >= 768 && route.value.path === '/products' && window.scrollY >= 75
}

function handleLogoClick() {
  window.open(ADMIN_LOGIN_URL, '_blank', 'noopener,noreferrer')
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  scrolled.value = false
})

const displayMarquee = computed(
  () => route.value.path === '/products' && !scrolled.value && !ui.cartOpen && !mobileMenuOpen.value,
)
</script>
