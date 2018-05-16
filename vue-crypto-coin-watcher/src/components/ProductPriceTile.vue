<template>
  <v-fade-transition>
    <section>
      <p>
        <v-btn flat icon color="primary lighten-1" @click="removeSavedPrice"><v-icon>highlight_off</v-icon></v-btn>
        <span class="spacer-10-right">{{ savedProductPrice.display_name }}:</span>
        <span class="spacer-10-right">{{ savedProductPrice.price | formatCurrency }},</span>
        <span class="spacer-10-right">{{ savedProductPrice.time | formatDateToString }}</span>
      </p>
    </section>
  </v-fade-transition>
</template>

<script type="text/javascript">
export default {
  name: 'ProductPriceTile',
  props: {
    savedProductPrice: {
      type: Object,
      required: true
    }
  },
  methods: {
    removeSavedPrice: function () {
      this.$store.dispatch('removeProductPriceNow', { time: this.savedProductPrice.time })
    }
  }
}
</script>

<style>

</style>
