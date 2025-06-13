// main.ts
import './assets/main.css'

// 1) Import PrimeVue et les styles
import 'primevue/resources/themes/saga-blue/theme.css'  // choix de thème
import 'primevue/resources/primevue.min.css'            // styles de base
import 'primeicons/primeicons.css'                      // icônes

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

// 2) PrimeVue et composants que tu souhaites globaliser
import PrimeVue from 'primevue/config'
import Button from 'primevue/button'
import Calendar from 'primevue/calendar'

import { initAxiosInterceptors } from '@/services/initAxiosInterceptors'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(PrimeVue, { ripple: true })

app.component('PvButton', Button)
app.component('PvCalendar', Calendar)
// … app.component('Dialog', Dialog), etc.

// 6) Initialise tes intercepteurs Axios
initAxiosInterceptors(router)

// 7) Monte l’application
app.mount('#app')
