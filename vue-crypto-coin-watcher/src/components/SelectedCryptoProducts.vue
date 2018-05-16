<template>
  <v-container grid-list-xs fluid>
    <v-layout justify-space-around wrap>
      <crypto-product v-for="product in products" :key="product.id" :product="product"></crypto-product>
    </v-layout>
  </v-container>
</template>

<script type="text/javascript">
import CryptoProduct from './CryptoProduct'
import { mapGetters } from 'vuex'

export default {
  name: 'SelectedCryptoProducts',
  components: {
    'crypto-product': CryptoProduct
  },
  methods: {
    handleClearAllSavedProductPrices: function () {
      this.$store.dispatch('removeAllSavedProductPricesNow')
    }
  },
  computed: {
    ...mapGetters({
      products: 'getAllProducts'
    })
  }
}
</script>

<style>

</style>
