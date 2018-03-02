<template>
  <div id="app">
    <app-header v-bind:headertitle="headertitle"></app-header>
    <div class="product-selector-container" v-show="showProductSelector">
      <span class="all-products-selected" v-show="products.length > 2">Max 3 products have been selected</span>
      <span v-show="availableProducts.length > 0 && products.length < 3">Select products to watch: </span>
      <select v-model="currentProductToWatch" v-show="availableProducts.length > 0 && products.length < 3" v-on:change="handleProductSelectedForWatching">
        <option v-for="product in availableProducts" v-bind:key="product.id" v-bind:value="product">{{ product.display_name }}</option>
      </select>
    </div>
    <router-view />
  </div>
</template>

<script type="text/javascript">
import AppHeader from './components/Header'
import { eventBus } from './main'

export default {
  name: 'App',
  components: {
    'app-header': AppHeader
  },
  data () {
    return {
      showProductSelector: true,
      headertitle: 'Crypto Product Watcher',
      currentProductToWatch: {},
      availableProducts: [],
      products: []
    }
  },
  methods: {
    assignAvailableProducts: function (payload) {
      this.availableProducts = payload
    },
    assignProducts: function (payload) {
      this.products = payload
    },
    handleProductSelectedForWatching: function () {
      if (this.currentProductToWatch) {
        this.$store.dispatch('selectProductForWatch', { id: this.currentProductToWatch.id })
        this.currentProductToWatch = {}
      }
    }
  },
  created () {
    eventBus.$on('availableProductsUpdatedEvent', this.assignAvailableProducts)
    eventBus.$on('productsUpdatedEvent', this.assignProducts)
    eventBus.$on('toggleProductSelectorEvent', toggle => { this.showProductSelector = toggle })
    this.$store.dispatch('getAllProductsFromGDAX')
  },
  beforeDestroy () {
    eventBus.$off('availableProductsUpdatedEvent')
    eventBus.$off('productsUpdatedEvent')
    eventBus.$off('toggleProductSelectorEvent')
  }
}
</script>

<style>
html, button, input, select, textarea, #app,
.pure-g [class *= "pure-u"] {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
}

.pure-g {
  /* pure units are inlinte-block and we want them to center in the window */
  justify-content: center;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#app select {
  margin-left: 10px;
  outline: none;
}

button {
  border-radius: 5px;
  outline: none;
}

.spacer-10-right {
  margin-right: 10px;
}

.text-md {
  font-size: 14px;
}
.text-sm {
  font-size: 12px;
}
.text-xsm {
  font-size: 10px;
}

.need-cursor {
  cursor: pointer;
}
.need-cursor:hover {
  color: #000;
}

.product-selector-container {
  margin: 20px 0px;
}

.all-products-selected {
  color: #ccc;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
