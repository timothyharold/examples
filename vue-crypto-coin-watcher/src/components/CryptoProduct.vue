<template>
  <v-card class="text-xs-center text-sm-center black--text crypto-card d-inline-block ma-2">
    <v-card-actions>
      <v-layout justify-end>
        <v-btn flat icon color="primary lighten-1" @click="handleRemoveProductFromWatching">
          <v-icon>highlight_off</v-icon>
        </v-btn>
      </v-layout>
    </v-card-actions>
    <v-card-text>
      <h2>{{ product.displayName }}</h2>
      <p>{{ product.id }}</p>
      <h2>{{ product.price | formatCurrency }}</h2>
      <p>Last: {{ lastPrice | formatCurrency }}</p>
      <p :class="priceTrendClass">{{ product.priceTrend }}</p>
      <p>Size: {{ product.size }}</p>
      <p>Bid: {{ product.bid | formatCurrency }}</p>
      <p>Ask: {{ product.ask | formatCurrency }}</p>
      <p>Volume: {{ product.volume }}</p>
      <p>as of: {{ product.time | formatDateToString }}</p>
    </v-card-text>
    <v-card-actions>
      <v-btn flat @click="handleSaveCurrentPrice">SAVE PRICE</v-btn>
      <v-btn flat color="primary" @click="handleGoToMoreInfoPage">MORE INFO</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script type="text/javascript">
import moment from 'moment'
import { eventBus } from '../main'

export default {
  name: 'CryptoProduct',
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
      console.log('this.product.time = ' + moment(this.product.time).valueOf())
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
.crypto-card {
  max-width: 320px;
}
.price-trend-up {
  font-weight: bold;
  color: green;
}
.price-trend-down {
  font-weight: bold;
  color: red;
}
</style>
