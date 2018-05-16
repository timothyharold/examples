<template>
  <v-container>

    <v-layout>
      <v-flex class="text-xs-center">
        <div>
          <p>Product data is updated automatically.</p>
        </div>
      </v-flex>
    </v-layout>

    <v-layout justify-space-around fluid>
      <v-flex xs10 sm8 md6 lg4 class="text-xs-center">
        <div v-show="products < 1">
          <p>This is a super simple example using Vue.js. It was created as a 'sandbox' to help with retention as I started learning Vue. (My first Vue code) At the moment, it polls an API to update information for the products you have selected in the drop-down. It incorporates Vuex (for the store), an event bus, modules, axios, moment, some global and scoped styles. Nothing fancy. Just a sandbox.</p>
          <p><strong>To begin, select a product in the toolbar at the top of the page.</strong></p>
        </div>
      </v-flex>
    </v-layout>

    <v-layout row>
      <v-flex>
        <selected-crypto-products></selected-crypto-products>
      </v-flex>
    </v-layout>

    <v-divider class="mt-3 mb-3"></v-divider>

    <v-layout>
      <v-flex>
        <saved-product-prices></saved-product-prices>
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script type="text/javascript">
import SelectedCryptoProducts from './SelectedCryptoProducts'
import SavedProductPrices from './SavedProductPrices'
import { mapGetters } from 'vuex'

export default {
  name: 'Coinbase',
  data () {
    return {

    }
  },
  components: {
    'selected-crypto-products': SelectedCryptoProducts,
    'saved-product-prices': SavedProductPrices
  },
  methods: {},
  computed: {
    ...mapGetters({
      products: 'getAllProducts'
    })
  }
}
</script>

<style scoped>

</style>
