import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import $http from './plugins/axios';
import config from "../config.js";
import numeral from 'numeral'
import Binance from 'binance-api-node';
import firebase from 'firebase/app'

/* ---- */
firebase.initializeApp(config.setting.firebaseConfig)
Vue.prototype.$db = firebase.firestore();
Vue.prototype.$firebase = firebase;

Vue.prototype.$config = config;

// const time = new Date().getTime();
Vue.prototype.$binance = Binance();
 
/* //////////////////////////////////////// */


Vue.filter("price", (value) => {
  const number = parseFloat(value);
  if (number > 9)
    return numeral(value).format("0,0.00");
  else
    return numeral(value).format("0,0.00000");
});

/* ---- */


Vue.config.prouctionTip = false;

store.dispatch('checkAuth').then(() => {
  new Vue({
    router,
    store,
    vuetify,
    $http,
    render: h => h(App)
  }).$mount('#app')
});
