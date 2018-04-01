// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import moment from "moment"
import App from './App'
import router from './router'
import store from './store'

Vue.config.productionTip = false
/* eslint-disable no-new */
moment.locale('en')
Vue.filter('DateFormatEN', function (dateString) {
  return moment(dateString).format("ll")
})

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
