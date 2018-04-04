import Vue from 'vue'
import Router from 'vue-router'

import LotteriesList from '../components/LotteriesList';
import Lottery from '../components/Lottery';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'LotteriesList',
      component: LotteriesList
    },
    {
      path: '/lottery/:lotteryAddress',
      name: 'Lottery',
      component: Lottery
    }
  ]
})
