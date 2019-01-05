import Vue from 'vue'

// Components
import './components'

// Plugins
import './plugins/vuetify'

import App from './App.vue'
//import router from './router'

Vue.config.productionTip = false

Vue.filter('currency', function(value) {
  if (typeof value != 'undefined') {
    const v = value == 0 ? value : value.toString().slice(0, -3) * -1
    return '$' + parseFloat(v).toFixed(2)
  }

  return value
})

new Vue({
  //  router,
  render: function(h) {
    return h(App)
  }
}).$mount('#app')
