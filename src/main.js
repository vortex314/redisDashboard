/*jshint esversion: 6 */

import Vue from 'vue';
import App from './App.vue';

import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import vuetify from './plugins/vuetify';

Vue.use(Vuetify);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  vuetify:vuetify,
}).$mount('#app');



