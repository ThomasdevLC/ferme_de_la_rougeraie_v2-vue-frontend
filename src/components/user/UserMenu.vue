<template>
  <div
    v-if="ui.userMenuOpen"
    class="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50 py-2 px-4"
  >
    <template v-if="user.isLoggedIn">
      <p class="text-sm mb-2">Bonjour, {{ user.name }}</p>
      <RouterLink to="/orders" class="block text-sm text-primary hover:underline" @click="ui.closeUserMenu">
        Mes commandes
      </RouterLink>
    </template>

    <template v-else>
      <RouterLink to="/login" class="block text-sm text-primary hover:underline" @click="ui.closeUserMenu">
        Connexion
      </RouterLink>
    </template>

    <RouterLink to="/profile/edit" v-if="user.isLoggedIn" class="block text-sm text-primary hover:underline" @click="ui.closeUserMenu" >
      Modifier profil
    </RouterLink>


    <p v-if="user.isLoggedIn" @click="logout()" class="cursor-pointer" >
      Se déconnecter
    </p>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user-store'
import { useUIStore } from '@/stores/ui-store'
import {  useRouter } from 'vue-router'

const user = useUserStore()
const ui = useUIStore()
const router = useRouter()

function logout() {
  user.logout()
  ui.closeUserMenu()
  router.push('/products')
}

</script>
