import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import moment from 'moment'
import ProductsStore from './modules/products-store'
import Vuetify from 'vuetify'

Vue.use(Vuetify)
Vue.use(Vuex)

Vue.config.productionTip = false

Vue.filter('formatCurrency', value => {
  const val = Number(value)
  if (typeof val !== 'number') {
    return value
  }
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
  return formatter.format(val)
})

// a version of formatting the date strings with a filter
Vue.filter('formatDateToString', (value, dateFormatStr) =>
  moment(((!value && typeof value !== 'number' && typeof value !== 'string') ? 'Invalid input value' : ((typeof value === 'string') ? value : ((String(value).length < 11) ? value * 1000 : value))))
    .format((typeof dateFormatStr === 'undefined') ? 'MMMM Do YYYY, h:mm:ss a' : dateFormatStr)
)

export const eventBus = new Vue()

export const store = new Vuex.Store({
  modules: {
    ProductsStore
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  moment,
  store,
  components: { App },
  template: '<App />'
})
