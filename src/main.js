import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import axios from 'axios'
import config from "../config.js";
import numeral from 'numeral'
import Binance from 'binance-api-node';
import firebase from 'firebase/app'

/* ---- */
firebase.initializeApp(config.setting.firebaseConfig)
Vue.prototype.$db = firebase.firestore();
Vue.prototype.$firebase = firebase;

Vue.prototype.$config = config;
Vue.prototype.$http = axios;

// const time = new Date().getTime();
Vue.prototype.$binance = Binance(

  /* //////////////////////////////////////// */

  // let client = Binance(
  {
    apiKey: config.setting.apiKey,
    apiSecret: config.setting.secretKey,
    // getTime: time
  }
);

// client.book({ symbol: 'ETHBTC' }).then(res => console.log('book', res));

// client.accountInfo().then(res => console.log('accountInfo', res));


/* //////////////////////////////////////// */

// client.exchangeInfo().then(res => console.log('exchangeInfo', res));
// client.allOrders({ symbol: 'ETHBTC' }).then(res => console.log('allOrders', res));
// client.time().then(time => console.log(time))

//  client.ws.user(msg => {
//   console.log(msg)
// })

// client.accountInfo()
//   .then((res) => { console.log("res", res); })
//   .catch((error) => { console.log("error", error); });

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
    render: h => h(App)
  }).$mount('#app')
});
