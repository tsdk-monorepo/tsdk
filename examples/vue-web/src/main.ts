import { createApp } from 'vue';
import { VueQueryPlugin } from '@tanstack/vue-query';
import { getQueryClient } from './vue-query-provider';

import App from './App.vue';

const app = createApp(App);
const queryClient = getQueryClient();
app.use(VueQueryPlugin, {
  queryClient,
});

app.mount('#app');
