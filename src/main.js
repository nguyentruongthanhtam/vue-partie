// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import bulma from 'bulma'
import firebase from 'firebase'
import Notify from 'vue2-notify'

Vue.config.productionTip = false
// Set the configuration for your app
// TODO: Replace with your project's config object
var config = {
  apiKey: "AIzaSyA-wx5EkzJa2_sPPVftcs9V8ukAPU9WpV4",
  authDomain: "partie-91bce.firebaseapp.com",
  databaseURL: "https://partie-91bce.firebaseio.com",
  storageBucket: "bucket.appspot.com"
};
firebase.initializeApp(config);
Vue.use(Notify,{
  itemClass: 'notification'
})
const types = {
  info: { itemClass: 'is-info', },
  error: { itemClass: 'is-danger' },
  warning: { itemClass: 'is-warning' },
  success: { itemClass: 'is-success', iconClass: 'fa fa-lg fa-check-circle' }

}

Vue.$notify.setTypes(types);
// Get a reference to the database service

// evenHub for components' communication
Vue.prototype.$eventHub = new Vue()

/* eslint-disable no-new */
new Vue({
  el: '#app',
  bulma,
  router,
  store,
  template: '<App/>',
  components: { App }
})
