<template>
<div>
    <div class="row">
        <div class="col-md-4 offset-md-4" v-if="winner.name">
            <div class="card">
                <h6 class="card-header">Last Winner is: {{winner.name}}</h6>
            </div>
        </div>
    </div>
    <div class="row voffset4" v-if="isLotteryLive">
        <div class="col-md-6">
            <participants :lotteryAddress="lotteryAddress"
              :accounts="accounts"></participants>
        </div>
        <div class="col-md-6">
            <participate :lotteryAddress="lotteryAddress" :accounts="accounts"></participate>
        </div>
    </div>
    <div class="row voffset4" v-show="!isLotteryLive">
        <div v-show="!isMetaMaskPresent" class="alert alert-danger" role="alert">
          Lottery is not Live
        </div>
    </div>

  <div class="row voffset3" v-if="isManager()">
      <div class="col-md-6 offset-md-3">
          <manager-lottery :lotteryAddress="lotteryAddress"
            :accounts="accounts"
            :isLotteryLive="isLotteryLive"
            :changeLotteryStatus="changeLotteryStatus"
            :updateWinner="updateWinner"></manager-lottery>
      </div>
  </div>
</div>

</template>

<script>
import Vue from "vue";
import Participate from "./Participate";
import Participants from "./Participants";
import ManagerLottery from "./ManageLottery";

import web3 from "../web3/web3";

import Lottery from "../web3/Lottery";

export default {
  data() {
    return {
      lotteryAddress: this.$route.params.lotteryAddress,
      winner: {},
      accounts: [],
      isLotteryLive: false,
      lotteryManager: ""
    };
  },
  methods: {
    isManager() {
      return this.lotteryManager === this.accounts[0];
    },
    changeLotteryStatus(status) {
      this.isLotteryLive = status;
    },
    updateWinner(winner) {
      this.winner = winner;
    }
  },
  components: {
    Participate,
    Participants,
    ManagerLottery
  },
  created() {
    Lottery.options.address = this.lotteryAddress;
    Lottery.methods
      .winner()
      .call()
      .then(result => {
        this.winner = result;
      });
    web3.eth.getAccounts().then(metaMaskAccounts => {
      this.accounts = metaMaskAccounts;
    });

    Lottery.methods
      .isLotteryLive()
      .call()
      .then(status => {
        this.isLotteryLive = status;
      });

    Lottery.methods
      .manager()
      .call()
      .then(managerName => {
        this.lotteryManager = managerName;
      });
  }
};
</script>

<style>

</style>
