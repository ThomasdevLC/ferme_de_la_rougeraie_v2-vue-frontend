<template>
  <div
    v-if="ui.userMenuOpen"
    class="fixed top-[132px] right-0 w-fit bg-white border-b border-l border-black z-[9999] py-4 px-6 flex flex-col items-start space-y-4 text-lg"
  >
    <template v-if="user.isLoggedIn">
      <p class="mb-6">
        Bonjour {{ user.firstName }}
      </p>

      <RouterLink to="/orders" class="block hover:text-primary" @click="ui.closeUserMenu">
        <ReceiptText class="w-6 h-6 inline-block mr-2" />
        Commandes
      </RouterLink>

      <RouterLink
        to="/profile/edit"
        v-if="user.isLoggedIn"
        class="block hover:text-primary"
        @click="ui.closeUserMenu"
      >
        <UserRoundPen class="w-6 h-6 inline-block mr-2" />
        Modifier profil
      </RouterLink>

      <p v-if="user.isLoggedIn" @click="logout()" class="cursor-pointer block hover:text-primary">
        <PowerOff class="w-5 h-5 inline-block mr-2" />
        Déconnexion
      </p>
    </template>

    <template v-else>
      <RouterLink to="/login" class="flex items-center" @click="ui.closeUserMenu">
        <Power class="w-5 h-5 inline-block mr-2" />
        Connexion
      </RouterLink>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user-store'
import { useUIStore } from '@/stores/ui-store'
import { useRouter } from 'vue-router'
import { ReceiptText, UserRoundPen, PowerOff, Power, Hand } from 'lucide-vue-next'

const user = useUserStore()
const ui = useUIStore()
const router = useRouter()

function logout() {
  user.logout()
  ui.closeUserMenu()
  router.push('/products')
}
</script>

