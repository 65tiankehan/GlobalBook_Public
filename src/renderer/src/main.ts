import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import store from '../src/store'
import router from '../src/router/index'
import naive from 'naive-ui'
import 'animate.css';
const app = createApp(App)
app.use(naive)
app.use(store)
app.use(router)
app.mount('#app')
