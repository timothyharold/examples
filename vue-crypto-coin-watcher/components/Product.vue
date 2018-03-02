<template>
  <transition name="fade">
    <div>
      <h3>This will be the {{ id.toUpperCase() }} Product page</h3>
      <p>No content here yet</p>
      <p>The id is: <strong>{{ id.toUpperCase() }}</strong></p>
      <button v-on:click="returnToProductsPage">Return to Products page</button>
  </div>
  </transition>
</template>

<script type="text/javascript">
import { eventBus } from '../main'

export default {
  props: [
    'id'
  ],
  methods: {
    returnToProductsPage: function () {
      eventBus.$emit('toggleProductSelectorEvent', true)
      this.$router.push('/')
    }
  },
  data () {
    return {

    }
  }
}
</script>

<style></style>
