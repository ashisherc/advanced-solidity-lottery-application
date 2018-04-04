<template>
  <div class="card">
    <div class="card-body">
      <form @submit.prevent="createLottery">
        <div class="form-group">
          <label for="lotteryName">Create a Lottery: Lottery Name</label>
          <input type="text"
            class="form-control" id="lotteryName"
            placeholder="Enter Lottery name"
            v-model="lotteryName" required>
        </div>
        <button type="submit" class="btn btn-success">Create</button>
      </form>
      <div v-if="showError" class="alert alert-danger voffset2" role="alert">
        There was an error while creating lottery, try again later
      </div>
      <div v-if="showProgress" class="progress voffset2">
        <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" :aria-valuenow="progress" aria-valuemin="0" aria-valuemax="100" :style="{'width': progress + '%'}"></div>
      </div>
    </div>
  </div>
</template>

<script>
import web3 from "../web3/web3";
import LotteryGenerator from "../web3/LotteryGenerator";

export default {
  props: ["lotteryCreated", "accounts"],
  data: function() {
    return {
      lotteryName: "",
      showError: false,
      showProgress: false,
      progress: 0
    };
  },
  methods: {
    async createLottery() {
      LotteryGenerator.methods
        .createLottery(this.lotteryName)
        .send({
          gas: 2000000,
          from: this.accounts[0]
        })
        .once('transactionHash', (hash)=> {
          this.showProgress = true;
        })
        .on('error', (error)=>{
          console.log(error);
          this.showError = true
        })
        .then((reciept) => {
          this.progress = 99;
          this.lotteryCreated(reciept.events.LotteryCreated.returnValues.lotteryAddress)
        });
       
      var interval = setInterval(() => {
        if (this.progress == 100) {
          clearInterval(interval);
          this.progress = 0;
          this.showProgress = false;
        } else {
          this.progress++;
        }
      }, 1000);
    }
  },
  mounted() {
    // LotteryGenerator.events.LotteryCreated((error, result) => {
    //   if(!error){
    //     this.progress = 99;
    //     lotteryCreated(result);
    //   }
    //   else{
    //     this.showProgress = false;
    //     this.lotteryCreationError = true;
    //     console.log(error);
    //   }
    // });
  }
};
</script>

<style>

</style>
