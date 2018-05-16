import Vue from 'vue'
import Router from 'vue-router'
import Coinbase from '@/components/Coinbase'
import Product from '@/components/Product'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Coinbase',
      component: Coinbase
    },
    {
      path: '/product/:id',
      name: 'Product',
      component: Product,
      props: true
    }
  ]
})
