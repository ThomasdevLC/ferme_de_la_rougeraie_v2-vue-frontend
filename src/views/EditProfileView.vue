<template>
  <div class="max-w-xl mx-auto mt-16 p-6 bg-white shadow rounded">
    <h2 class="text-xl font-bold mb-4 text-center">Votre profil</h2>

    <!-- Infos existantes (sans ancien téléphone) -->
    <div class="bg-gray-100 p-4 mb-6">
      <div class="text-sm">
        <p><span class="font-medium">Nom :</span> {{ user.profile?.lastName }}</p>
        <p><span class="font-medium">Prénom :</span> {{ user.profile?.firstName }}</p>
        <p><span class="font-medium">Email :</span> {{ user.profile?.email }}</p>
        <p><span class="font-medium">Téléphone :</span> {{ user.profile?.phone }}</p>
      </div>
    </div>

    <!-- Boutons toggle -->
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

    <form @submit.prevent="onSubmit" class="space-y-4">
      <!-- Modification téléphone -->
      <div v-if="updatePhone">
        <div>
          <label class="block text-sm font-medium">Ancien téléphone</label>
          <input v-model="oldPhone" type="text" class="w-full border rounded px-3 py-2 mt-1" />
          <div v-if="errors.oldPhone" class="text-red-600 text-sm mt-1">{{ errors.oldPhone }}</div>
        </div>
        <div>
          <label class="block text-sm font-medium">Nouveau téléphone</label>
          <input v-model="phone" type="text" class="w-full border rounded px-3 py-2 mt-1" />
          <div v-if="errors.phone" class="text-red-600 text-sm mt-1">{{ errors.phone }}</div>
        </div>
      </div>

      <!-- Modification mot de passe -->
      <div v-if="updatePassword">
        <div>
          <label class="block text-sm font-medium">Mot de passe actuel</label>
          <input v-model="oldPassword" type="password" class="w-full border rounded px-3 py-2 mt-1" />
          <div v-if="errors.oldPassword" class="text-red-600 text-sm mt-1">{{ errors.oldPassword }}</div>
        </div>
        <div>
          <label class="block text-sm font-medium">Nouveau mot de passe</label>
          <input v-model="newPassword" type="password" class="w-full border rounded px-3 py-2 mt-1" />
          <div v-if="errors.newPassword" class="text-red-600 text-sm mt-1">{{ errors.newPassword }}</div>
        </div>
        <div>
          <label class="block text-sm font-medium">Confirmer le mot de passe</label>
          <input v-model="confirmPassword" type="password" class="w-full border rounded px-3 py-2 mt-1" />
          <div v-if="errors.confirmPassword" class="text-red-600 text-sm mt-1">{{ errors.confirmPassword }}</div>
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
import { ref, computed } from 'vue'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useUserStore } from '@/stores/user-store'
import { updateUserProfile } from '@/services/user-profile-service'
import type { UserProfileUpdate } from '@/models/user/user-profile-update'
import { handleAxiosError } from '@/utils/handle-axios-error'
import { handleAxiosSuccess } from '@/utils/handle-axios-success'

const user = useUserStore()

const updatePhone = ref(false)
const updatePassword = ref(false)
const successMessage = ref('')

// Schéma dynamique
const schema = computed(() => yup.object({
  oldPhone: yup.string().when([], (val, sch) =>
    updatePhone.value ? sch.required('Ancien téléphone requis') : sch.strip()
  ),
  phone: yup.string().when([], (val, sch) =>
    updatePhone.value ? sch.required('Nouveau téléphone requis') : sch.strip()
  ),
  oldPassword: yup.string().when([], (val, sch) =>
    updatePassword.value ? sch.required('Mot de passe actuel requis') : sch.strip()
  ),
  newPassword: yup.string().when([], (val, sch) =>
    updatePassword.value ? sch
      .required('Nouveau mot de passe requis')
      .min(8, 'Au moins 8 caractères')
      .matches(/[a-z]/, 'Au moins une minuscule')
      .matches(/[A-Z]/, 'Au moins une majuscule')
      .matches(/\d/, 'Au moins un chiffre')
      .matches(/[^\w\s]/, 'Au moins un caractère spécial') : sch.strip()
  ),
  confirmPassword: yup.string().when([], (val, sch) =>
    updatePassword.value ? sch
      .required('Confirmation requise')
      .oneOf([yup.ref('newPassword')], 'Les mots de passe ne correspondent pas') : sch.strip()
  )
}))

// VeeValidate
const { handleSubmit, resetForm, errors } = useForm({
  validationSchema: schema
})

const { value: oldPhone } = useField('oldPhone')
const { value: phone } = useField('phone')
const { value: oldPassword } = useField('oldPassword')
const { value: newPassword } = useField('newPassword')
const { value: confirmPassword } = useField('confirmPassword')

// Toggle
function togglePhone() {
  updatePhone.value = !updatePhone.value
  if (!updatePhone.value) {
    oldPhone.value = ''
    phone.value = ''
  }
}

function togglePassword() {
  updatePassword.value = !updatePassword.value
  if (!updatePassword.value) {
    oldPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
  }
}

// Soumission
const onSubmit = handleSubmit(async (values) => {
  if (!updatePhone.value && !updatePassword.value) return // Protection supplémentaire

  const payload: UserProfileUpdate = {
    phone: updatePhone.value ? values.phone : undefined,
    oldPhone: updatePhone.value ? values.oldPhone : undefined,
    oldPassword: updatePassword.value ? values.oldPassword : undefined,
    plainPassword: updatePassword.value ? values.newPassword : undefined
  }

  try {
    const response = await updateUserProfile(payload)
    successMessage.value = handleAxiosSuccess(response)
    updatePhone.value = false
    updatePassword.value = false
    await user.loadProfile()
    resetForm()
    setTimeout(() => successMessage.value = '', 3000)
  } catch (err) {
    user.error = handleAxiosError(err)
  }
})
</script>
