<template>
  <div class="p-4 md:p-0 flex justify-center min-h-screen">
    <div class="flex flex-col gap-4 w-full md:w-fit md:max-w-2xl pt-60">
    <div class="flex items-center gap-4 mb-6">
      <h1 class="text-2xl font-bold whitespace-nowrap">Votre profil</h1>
      <div class="flex-1 h-px bg-black"></div>
    </div>
    <div class="w-full md:w-fit p-6 bg-white border border-gray-2 rounded-sm">

      <div>
        <div class="flex flex-col text-md md:flex-row justify-around mb-6 space-x-4">
          <div class="flex gap-2 items-center mb-2 md:mb-0">
            <IdCard class="w-12 h-12" :stroke-width="1" />
            <p class="font-bold">
              <span> {{ userStore.profile?.firstName }}&nbsp;</span
              ><span>{{ userStore.profile?.lastName }}</span>
            </p>
          </div>
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex gap-2 items-center">
              <Mail class="w-7 h-7" :stroke-width="1" />
              <p class="">{{ userStore.profile?.email }}</p>
            </div>
            <div class="flex gap-2 items-center">
              <Phone class="w-6 h-6" :stroke-width="1" />
              <p class="">{{ userStore.profile?.phone }}</p>
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row justify-center gap-4 text-xs">
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
            @click="ui.openConfirmDeleteModal()"
            class="w-full md:w-fit bg-red-500 text-white py-2 px-4 rounded-sm hover:bg-opacity-90 cursor-pointer flex items-center justify-center gap-2"
          >
            <UserRoundX class="w-5 h-5" :stroke-width="1" />
            Suppression compte
          </button>
        </div>

        <ModalComponent
          :modelValue="ui.confirmDeleteModalOpen"
          @update:modelValue="(val) => (val ? null : ui.closeConfirmDeleteModal())"
          :closable="false"
          :closeOnBackdrop="false"
        >
          <template #header>
            <h2 class="text-xl font-bold">Confirmation</h2>
          </template>

          <p>Êtes-vous sûr de vouloir supprimer définitivement votre compte ?</p>

          <template #footer>
            <div class="text-sm flex justify-end gap-4">
              <button
                @click="ui.closeConfirmDeleteModal()"
                class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
              >
                Annuler
              </button>
              <button
                @click="confirmDelete()"
                class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
              >
                Oui, supprimer
              </button>
            </div>
          </template>
        </ModalComponent>
      </div>


    <div>
      <form @submit.prevent="onSubmit" class="space-y-4 md:px-8 mt-6">
        <!-- Modification téléphone -->
        <div v-if="updatePhone" class="flex flex-col gap-2">
          <div>
            <label class="block text-sm font-medium">Ancien téléphone</label>
            <input v-model="oldPhone" type="text" class="w-full border rounded px-3 py-2 mt-1" @focus="setErrors({})" />
            <div v-if="errors.oldPhone" class="text-red-600 text-sm mt-1">
              {{ errors.oldPhone }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium">Nouveau téléphone</label>
            <input v-model="phone" type="text" class="w-full border rounded px-3 py-2 mt-1" @focus="setErrors({})" />
            <div v-if="errors.phone" class="text-red-600 text-sm mt-1">{{ errors.phone }}</div>
          </div>
        </div>

        <!-- Modification mot de passe -->
        <div v-if="updatePassword" class="flex flex-col gap-2">
          <div>
            <label class="block text-sm font-medium">Mot de passe actuel</label>
            <div class="relative mt-1">
              <input
                v-model="oldPassword"
                :type="showOldPassword ? 'text' : 'password'"
                autocomplete="new-password"
                class="w-full border rounded px-3 py-2 pr-10"
                @focus="setErrors({})"
              />
              <button type="button" @click="showOldPassword = !showOldPassword" class="cursor-pointer absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700">
                <component :is="showOldPassword ? EyeOff : Eye" class="w-4 h-4" stroke-width="1.5" />
              </button>
            </div>
            <div v-if="errors.oldPassword" class="text-red-600 text-sm mt-1">
              {{ errors.oldPassword }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium">Nouveau mot de passe</label>
            <div class="relative mt-1">
              <input
                v-model="newPassword"
                :type="showNewPassword ? 'text' : 'password'"
                class="w-full border rounded px-3 py-2 pr-10"
                @focus="setErrors({})"
              />
              <button type="button" @click="showNewPassword = !showNewPassword" class="cursor-pointer absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700">
                <component :is="showNewPassword ? EyeOff : Eye" class="w-4 h-4" stroke-width="1.5" />
              </button>
            </div>
            <div v-if="errors.newPassword" class="text-red-600 text-sm mt-1">
              {{ errors.newPassword }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium">Confirmer le mot de passe</label>
            <div class="relative mt-1">
              <input
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                class="w-full border rounded px-3 py-2 pr-10"
                @focus="setErrors({})"
              />
              <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="cursor-pointer absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700">
                <component :is="showConfirmPassword ? EyeOff : Eye" class="w-4 h-4" stroke-width="1.5" />
              </button>
            </div>
            <div v-if="errors.confirmPassword" class="text-red-600 text-sm mt-1">
              {{ errors.confirmPassword }}
            </div>
          </div>
        </div>

        <div class="flex justify-center">
          <button
            v-if="updatePhone || updatePassword"
            type="submit"
            class="cursor-pointer w-fit bg-primary text-sm text-white py-2 px-4 rounded-sm hover:bg-opacity-90"
          >
            Enregistrer
          </button>
        </div>

        <p v-if="error" class="mb-4 p-3 bg-red-100 text-red-800 text-center rounded text-sm max-w-sm mx-auto">
          <CircleX class="inline-block mr-2" :stroke-width="1" />
          {{ error }}
        </p>
        <p
          v-else-if="successMessage"
          class="mb-4 p-3 bg-green-100 text-green-800 text-center rounded"
        >
          <Check class="inline-block mr-2" :stroke-width="1" />
          {{ successMessage }}
        </p>
      </form>
    </div>
    </div>
    </div>
  </div>

</template>
<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import type { UserProfileUpdate } from '@/models/user/user-profile-update'
import { useUserStore } from '@/stores/user-store'
import { useUIStore } from '@/stores/ui-store.ts'
import { handleAxiosError } from '@/utils/handle-axios-error'
import { handleAxiosSuccess } from '@/utils/handle-axios-success'
import { IdCard, Mail, Phone, Pencil, PencilOff, UserRoundX, CircleX, Check, Eye, EyeOff } from 'lucide-vue-next'
import ModalComponent from '@/components/ui/ModalComponent.vue'

const userStore = useUserStore()
const ui = useUIStore()
const router = useRouter()

const updatePhone = ref(false)
const showOldPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const updatePassword = ref(false)
const successMessage = ref('')
const error = ref<string>('')

const FRENCH_PHONE_REGEX = /^0[1-9]\d{8}$/


onMounted(async () => {
  if (!userStore.profile) {
    {
      await userStore.loadProfile()
    }
  }
})

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
const { handleSubmit, resetForm, setErrors, errors } = useForm({
  validationSchema: schema,
  validateOnMount: false,
})

const { value: oldPhone } = useField('oldPhone', undefined, { validateOnMount: false, validateOnValueUpdate: false })
const { value: phone } = useField('phone', undefined, { validateOnMount: false, validateOnValueUpdate: false })
const { value: oldPassword } = useField('oldPassword', undefined, { validateOnMount: false, validateOnValueUpdate: false })
const { value: newPassword } = useField('newPassword', undefined, { validateOnMount: false, validateOnValueUpdate: false })
const { value: confirmPassword } = useField('confirmPassword', undefined, { validateOnMount: false, validateOnValueUpdate: false })

watch([oldPhone, phone, oldPassword, newPassword, confirmPassword], () => {
  error.value = ''
})

function togglePhone() {
  updatePhone.value = !updatePhone.value
  setErrors({})
  if (!updatePhone.value) {
    oldPhone.value = ''
    phone.value = ''
  } else {
    updatePassword.value = false
    oldPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
  }
}

function togglePassword() {
  updatePassword.value = !updatePassword.value
  setErrors({})
  if (!updatePassword.value) {
    oldPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
  } else {
    updatePhone.value = false
    oldPhone.value = ''
    phone.value = ''
  }
}


const onSubmit = handleSubmit(async (values) => {
  if (updatePhone.value) {
    if (!FRENCH_PHONE_REGEX.test(values.phone)) {
      error.value = 'Le numéro doit être au format français (10 chiffres, commençant par 0)'
      return
    }
  }
  if (!updatePhone.value && !updatePassword.value) return

  const payload: UserProfileUpdate = {
    phone: updatePhone.value ? values.phone : undefined,
    oldPhone: updatePhone.value ? values.oldPhone : undefined,
    oldPassword: updatePassword.value ? values.oldPassword : undefined,
    plainPassword: updatePassword.value ? values.newPassword : undefined,
  }

  try {
    const response = await userStore.updateUserProfile(payload)
    successMessage.value = handleAxiosSuccess(response)
    updatePhone.value = false
    updatePassword.value = false
    await userStore.loadProfile()
    resetForm()
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (err) {
    error.value = handleAxiosError(err)
    setTimeout(() => {
      error.value = ''
      updatePhone.value = false
      updatePassword.value = false
      resetForm()
    }, 5000)
  }
})

async function confirmDelete() {
  ui.closeConfirmDeleteModal()

  try {
    const { data } = await userStore.deleteUserAccount()
    successMessage.value = data.message

    setTimeout(() => {
      successMessage.value = ''
      router.push('/login')
      userStore.logout()
    }, 3000)
  } catch (err: unknown) {
    error.value = handleAxiosError(err)
    setTimeout(() => {
      error.value = ''
    }, 3000)
  }
}
</script>
