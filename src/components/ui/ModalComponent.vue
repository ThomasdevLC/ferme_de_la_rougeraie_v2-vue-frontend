<template>
  <transition name="modal-fade">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- backdrop -->
      <div
        class="absolute inset-0 bg-black/50 backdrop-blur-xs"
        @click="closeOnBackdrop && close()"
      ></div>

      <!-- container -->
      <div
        class="relative bg-white max-w-[90vw] lg:max-w-[50vw] max-h-[90vh] lg:max-h-[75vh] w-full p-6 shadow-lg z-10 overflow-y-auto p-6 md:p-12"
        role="dialog"
        aria-modal="true"
      >
        <!-- close button slot or default -->
        <button
          v-if="closable"
          @click="close()"
          class="absolute top-5 right-5 text-gray-4 hover:text-black"
          aria-label="Fermer"
        >
          <slot name="close-icon ">
            <X class="w-6 h-6 cursor-pointer" stroke-width="1.5" />
          </slot>
        </button>

        <!-- header slot -->
        <header v-if="$slots.header" class="mb-4">
          <slot name="header"></slot>
        </header>

        <!-- main content slot -->
        <section>
          <slot />
        </section>

        <!-- footer slot -->
        <footer v-if="$slots.footer" class="mt-6">
          <slot name="footer"></slot>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import { X } from 'lucide-vue-next'

const { modelValue, closable, closeOnBackdrop } = defineProps({
  modelValue: { type: Boolean, required: true },
  closable: { type: Boolean, default: true },
  closeOnBackdrop: { type: Boolean, default: true },
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

function close() {
  emit('update:modelValue', false)
}
</script>

<style>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
