<template>
  <nav class="bg-white border-b border-gray-200 shadow-sm px-6 py-4">
    <div class="flex justify-between items-center max-w-6xl mx-auto">
      <!-- Logo ou titre -->
      <h1 class="text-xl font-bold text-primary">La Rougeraie</h1>

      <!-- Liens de navigation -->
      <ul class="flex gap-6 text-sm font-medium text-gray-700">
        <li>
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

        <li>
          <RouterLink to="/login" class="hover:text-primary transition" active-class="text-primary">
            Connexion
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/orders">Mes commandes</RouterLink>
        </li>

        <li>
          <p class="cursor-pointer hover:text-primary transition" @click="ui.openCart">panier</p>
        </li>

        <li v-if="user.profile">
          <p>{{ user.name }}</p>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useUIStore } from '@/stores/ui-store.ts'
import { useUserStore } from '@/stores/user-store.ts'

const ui = useUIStore()
const user = useUserStore()


</script>
