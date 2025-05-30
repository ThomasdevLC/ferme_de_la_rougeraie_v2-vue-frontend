<template>

  <ModalComponent
    v-model="showSuccessModal"
    :closable="true"
    :close-on-backdrop="true"
  >
    <div  class="flex flex-col items-center justify-center text-center p-8 ">
      <CircleCheckBig
        class="ThumbsUp tilt-n-move text-green-500 w-16 h-16 mb-4"
      />

      <div  class="circle-wrap ">
        <div class="circle-lg"></div>
      </div>
      <div class="dots-wrap">
        <div class="dot dot--t"></div>
        <div class="dot dot--tr"></div>
        <div class="dot dot--br"></div>
        <div class="dot dot--b"></div>
        <div class="dot dot--bl"></div>
        <div class="dot dot--tl"></div>
      </div>
      <p v-if="showRegisterSuccessModal" class="mt-4 text-lg">Inscription réussie. Vous pouvez maintenant vous connecter</p>
      <p v-else class="mt-4 text-lg">Mot de passe réinitialisé. Vous pouvez maintenant vous connecter</p>
    </div>

  </ModalComponent>

  <div class="max-w-md mx-auto p-6 bg-white shadow rounded relative ">
    <h2 class="text-xl font-bold mb-4 text-center">Connexion</h2>

    <form @submit.prevent="handleLogin" class="space-y-4">
      <div>
        <label for="email" class="block text-sm font-medium">Email</label>
        <input
          v-model="email"
          type="email"
          id="email"
          required
          class="w-full border rounded px-3 py-2 mt-1"
        />
      </div>

      <div>
        <label for="password" class="block text-sm font-medium">Mot de passe</label>
        <div class="relative mt-1">
          <!-- Le champ passe de "password" à "text" selon showPassword -->
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            id="password"
            required
            class="w-full border rounded px-3 py-2 pr-10"
          />
          <!-- Bouton de toggle -->
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="cursor-pointer  absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
            :aria-label="showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
          >
            <component
              :is="showPassword ? EyeOff : Eye"
              class="w-5 h-5"
              stroke-width="1.5"
            />
          </button>
        </div>
      </div>

      <div v-if="error" class="text-sm text-red-500">{{ error }}</div>

      <button
        type="submit"
        class="w-full bg-primary text-white py-2 px-4 rounded hover:bg-opacity-90 cursor-pointer"
      >
        Se connecter
      </button>
    </form>
    <div class="text-center mt-4">
      <span>Pas encore inscrit ? </span>
      <a :href="registerUrl" class="text-primary font-medium hover:underline"> Créer un compte </a>
    </div>
    <div class="text-center mt-4">
      <a :href="resetPasswordUrl" class="text-primary font-medium hover:underline"
        >Mot de passe oublié ?</a
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
import '@/assets/css/modal-animations.css'
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { login } from '@/services/auth-service.ts'
import { useAuthStore } from '@/stores/auth-store.ts'
import { useUserStore } from '@/stores/user-store.ts'
import { useCartStore } from '@/stores/cart-store.ts'
import { useUIStore } from '@/stores/ui-store.ts'
import { CircleCheckBig } from 'lucide-vue-next'
import ModalComponent from '@/components/ui/ModalComponent.vue'
import { Eye, EyeOff } from 'lucide-vue-next'

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const userStore = useUserStore()

const registerUrl = `${import.meta.env.VITE_API_BASE_URL}/register`
const resetPasswordUrl = `${import.meta.env.VITE_API_BASE_URL}/reset-password`

const cart = useCartStore()
const ui = useUIStore()

const showPassword = ref(false)


const showRegisterSuccessModal = ref(false)
const showResetSuccessModal = ref(false)

if (route.query.registered) {
  showRegisterSuccessModal.value = true
  setTimeout(() => {
    showRegisterSuccessModal.value = false
    router.replace({ path: route.path, query: {} })
    router.push('/login')
  }, 5000)
}

if (route.query.reset) {
  showResetSuccessModal.value = true
  setTimeout(() => {
    showResetSuccessModal.value = false
    router.replace({ path: route.path, query: {} })
    router.push('/login')
  }, 5000)
}

const showSuccessModal = computed(() =>
  showRegisterSuccessModal.value || showResetSuccessModal.value
)

const handleLogin = async () => {
  error.value = ''

  try {
    const response = await login({
      email: email.value,
      password: password.value,
    })

    const token = response.data.token

    auth.setToken(token)
    await userStore.loadProfile()
    await router.push('/products')

    if (!cart.isEmpty) {
      ui.openCart()
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Échec de la connexion.'
  }
}
</script>

