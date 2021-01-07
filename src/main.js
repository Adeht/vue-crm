import Vue from 'vue'
import Vuelidate from "vuelidate/src";
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import dateFilter from "@/filters/date.filter"
import currencyFilter from "@/filters/currency.filter"
import localizeFilter from "@/filters/localize.filter"
import tooltipDirective from "@/directives/tooltip.directives"
import messagePlugin from "@/utils/message.plugin"
import Loader from "@/components/app/Loader"
import Paginate from 'vuejs-paginate'
import 'materialize-css/dist/js/materialize.min'

import firebase from "firebase/app"
import "firebase/auth"
import "firebase/database"

Vue.config.productionTip = false
Vue.use(Vuelidate)
Vue.use(messagePlugin)
Vue.filter('date', dateFilter)
Vue.filter('currency', currencyFilter)
Vue.filter('localize', localizeFilter)
Vue.directive('tooltip', tooltipDirective)
Vue.component('Loader', Loader)
Vue.component('Paginate', Paginate)

firebase.initializeApp(  {
  apiKey: "AIzaSyD0cgy9ghvyxJCX2sXUSAm1Ia_ABVpZNJc",
  authDomain: "vue-crm-407f0.firebaseapp.com",
  databaseURL: "https://vue-crm-407f0-default-rtdb.firebaseio.com",
  projectId: "vue-crm-407f0",
  storageBucket: "vue-crm-407f0.appspot.com",
  messagingSenderId: "17034109531",
  appId: "1:17034109531:web:0dd0ba598f93fcd46d957e",
  measurementId: "G-LZB53MNL0P"
})

let app;
firebase.auth().onAuthStateChanged(()=>{
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
})


