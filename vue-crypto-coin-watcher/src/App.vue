<template>
  <v-app id="inspire">
    <v-toolbar dense color="primary">
      <v-icon class="white--text show-cursor" @click="handleReturnToHome">monetization_on</v-icon>
      <v-toolbar-title class="hidden-sm-and-down"><span class="white--text">{{ headertitle }}</span></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-list-tile color="primary" v-show="products.length > 5">
          <v-list-tile-title class="white--text btn--small">Max 6 products have been selected</v-list-tile-title>
        </v-list-tile>
        <v-menu offset-y v-show="availableProducts.length > 0 && products.length < 6">
          <v-btn class="white--text" small flat slot="activator">SELECT</v-btn>
          <v-list v-show="availableProducts.length > 0 && products.length < 6">
            <v-list-tile color="primary" flat v-for="product in availableProducts" :key="product.id" @click="handleProductSelectedForWatching(product)">
              <v-list-tile-title>{{ product.displayName }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
        <v-btn class="white--text" small flat :disabled="products.length < 1" @click="handleProductsReset">RESET</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <v-container>
        <v-layout>
          <v-flex>
            <router-view></router-view>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <v-footer color="primary" class="pl-4">
      <small>
        <span class="white--text">&copy; 2018 All rights reserved.</span>
      </small>
    </v-footer>
  </v-app>
</template>

<script type="text/javascript">
import { eventBus } from './main'

export default {
  name: 'App',
  components: {},
  data () {
    return {
      showProductSelector: true,
      headertitle: 'Crypto Product Watcher',
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
    handleProductSelectedForWatching: function (product) {
      if (product) {
        this.$store.dispatch('selectProductForWatch', { id: product.id })
        this.handleReturnToHome()
      }
    },
    handleProductsReset () {
      this.$store.dispatch('removeAllProductsFromWatch')
      this.handleReturnToHome()
    },
    handleReturnToHome () {
      this.$router.push('/')
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

<style src='vuetify/dist/vuetify.min.css'></style>

<style>
@import '~material-design-icons/iconfont/material-icons.css'
.paragraph-max-width {
  max-width: 400px;
}
.show-cursor {
  cursor: pointer;
}
</style>
