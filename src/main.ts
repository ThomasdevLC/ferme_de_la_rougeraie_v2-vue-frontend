import './assets/main.css'

import 'primevue/resources/themes/saga-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

import PrimeVue from 'primevue/config'
import Button from 'primevue/button'
import Calendar from 'primevue/calendar'

import { initAxiosInterceptors } from '@/services/interceptors/initAxiosInterceptors.ts'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(PrimeVue, { ripple: true })

app.component('PvButton', Button)
app.component('PvCalendar', Calendar)

initAxiosInterceptors(router)

app.mount('#app')
