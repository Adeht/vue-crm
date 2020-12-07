import Vue from 'vue'
import Vuelidate from "vuelidate/src";
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import dateFilter from "@/filters/date.filter";
import messagePlugin from "@/utils/message.plugin"
import 'materialize-css/dist/js/materialize.min'

import firebase from "firebase/app"
import "firebase/auth"
import "firebase/database"

Vue.config.productionTip = false
Vue.use(Vuelidate)
Vue.use(messagePlugin)
Vue.filter('date', dateFilter)

firebase.initializeApp({
  apiKey: "AIzaSyAjqU2Ah2L1ZccI4M9k1d-tNyru7HVIHu0",
  authDomain: "vue-crm-e159f.firebaseapp.com",
  projectId: "vue-crm-e159f",
  storageBucket: "vue-crm-e159f.appspot.com",
  messagingSenderId: "1053829283647",
  appId: "1:1053829283647:web:7ffeea15c555be81479d8a"
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


