import Vue from 'vue'
import moment from 'moment'
import { eventBus } from '../main'
import Gdax from 'gdax'
const gdaxPublicClient = new Gdax.PublicClient('https://api.gdax.com')

const state = {
  availableProducts: [
    // id:"BCH-EUR",display_name:"BCH/EUR",base_currency:"BCH",quote_currency:"EUR",status:"online",... price: '0.00', priceTrend: '', size: '0.0', bid: '0.00', ask: '0.00', volume: '0.0', time: ''
  ],
  products: [],
  savedProductPrices: [],
  timeoutDelayForWatching: 20000,
  timeOutForWatching: 0
}

// getters
const getters = {
  getAllAvailableProducts: state => state.availableProducts,
  getAllProducts: state => state.products,
  getAllSavedProductPrices: state => state.savedProductPrices
}

// actions
const actions = {
  selectProductForWatch ({ commit }, payload) {
    commit('addProduct', payload)
  },
  removeProductFromWatch ({ commit }, payload) {
    commit('removeProduct', payload)
  },
  refreshAllProducts ({ commit }) {
    clearTimeout(state.timeOutForWatching)
    if (state.products.length > 0) {
      eventBus.$emit('saveLastProductPriceEvent')
      for (let product of state.products) {
        this.dispatch('getProductTickerFromGDAX', product)
      }
      const target = this
      state.timeOutForWatching = setTimeout(function () {
        target.dispatch('refreshAllProducts')
      }, state.timeoutDelayForWatching)
    }
  },
  saveProductPriceNow ({ commit }, payload) {
    commit('saveProductPrice', payload)
  },
  removeAllSavedProductPricesNow ({ commit }) {
    commit('removeAllSavedProductPrices')
  },
  async getAllProductsFromGDAX ({ commit }) {
    // [{"id": "BTC-USD","base_currency": "BTC","quote_currency": "USD","base_min_size": "0.01","base_max_size": "10000.00","quote_increment": "0.01"}]
    await gdaxPublicClient.getProducts((error, response, data) => {
      if (error) {
        // need to properly handle this error...
        console.log('getAllProductsFromGDAX error = ')
        console.error(error)
      } else {
        console.log('getAllProductsFromGDAX = ')
        console.log(data)
        commit('addAvailableProducts', data)
      }
    })
  },
  async getProductTickerFromGDAX ({ commit }, product) {
    // {"trade_id": 4729088,"price": "333.99","size": "0.193","bid": "333.98","ask": "333.99","volume": "5957.11914015","time": "2015-11-14T20:46:03.511254Z"}
    await gdaxPublicClient.getProductTicker(product.id, (error, response, data) => {
      if (error) {
        // need to properly handle this error too...
        console.log('getProductTickerFromGDAX error = ')
        console.error(error)
      } else {
        const prod = {
          ...product,
          ...data
        }
        commit('setProduct', prod)
      }
    })
  },
  async getProductHistoricRatesFromGDAX ({ commit }, prodid) {
    // [ time, low, high, open, close, volume ]
    await gdaxPublicClient.getProductHistoricRates(prodid.id, { granularity: 3600 }, (error, response, data) => {
      if (error) {
        // need to properly handle this error too...
        console.log('getProductHistoricRatesFromGDAX error = ')
        console.log(error)
      } else {
        eventBus.$emit('productHistoricRatesUpdatedEvent', data)
      }
    })
  }
}

// mutations
const mutations = {
  addAvailableProducts (state, payload) {
    state.availableProducts = []
    for (const prod of payload) {
      if (prod.status === 'online') {
        const product = {
          price: '0.00',
          priceTrend: '',
          size: '0.0',
          bid: '0.00',
          ask: '0.00',
          volume: '0.0',
          time: '',
          displayName: prod.display_name,
          ...prod
        }
        state.availableProducts.push(product)
      }
    }
    eventBus.$emit('availableProductsUpdatedEvent', state.availableProducts)
  },
  addProduct (state, payload) {
    if (state.products.length < 3) {
      const targetIndex = state.availableProducts.findIndex(o => o.id === payload.id)
      const targetProduct = state.availableProducts.splice(targetIndex, 1).pop()
      const newPriceTrend = 'no change'
      Vue.set(targetProduct, 'priceTrend', newPriceTrend)
      Vue.set(targetProduct, 'watching', true)
      state.products.push(targetProduct)
      state.products.sort((a, b) => {
        return a.displayName < b.displayName ? -1 : a.displayName > b.displayName ? 1 : 0
      })
      this.dispatch('refreshAllProducts')
    }
    eventBus.$emit('productsUpdatedEvent', state.products)
  },
  removeProduct (state, payload) {
    const targetIndex = state.products.findIndex(o => o.id === payload.id)
    const targetProduct = state.products.splice(targetIndex, 1).pop()
    Vue.set(targetProduct, 'price', '0.00')
    Vue.set(targetProduct, 'priceTrend', 'no change')
    Vue.set(targetProduct, 'size', '0.0')
    Vue.set(targetProduct, 'bid', '0.00')
    Vue.set(targetProduct, 'ask', '0.00')
    Vue.set(targetProduct, 'volume', '0.0')
    Vue.set(targetProduct, 'time', '')
    Vue.set(targetProduct, 'watching', false)
    state.availableProducts.push(targetProduct)
    state.availableProducts.sort((a, b) => {
      return a.displayName < b.displayName ? -1 : a.displayName > b.displayName ? 1 : 0
    })
  },
  saveProductPrice (state, payload) {
    const targetIndex = state.savedProductPrices.findIndex(o => o.time === payload.time)
    if (targetIndex === -1) {
      state.savedProductPrices.push(payload)
      state.savedProductPrices.sort((a, b) => {
        return moment(a.time).valueOf() > moment(b.time).valueOf() ? -1 : moment(a.time).valueOf() < moment(b.time).valueOf() ? 1 : 0
      })
    }
  },
  removeAllSavedProductPrices (state) {
    state.savedProductPrices = []
  },
  setProduct (state, payload) {
    const targetIndex = state.products.findIndex(o => o.id === payload.id)
    const targetProduct = state.products[targetIndex]
    const newPriceTrend = 'no change'
    Vue.set(targetProduct, 'price', payload.price)
    Vue.set(targetProduct, 'priceTrend', newPriceTrend)
    Vue.set(targetProduct, 'size', payload.size)
    Vue.set(targetProduct, 'bid', payload.bid)
    Vue.set(targetProduct, 'ask', payload.ask)
    Vue.set(targetProduct, 'volume', payload.volume)
    Vue.set(targetProduct, 'time', payload.time)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
