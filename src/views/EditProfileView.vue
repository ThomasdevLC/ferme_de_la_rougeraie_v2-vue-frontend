<template>
  <div class="p-4 md:p-0 relative flex justify-center">
    <div class="w-full md:w-fit md:mt-16 p-6 bg-white border border-gray-2 rounded-sm">
      <h1 class="text-3xl text-center md:text-start font-bold mb-6">Votre profil</h1>

      <div>
        <div class="flex flex-col md:flex-row justify-around mb-6">
          <div class="flex gap-2 items-center mb-2 md:mb-0">
            <IdCard class="w-12 h-12" :stroke-width="1" />
            <p class="font-bold text-2xl">
              <span> {{ user.profile?.firstName }}&nbsp;</span
              ><span>{{ user.profile?.lastName }}</span>
            </p>
          </div>
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex gap-2 items-center">
              <Mail class="w-7 h-7" :stroke-width="1" />
              <p class="text-xl">{{ user.profile?.email }}</p>
            </div>
            <div class="flex gap-2 items-center">
              <Phone class="w-7 h-7" :stroke-width="1" />
              <p class="text-xl">{{ user.profile?.phone }}</p>
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row justify-center gap-4 text-sm">
          <button
            @click="togglePhone"
            class="w-full md:w-40 bg-primary text-white py-2 px-4 rounded-sm hover:bg-opacity-90 cursor-pointer flex items-center justify-center gap-2"
          >
            <template v-if="updatePhone">
              <PencilOff class="w-5 h-5" :stroke-width="1" />
              téléphone
            </template>
            <template v-else>
              <Pencil class="w-5 h-5" :stroke-width="1" />
              téléphone
            </template>
          </button>

          <button
            @click="togglePassword"
            class="w-full md:w-40 bg-primary text-white py-2 px-4 rounded-sm hover:bg-opacity-90 cursor-pointer flex items-center justify-center gap-2"
          >
            <template v-if="updatePassword">
              <PencilOff class="w-5 h-5" :stroke-width="1" />
              mot de passe
            </template>
            <template v-else>
              <Pencil class="w-5 h-5" :stroke-width="1" />
              mot de passe
            </template>
          </button>

          <button
            @click="user.logout()"
            class="w-full md:w-fit bg-red-500 text-white py-2 px-4 rounded-sm hover:bg-opacity-90 cursor-pointer flex items-center justify-center gap-2"
          >
            <UserRoundX class="w-5 h-5" :stroke-width="1" />
            Suppression compte
          </button>
        </div>
      </div>

      <form @submit.prevent="onSubmit" class="space-y-4 md:px-8 mt-6">
        <!-- Modification téléphone -->
        <div v-if="updatePhone" class="flex flex-col gap-2">
          <div>
            <label class="block text-sm font-medium">Ancien téléphone</label>
            <input v-model="oldPhone" type="text" class="w-full border rounded px-3 py-2 mt-1" />
            <div v-if="errors.oldPhone" class="text-red-600 text-sm mt-1">
              {{ errors.oldPhone }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium">Nouveau téléphone</label>
            <input v-model="phone" type="text" class="w-full border rounded px-3 py-2 mt-1" />
            <div v-if="errors.phone" class="text-red-600 text-sm mt-1">{{ errors.phone }}</div>
          </div>
        </div>

        <!-- Modification mot de passe -->
        <div v-if="updatePassword" class="flex flex-col gap-2">
          <div>
            <label class="block text-sm font-medium">Mot de passe actuel</label>
            <input
              v-model="oldPassword"
              type="password"
              class="w-full border rounded px-3 py-2 mt-1"
            />
            <div v-if="errors.oldPassword" class="text-red-600 text-sm mt-1">
              {{ errors.oldPassword }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium">Nouveau mot de passe</label>
            <input
              v-model="newPassword"
              type="password"
              class="w-full border rounded px-3 py-2 mt-1"
            />
            <div v-if="errors.newPassword" class="text-red-600 text-sm mt-1">
              {{ errors.newPassword }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium">Confirmer le mot de passe</label>
            <input
              v-model="confirmPassword"
              type="password"
              class="w-full border rounded px-3 py-2 mt-1"
            />
            <div v-if="errors.confirmPassword" class="text-red-600 text-sm mt-1">
              {{ errors.confirmPassword }}
            </div>
          </div>
        </div>

        <div class="flex justify-center">
          <button
            v-if="updatePhone || updatePassword"
            type="submit"
            class="cursor-pointer w-fit bg-primary text-white py-2 px-4 rounded-sm hover:bg-opacity-90"
          >
            Enregistrer
          </button>
        </div>

        <p v-if="user.error" class="mb-4 p-3 bg-red-100 text-red-800 text-center rounded">
          <CircleX class="inline-block mr-2" :stroke-width="1" />
          {{ user.error }}
        </p>
        <p v-else-if="successMessage" class="mb-4 p-3 bg-green-100 text-green-800 text-center rounded">
          <Check class="inline-block mr-2" :stroke-width="1" />
          {{ successMessage }}
        </p>
      </form>
    </div>
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
import { IdCard, Mail, Phone, Pencil, PencilOff, UserRoundX , CircleX, Check  } from 'lucide-vue-next'

const user = useUserStore()

const updatePhone = ref(false)
const updatePassword = ref(false)
const successMessage = ref('')

const schema = computed(() =>
  yup.object({
    oldPhone: yup
      .string()
      .when([], (val, sch) =>
        updatePhone.value ? sch.required('Ancien téléphone requis') : sch.strip(),
      ),
    phone: yup
      .string()
      .when([], (val, sch) =>
        updatePhone.value ? sch.required('Nouveau téléphone requis') : sch.strip(),
      ),
    oldPassword: yup
      .string()
      .when([], (val, sch) =>
        updatePassword.value ? sch.required('Mot de passe actuel requis') : sch.strip(),
      ),
    newPassword: yup.string().when([], (val, sch) =>
      updatePassword.value
        ? sch
            .required('Nouveau mot de passe requis')
            .min(8, 'Au moins 8 caractères')
            .matches(/[a-z]/, 'Au moins une minuscule')
            .matches(/[A-Z]/, 'Au moins une majuscule')
            .matches(/\d/, 'Au moins un chiffre')
            .matches(/[^\w\s]/, 'Au moins un caractère spécial')
        : sch.strip(),
    ),
    confirmPassword: yup
      .string()
      .when([], (val, sch) =>
        updatePassword.value
          ? sch
              .required('Confirmation requise')
              .oneOf([yup.ref('newPassword')], 'Les mots de passe ne correspondent pas')
          : sch.strip(),
      ),
  }),
)

// VeeValidate
const { handleSubmit, resetForm, errors } = useForm({
  validationSchema: schema,
})

const { value: oldPhone } = useField('oldPhone')
const { value: phone } = useField('phone')
const { value: oldPassword } = useField('oldPassword')
const { value: newPassword } = useField('newPassword')
const { value: confirmPassword } = useField('confirmPassword')

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

const onSubmit = handleSubmit(async (values) => {
  if (!updatePhone.value && !updatePassword.value) return

  const payload: UserProfileUpdate = {
    phone: updatePhone.value ? values.phone : undefined,
    oldPhone: updatePhone.value ? values.oldPhone : undefined,
    oldPassword: updatePassword.value ? values.oldPassword : undefined,
    plainPassword: updatePassword.value ? values.newPassword : undefined,
  }

  try {
    const response = await updateUserProfile(payload)
    successMessage.value = handleAxiosSuccess(response)
    updatePhone.value = false
    updatePassword.value = false
    await user.loadProfile()
    resetForm()
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (err) {
    user.error = handleAxiosError(err)
    setTimeout(() => {
      user.error = ''
      updatePhone.value = false
      updatePassword.value = false
      resetForm()
    }, 3000)

  }
})
</script>
