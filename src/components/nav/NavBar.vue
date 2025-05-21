<template>
  <nav class="bg-white border-b border-gray-200 shadow-sm px-6 py-4">
    <div class="flex justify-between items-center max-w-6xl mx-auto">
      <!-- Logo ou titre -->
      <h1 class="text-xl font-bold text-primary">La Rougeraie</h1>

      <!-- Liens de navigation -->
      <ul class="flex gap-6 text-sm font-medium text-gray-700">
        <li @click="ui.closeUserMenu">
          <RouterLink to="/about" class="hover:text-primary transition" active-class="text-primary">
            À propos
          </RouterLink>
        </li>

        <li>
          <RouterLink
            to="/products"
            class="hover:text-primary transition"
            active-class="text-primary"
          >
            Produits
          </RouterLink>
        </li>

        <li class="relative">
          <button @click="ui.toggleUserMenu" aria-label="Compte utilisateur" class="cursor-pointer">
            <span v-if="user.isLoggedIn">
              <UserRoundCheck class="w-5 h-5 text-primary transition" />
            </span>
            <span v-else>
              <UserRound class="w-5 h-5 transition" />
            </span>
          </button>
          <UserMenu />
        </li>

        <li>
          <p class="cursor-pointer hover:text-primary transition"
             @click="ui.openCart">
            <ShoppingBag class="w-5 h-5 transition"/>
          </p>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useUIStore } from '@/stores/ui-store.ts'
import { useUserStore } from '@/stores/user-store.ts'
import { UserRoundCheck, UserRound, ShoppingBag } from 'lucide-vue-next'
import UserMenu from '@/components/user/UserMenu.vue'

const ui = useUIStore()
const user = useUserStore()
</script>
