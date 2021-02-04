import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import axios from 'axios'
import config from "../config.js";
import numeral from 'numeral'


/* ---- */

Vue.prototype.$config = config;
Vue.prototype.$http = axios;

Vue.filter("price", (value) => {
  const number = parseFloat(value);
  if(number>9)
    return numeral(value).format("0,0.00");
  else
    return numeral(value).format("0,0.00000");
});

/* ---- */


Vue.config.productionTip = false;


new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
