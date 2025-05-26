<template>
  <div class="max-w-xl mx-auto mt-16 p-6 bg-white shadow rounded">
    <h2 class="text-xl font-bold mb-4 text-center">Votre profil</h2>

    <div class="bg-gray-100 p-4 mb-6">
      <div class="text-sm">
        <p><span class="font-medium">Nom :</span> {{ user.profile?.lastName }}</p>
        <p><span class="font-medium">Prénom :</span> {{ user.profile?.firstName }}</p>
        <p><span class="font-medium">Email :</span> {{ user.profile?.email }}</p>
        <p><span class="font-medium">Téléphone :</span> {{ user.profile?.phone }}</p>
      </div>
    </div>

    <button
      @click="updatePhone =  !updatePhone"
      class="w-full bg-primary text-white py-2 px-4 rounded hover:bg-opacity-90 mb-4"
    >
      Modifier le téléphone
    </button>

    <button
      @click="updatePassword= !updatePassword"
      class="w-full bg-primary text-white py-2 px-4 rounded hover:bg-opacity-90 mb-4"
    >
      Modifier le mot de passe
    </button>

    <form @submit.prevent="submit" class="space-y-4">
      <div v-if="updatePhone">
        <div>
          <label class="block text-sm font-medium">Ancien téléphone</label>
          <input
            v-model="form.oldPhone"
            type="text"
            class="w-full border rounded px-3 py-2 mt-1"
          />
        </div>
        <div>
          <label class="block text-sm font-medium">Nouveau téléphone</label>
          <input
            v-model="form.phone"
            type="text"
            class="w-full border rounded px-3 py-2 mt-1"
          />
        </div>
      </div>

      <div v-if="updatePassword">
        <div>
          <label class="block text-sm font-medium">Mot de passe actuel</label>
          <input
            v-model="form.oldPassword"
            type="password"
            class="w-full border rounded px-3 py-2 mt-1"
          />
        </div>

        <div>
          <label class="block text-sm font-medium">Nouveau mot de passe</label>
          <input
            v-model="form.newPassword"
            type="password"
            class="w-full border rounded px-3 py-2 mt-1"
          />
        </div>

        <div>
          <label class="block text-sm font-medium">Confirmer le nouveau mot de passe</label>
          <input
            v-model="form.confirmPassword"
            type="password"
            class="w-full border rounded px-3 py-2 mt-1"
          />
        </div>
      </div>

      <div v-if="user.error" class="text-sm text-red-500">{{ user.error }}</div>

      <button
        v-if="updatePhone || updatePassword"
        type="submit"
        class="w-full bg-primary text-white py-2 px-4 rounded hover:bg-opacity-90"
      >
        Enregistrer
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/user-store'
import { useRouter } from 'vue-router'
import { handleAxiosError } from '@/utils/handle-axios-error.ts'

const user = useUserStore()
const router = useRouter()
const updatePhone = ref(false)
const updatePassword = ref(false)

const form = reactive({
  oldPhone: '',
  phone: '',
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

onMounted(() => {
  if (user.profile) {
    form.phone = user.profile.phone
  }
})

const submit = async () => {
  user.error = ''

  if (form.newPassword !== form.confirmPassword) {
    user.error = 'Les nouveaux mots de passe ne correspondent pas'
    return
  }

  try {
    await user.updateProfile({
      phone: form.phone,
      oldPassword: form.oldPassword,
      plainPassword: form.newPassword,
    })

    if (!user.error) {
      router.push('/products')
    }
  } catch (error) {
    user.error = handleAxiosError(error)
  }
}
</script>
