import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { i18n } from './i18n';
import App from './App.vue';

import './styles/reset.scss';
import './styles/main.scss';

const app = createApp(App);

app.use(createPinia());
app.use(i18n);

app.mount('#app');
