<template>
  <div
    v-if="ui.userMenuOpen"
    :style="{ top: headerHeight + 'px' }"
    class="fixed right-0 w-fit bg-white border-b border-l border-black z-[9999] py-4 px-6 flex flex-col items-start space-y-4 text-lg"
  >
    <template v-if="user.isLoggedIn">
      <p class="mb-6">
        Bonjour {{ user.firstName }}
        <Hand class="wave-hand w-6 h-6 inline-block " />
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
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { ReceiptText, UserRoundPen, PowerOff, Power, Hand } from 'lucide-vue-next'

const user = useUserStore()
const ui = useUIStore()
const router = useRouter()

const headerHeight = ref(0)

function updateHeaderHeight() {
  const header = document.querySelector('header')
  if (header) headerHeight.value = header.offsetHeight
}

const observer = new ResizeObserver(updateHeaderHeight)

onMounted(() => {
  updateHeaderHeight()
  const header = document.querySelector('header')
  if (header) observer.observe(header)
})

onBeforeUnmount(() => observer.disconnect())

function logout() {
  user.logout()
  ui.closeUserMenu()
  router.push('/products')
}
</script>

<style scoped>
.wave-hand {
  transform-origin: bottom center;
  transform: rotate(35deg);
  animation: wave 0.5s ease-in-out 2;
  animation-fill-mode: forwards;
}

@keyframes wave {
  0%   { transform: rotate(35deg); }
  25%  { transform: rotate(10deg); }
  75%  { transform: rotate(55deg); }
  90%  { transform: rotate(37deg); }
  100% { transform: rotate(35deg); }
}
</style>
