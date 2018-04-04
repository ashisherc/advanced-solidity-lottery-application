<template>
    <div>
      <div class="row">
        <div class="col-md-4 offset-md-4">
          <create-lottery :accounts="accounts" :lotteryCreated="lotteryCreated"></create-lottery>
        </div>
      </div>
      <div class="row voffset3">
        <lottery-head v-for="address in lotteries" :key="address"
          :lotteryAddress="address" :accounts="accounts"></lottery-head>
      </div>
    </div>
</template>

<script>
import LotteryHead from "./LotteryHead";
import LotteryGenerator from "../web3/LotteryGenerator";
import CreateLottery from "./CreateLottery";

import web3 from '../web3/web3';

export default {
  data: function() {
    return {
      lotteries: [],
      accounts: []
    };
  },
  methods: {
    lotteryCreated(lotteryAddress) {
      this.lotteries.push(lotteryAddress);
    }
  },
  components: {
    LotteryHead,
    CreateLottery
  },
  async created() {
    this.lotteries = await LotteryGenerator.methods.getLotteries().call();
    web3.eth.getAccounts().then(metaMaskAccounts => {
      this.accounts = metaMaskAccounts;
    });
  }
};
</script>

<style>

</style>
