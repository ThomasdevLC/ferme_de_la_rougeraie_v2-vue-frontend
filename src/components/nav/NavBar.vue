<template>
  <nav class="border-b border-blue-2 bg-white px-13 py-4 relative w-full">
    <!--    <img-->
    <!--      src="/assets/header.png"-->
    <!--      alt="Background"-->
    <!--      class="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 opacity-95"-->
    <!--    />-->

    <div class="relative z-10 flex items-center justify-between mx-auto py-8">

      <ul class="flex items-center md:space-x-8 text-[1.3rem] font-semibold text-gray-700">
        <li class="md:w-auto sm:mr-14" @click="ui.closeUserMenu">
          <RouterLink
            to="/about"
            class="hover:text-primary transition"
            active-class="border-b-2 border-primary pb-0.5"
          >
            À propos
          </RouterLink>
        </li>
        <li class="md:w-auto sm:mr-20">
          <RouterLink
            to="/products"
            class="hover:text-primary transition"
            active-class="border-b-2 border-primary pb-0.5"
          >
            Produits
          </RouterLink>
        </li>
      </ul>

      <img
        src="/assets/logo.png"
        alt="logo"
        class="w-26 absolute left-1/2 -translate-x-1/2"
      />

      <ul class="flex items-center gap-8">
        <li
          class="w-1/2 text-center pt-4 pl-12 md:w-auto md:ml-auto md:p-0"
          :class="['order-last md:order-none']"
        >
          <button @click="ui.toggleUserMenu" aria-label="Compte utilisateur" class="cursor-pointer">
            <span v-if="user.isLoggedIn">
              <UserRoundCheck class="w-7 h-7 text-primary transition" />
            </span>
            <span v-else>
              <UserRound class="w-7 h-7 transition md:p-0" />
            </span>
          </button>
          <UserMenu />
        </li>
        <li
          class="w-1/2 flex justify-center pt-4 pr-12 md:w-auto md:p-0"
          :class="['order-last md:order-none']"
        >
          <div class="relative cursor-pointer hover:text-black transition" @click="ui.openCart">
            <ShoppingBag class="w-7 h-7 transition bg-white" />
            <div
              v-if="!cart.isEmpty"
              class="absolute bottom-7 left-6 w-[22px] h-[22px] rounded-full bg-primary text-white text-xs flex items-center justify-center z-20"
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
  scrolled.value =
    window.innerWidth >= 768 && route.value.path === '/products' && window.scrollY >= 75
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  scrolled.value = false
})

const displayMarquee = computed(
  () => route.value.path === '/products' && !scrolled.value && !ui.cartOpen,
)
</script>
