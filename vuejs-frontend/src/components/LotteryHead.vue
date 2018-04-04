<template>
    <div class="col-md-4" style="padding-top: 15px; padding-bottom:15px;">
        <div class="card">
            <h5 class="card-header" :class="isMyLottery() ? 'my-lottery-color': ''">{{'Name : ' + lotteryName}}</h5>
            <div class="card-body">
                <h6 class="card-title">{{'Lottery Address : ' + lotteryAddress}}</h6>
                <h6 class="card-title">{{'Manager : ' + lotteryManager}}</h6>
                <hr/>
                <div class="row">
                  <div class="col-md-6">
                      <router-link :to="{ name: 'Lottery', params: {lotteryAddress: lotteryAddress}}"
                        class="btn btn-primary">More</router-link>
                  </div>
                  <div class="col-md-6 lottery-status">
                        <span class="lottery-status-icon"
                        :class="isLotteryLive? 'lottery-status-icon-green': 'lottery-status-icon-red'"></span>
                        
                        {{isLotteryLive? 'Live': 'Closed'}}
                     </div>
                  </div>
            </div>  
        </div>
    </div>
</template>

<script>
import Lottery from "../web3/Lottery";
import web3 from "../web3/web3";

var accounts = [];

export default {
  props: ["lotteryAddress", "accounts"],
  data() {
    return {
      lotteryName: "",
      lotteryManager: "",
      isLotteryLive: false
    };
  },
  methods: {
    isMyLottery() {
      return this.accounts[0] === this.lotteryManager;
    }
  },
  async created() {
    Lottery.options.address = this.lotteryAddress;

    Lottery.methods
      .lotteryName()
      .call()
      .then(name => {
        this.lotteryName = name;
      });

    Lottery.methods
      .manager()
      .call()
      .then(managerAddress => {
        this.lotteryManager = managerAddress;
      });

    Lottery.methods
      .isLotteryLive()
      .call()
      .then(status => {
        this.isLotteryLive = status;
      });
  }
};
</script>

<style>
.lottery-status {
  margin: auto;
}
.lottery-status-icon {
  width: 20px;
  height: 20px;
  border-radius: 10px;
  display: inline-block;
  vertical-align: text-bottom;
}

.lottery-status-icon-red {
  background-color: #e5003a;
}

.lottery-status-icon-green {
  background-color: green;
}

.my-lottery-color {
  background-color: lightgreen;
}
</style>
