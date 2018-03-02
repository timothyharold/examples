<template>
  <transition name="fade">
    <p>
      <span class="spacer-10-right">{{ savedProductPrice.display_name }}:</span>
      <span class="spacer-10-right">{{ savedProductPrice.price | formatCurrency }},</span>
      <span class="spacer-10-right">{{ savedProductPrice.time | formatDate }}</span>
    </p>
  </transition>
</template>

<script type="text/javascript">
export default {
  props: {
    savedProductPrice: {
      type: Object,
      required: true
    }
  }
}
</script>

<style></style>
