<template>
  <div class="pure-u-1 pure-u-md-1-3 pure-u-lg-1-3">
    <div class="crypto-product-view-container">
      <p class="remove-product need-cursor text-sm" v-on:click="handleRemoveProductFromWatching">remove</p>
      <h3>{{ product.displayName }}</h3>
      <p class="text-xsm">{{ product.id }}</p>
      <h2>{{ product.price | formatCurrency }}</h2>
      <p class="text-sm">Last: {{ lastPrice | formatCurrency }}</p>
      <p v-bind:class="priceTrendClass">{{ product.priceTrend }}</p>
      <p>Size: {{ product.size }}</p>
      <p>Bid: {{ product.bid | formatCurrency }}</p>
      <p>Ask: {{ product.ask | formatCurrency }}</p>
      <p>Volume: {{ product.volume }}</p>
      <p class="text-sm">@ {{ product.time | formatDate }}</p>
      <button v-on:click="handleSaveCurrentPrice">Save this price</button>
      <p class="need-cursor" v-on:click="handleGoToMoreInfoPage">More Info</p>
    </div>
  </div>
</template>

<script type="text/javascript">
import { eventBus } from '../main'

export default {
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      lastPrice: '0.00',
      priceTrendClass: ''
    }
  },
  methods: {
    handleSaveCurrentPrice: function () {
      this.$store.dispatch('saveProductPriceNow', { id: this.product.id, display_name: this.product.display_name, time: this.product.time, price: this.product.price })
    },
    handleRemoveProductFromWatching: function () {
      this.$store.dispatch('removeProductFromWatch', { id: this.product.id, display_name: this.product.display_name })
    },
    saveLastProductPrice: function () {
      this.lastPrice = this.product.price
    },
    handleGoToMoreInfoPage: function () {
      eventBus.$emit('toggleProductSelectorEvent', false)
      this.$router.push(`/product/${this.product.id.toLowerCase()}`)
    }
  },
  created () {
    eventBus.$on('saveLastProductPriceEvent', this.saveLastProductPrice)
  },
  updated () {
    this.product.priceTrend = Number(this.lastPrice) < Number(this.product.price) ? 'up' : Number(this.lastPrice) > Number(this.product.price) ? 'down' : 'no change'
    this.priceTrendClass = this.product.priceTrend === 'up' ? 'price-trend-up' : this.product.priceTrend === 'down' ? 'price-trend-down' : ''
  },
  beforeDestroy () {
    eventBus.$off('saveLastProductPriceEvent')
  }
}
</script>

<style scoped>
.crypto-product-view-container {
  margin: 5px;
  padding: 10px;
  border-radius: 20px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
}

.price-trend-up {
  color: green;
}

.price-trend-down {
  color: red;
}

.remove-product {
  text-align: right;
  margin-top: 0px;
}

.bitcoin-bg-color {
  background-color: #F8941A;
}

.litecoin-bg-color {
  background-color: #BEBEBE;
}

.ethereum-bg-color {
  background-color: #487393;
}
</style>
