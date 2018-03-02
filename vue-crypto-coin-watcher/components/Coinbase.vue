<template>
  <div>
    <div>
      <p class="text-md">Product data is updated automatically.</p>
    </div>
      <div class="example-notes-container" v-show="products < 1">
        <p>This is a super simple example using Vue.js. It was created as a 'sandbox' to help with retention as I started learning Vue. (My first Vue code) At the moment, it polls an API to update information for the products you have selected in the drop-down. It incorporates Vuex (for the store), an event bus, modules, axios, moment, some global and scoped styles. Nothing fancy. Just a sandbox.</p>
        <p><strong>To begin, select a product.</strong></p>
      </div>
    <div class="pure-g">
      <crypto-product v-for="product in products" v-bind:key="product.id" v-bind:product="product"></crypto-product>
    </div>
    <div class="product-prices-container">
      <hr />
      <h3>Saved Prices</h3>
      <button v-on:click="handleClearAllSavedProductPrices">Clear All</button>
      <saved-product-price v-for="savedProductPrice in savedProductPrices" v-bind:key="savedProductPrice.time" v-bind:savedProductPrice="savedProductPrice"></saved-product-price>
    </div>
  </div>
</template>

<script type="text/javascript">
import { mapGetters } from 'vuex'

export default {
  data () {
    return {

    }
  },
  methods: {
    handleClearAllSavedProductPrices: function () {
      this.$store.dispatch('removeAllSavedProductPricesNow')
    }
  },
  computed: {
    ...mapGetters({
      products: 'getAllProducts',
      savedProductPrices: 'getAllSavedProductPrices'
    })
  }
}
</script>

<style scoped>
.example-notes-container {
  margin: 30px auto;
  padding: 30px;
  border-radius: 20px;
  border: 1px solid #ddd;
  max-width: 320px;
}

.product-prices-container {
  padding: 30px;
}

.product-prices-container hr {
  display: block;
  height: 1px;
  border: 0;
  border-top: 1px solid #ccc;
  margin: 0;
  padding: 0;
}
</style>
