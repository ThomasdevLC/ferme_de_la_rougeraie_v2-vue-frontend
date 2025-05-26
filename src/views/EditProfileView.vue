<template>
  <div class="max-w-xl mx-auto mt-16 p-6 bg-white shadow rounded">
    <h2 class="text-xl font-bold mb-4 text-center">Votre profil</h2>

    <!-- Affichage des infos existantes -->
    <div class="bg-gray-100 p-4 mb-6">
      <div class="text-sm">
        <p><span class="font-medium">Nom :</span> {{ user.profile?.lastName }}</p>
        <p><span class="font-medium">Prénom :</span> {{ user.profile?.firstName }}</p>
        <p><span class="font-medium">Email :</span> {{ user.profile?.email }}</p>
        <p><span class="font-medium">Téléphone :</span> {{ user.profile?.phone }}</p>
      </div>
    </div>

    <!-- Boutons Toggle -->
    <button
      @click="togglePhone"
      class="w-full bg-primary text-white py-2 px-4 rounded hover:bg-opacity-90 mb-4"
    >
      {{ updatePhone ? 'Annuler la modification du téléphone' : 'Modifier le téléphone' }}
    </button>

    <button
      @click="togglePassword"
      class="w-full bg-primary text-white py-2 px-4 rounded hover:bg-opacity-90 mb-4"
    >
      {{ updatePassword ? 'Annuler la modification du mot de passe' : 'Modifier le mot de passe' }}
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
            placeholder="Entrez le nouveau numéro"
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

      <button
        v-if="updatePhone || updatePassword"
        type="submit"
        class="w-full bg-primary text-white py-2 px-4 rounded hover:bg-opacity-90"
      >
        Enregistrer
      </button>

      <div v-if="user.error" class="mb-4 p-3 bg-red-100 text-red-800 rounded">
        {{ user.error }}
      </div>
      <div v-else-if="successMessage" class="mb-4 p-3 bg-green-100 text-green-800 rounded">
        {{ successMessage }}
      </div>

    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/user-store'
import { handleAxiosError } from '@/utils/handle-axios-error'
import { handleAxiosSuccess } from '@/utils/handle-axios-success'
import { a } from 'vitest/dist/chunks/suite.d.FvehnV49'

const user = useUserStore()

const updatePhone = ref(false)
const updatePassword = ref(false)
const successMessage = ref('')

const form = reactive({
  oldPhone: '',
  phone: '',
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

onMounted(() => {
  if (user.profile) {
    form.oldPhone = user.profile.phone
    form.phone = ''
  }
})

function togglePhone() {
  updatePhone.value = !updatePhone.value
  if (updatePhone.value) {
    form.phone = ''
  } else if (user.profile) {
    form.oldPhone = user.profile.phone
    form.phone = user.profile.phone
  }
}

function togglePassword() {
  updatePassword.value = !updatePassword.value
  if (!updatePassword.value) {
    form.oldPassword = ''
    form.newPassword = ''
    form.confirmPassword = ''
  }
}

const submit = async () => {
  user.error = null
  successMessage.value = ''

  if (updatePassword.value && form.newPassword !== form.confirmPassword) {
    user.error = 'Les nouveaux mots de passe ne correspondent pas'
    return
  }

  try {
    const response = await user.updateProfile({
      oldPhone:     updatePhone.value ? form.oldPhone : undefined,
      phone:        form.phone,
      oldPassword:  updatePassword.value ? form.oldPassword : undefined,
      plainPassword:updatePassword.value ? form.newPassword : undefined,
    })

    successMessage.value = handleAxiosSuccess(response)
    updatePhone.value = false ; updatePassword.value = false;
    await user.loadProfile()
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)

  } catch (error) {
    user.error = handleAxiosError(error)
  }
}
</script>
