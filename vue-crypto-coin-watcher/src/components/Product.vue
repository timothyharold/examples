<template>
  <v-container>
    <v-layout row>
      <v-flex>
        <section class="black--text text-xs-center text-sm-center">
          <h2>{{ product.displayName }}</h2>
          <p>{{ product.id }}</p>
        </section>
      </v-flex>
    </v-layout>
    <v-layout justify-center align-center>
      <v-flex>
        <div class="container-chart" v-show="showChart">
          <canvas id="product-chart"></canvas>
        </div>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex class="mt-4">
        <section class="black--text text-xs-center text-sm-center">
          <h2>{{ product.price | formatCurrency }}</h2>
          <p>Size: {{ product.size }}</p>
          <p>Bid: {{ product.bid | formatCurrency }}</p>
          <p>Ask: {{ product.ask | formatCurrency }}</p>
          <p>Volume: {{ product.volume }}</p>
          <p>as of: {{ product.time | formatDateToString }}</p>
        </section>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script type="text/javascript">
import Chart from 'chart.js'
import Utilities from '@/modules/utilities-date'
import { eventBus } from '../main'
import { mapGetters } from 'vuex'

export default {
  name: 'Product',
  data () {
    return {
      product: {},
      historicRates: [],
      past24Hours: [],
      showChart: false
    }
  },
  props: [
    'id'
  ],
  computed: {
    ...mapGetters({
      products: 'getAllProducts'
    })
  },
  methods: {
    returnToProductsPage: function () {
      eventBus.$emit('toggleProductSelectorEvent', true)
      this.$router.push('/')
    },
    getProductDetails: function (id) {
      let prod = this.products.filter(o => o.id === id)
      this.product = prod[0]
    },
    handleHistoricRates: function (payload) {
      this.historicRates = payload
      this.processDataForPast24Hours(this.historicRates)
    },
    processDataForPast24Hours: function (history) {
      // [ time,           low,      high,      open,      close,         volume ]
      // 0:1526227200   1:8604.76   2:8690   3:8619.38   4:8650.07   5:435.61687684000015
      this.past24Hours = history.slice(0, 24).map(o => {
        return {
          time: o[0],
          timeFormatted: this.processDate(o[0]),
          low: o[1],
          high: o[2],
          open: o[3],
          close: o[4],
          volume: o[5]
        }
      })
      this.initChart()
    },
    processDate: function (stringOrNumber) {
      return Utilities.formatDateToString(stringOrNumber)
    },
    initChart: function () {
      let labels = this.past24Hours.map(o => o.timeFormatted.substr(-11, 11)).reverse()
      let highsData = this.past24Hours.map(o => o.high).reverse()
      let lowsData = this.past24Hours.map(o => o.low).reverse()
      let ctx = document.getElementById('product-chart').getContext('2d')
      let config = {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Highs',
              backgroundColor: '#F00',
              borderColor: '#F00',
              data: highsData,
              fill: false
            },
            {
              label: 'Lows',
              backgroundColor: '#CCC',
              borderColor: '#CCC',
              data: lowsData,
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          title: {
            display: true,
            text: 'Past 24 Hour Performance'
          },
          tooltips: {
            mode: 'index',
            intersect: false
          },
          hover: {
            mode: 'nearest',
            intersect: true
          },
          scales: {
            xAxes: [{
              display: true,
              scaleLabel: {
                display: false,
                labelString: ''
              }
            }],
            yAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Price'
              }
            }]
          }
        }
      }
      this.chart = new Chart(ctx, config)
      this.showChart = true
    }
  },
  created () {
    eventBus.$on('productHistoricRatesUpdatedEvent', this.handleHistoricRates)
    this.$store.dispatch('getProductHistoricRatesFromGDAX', { id: this.id })
  },
  mounted () {
    this.getProductDetails(this.id.toUpperCase())
  },
  beforeDestroy () {
    eventBus.$off('productHistoricRatesUpdatedEvent')
  }
}
</script>

<style scoped>
canvas {
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  border: 1px solid #CCC;
}
.container-chart {
  position: relative;
  margin: 0 auto;
  width: 80vw;
  min-width: 320px;
  min-height: 420px;
  max-width: 640px;
  max-height: 480px;
}
</style>
