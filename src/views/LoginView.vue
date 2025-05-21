<template>
  <div class="max-w-md mx-auto mt-16 p-6 bg-white shadow rounded">
    <h2 class="text-xl font-bold mb-4 text-center">Connexion</h2>

    <div v-if="route.query.registered" class="text-green-600 text-sm text-center mb-4">
      ✅ Inscription réussie. Vous pouvez maintenant vous connecter.
    </div>

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
        <input
          v-model="password"
          type="password"
          id="password"
          required
          class="w-full border rounded px-3 py-2 mt-1"
        />
      </div>

      <div v-if="error" class="text-sm text-red-500">{{ error }}</div>

      <button
        type="submit"
        class="w-full bg-primary text-white py-2 px-4 rounded hover:bg-opacity-90"
      >
        Se connecter
      </button>
    </form>
    <div class="text-center mt-4">
      <span>Pas encore inscrit ? </span>
      <a :href="registerUrl" class="text-primary font-medium hover:underline"> Créer un compte </a>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter, useRoute  } from 'vue-router'
import { login } from '@/services/auth-service.ts'
import { useAuthStore } from '@/stores/auth-store.ts'
import { useUserStore } from '@/stores/user-store.ts'

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const userStore = useUserStore()

const registerUrl = `${import.meta.env.VITE_API_BASE_URL}/register`

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
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Échec de la connexion.'
  }
}
</script>
