<template>
  <div class="max-w-md mx-auto mt-16 p-6 bg-white shadow rounded">
    <h2 class="text-xl font-bold mb-4 text-center">Modifier mon profil</h2>

    <form @submit.prevent="submit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium">Téléphone</label>
        <input
          v-model="form.phone"
          type="text"
          class="w-full border rounded px-3 py-2 mt-1"
        />
      </div>

      <div>
        <label class="block text-sm font-medium">Nouveau mot de passe</label>
        <input
          v-model="form.plainPassword"
          type="password"
          class="w-full border rounded px-3 py-2 mt-1"
        />
      </div>

      <div v-if="user.error" class="text-sm text-red-500">{{ user.error }}</div>

      <button
        type="submit"
        class="w-full bg-primary text-white py-2 px-4 rounded hover:bg-opacity-90"
      >
        Enregistrer
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { useUserStore } from '@/stores/user-store'
import { useRouter } from 'vue-router'

const user = useUserStore()
const router = useRouter()

const form = reactive({
  phone: '',
  plainPassword: '',
})

onMounted(() => {
  if (user.profile) {
    form.phone = user.profile.phone
  }
})

const submit = async () => {
  await user.updateProfile({
    phone: form.phone,
    plainPassword: form.plainPassword || null,
  })

  if (!user.error) {
    router.push('/products') // ou autre page de confirmation
  }
}
</script>
