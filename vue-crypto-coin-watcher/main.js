import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import moment from 'moment'
import CryptoProduct from './components/CryptoProduct'
import SavedProductPrice from './components/SavedProductPrice'
import ProductsStore from './modules/products'

Vue.use(Vuex)
Vue.component('crypto-product', CryptoProduct)
Vue.component('saved-product-price', SavedProductPrice)

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

Vue.filter('formatDate', value => {
  if (value) {
    return moment(String(value)).format('MMMM Do YYYY, h:mm:ss a')
  }
})

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
  store,
  components: { App },
  template: '<App />'
})
