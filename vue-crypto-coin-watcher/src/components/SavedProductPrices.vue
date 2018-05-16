<template>
  <v-container>
    <v-layout>
      <v-flex class="text-xs-center mb-3">
        <h3>Saved Prices</h3>
        <v-btn flat color="primary" @click="handleClearAllSavedProductPrices">CLEAR ALL PRICES</v-btn>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex class="text-xs-center" xs12>
        <product-price-tile v-for="savedProductPrice in savedProductPrices" :key="savedProductPrice.time" @savedProductPrice="savedProductPrice" :savedProductPrice="savedProductPrice"></product-price-tile>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script type="text/javascript">
import ProductPriceTile from './ProductPriceTile'
import { mapGetters } from 'vuex'

export default {
  name: 'SavedProductPrices',
  components: {
    'product-price-tile': ProductPriceTile
  },
  methods: {
    handleClearAllSavedProductPrices: function () {
      this.$store.dispatch('removeAllSavedProductPricesNow')
    }
  },
  computed: {
    ...mapGetters({
      savedProductPrices: 'getAllSavedProductPrices'
    })
  }
}
</script>

<style>

</style>
