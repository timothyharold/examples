<template>
  <header>
    <h2>{{ headertitle }}</h2>
  </header>
</template>

<script type="text/javascript">
export default {
  props: {
    headertitle: {
      type: String,
      required: true
    }
  },
  data () {
    return {

    }
  }
}
</script>

<style scoped>
header {
  background-color: #009688;
  padding: 5px;
  color: white;
}
</style>
