<template>
    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <h5 class="card-header">Manage Lottery</h5>
                <div class="card-body">
                    <div class="row" v-if="isLotteryLive">
                        <button style="margin:auto" class="btn btn-primary" @click="declareWinner">Declare winner</button>
                    </div>

                    <div v-else>
                        <div class="row">
                          <button style="margin:auto" class="btn btn-danger" @click="deleteLottery">Delete Lottery</button>
                        </div>
                        <div class="row voffset4">
                          <form style="margin: auto" @submit.prevent="activateLottery">
                              <div class="form-group">
                                  <label for="maxEntriesPerPlayer"> Max Entries for a player</label>
                                  <input class="form-control"
                                      type="number" id="maxEntriesPerPlayer"
                                      v-model="maxEntriesPerPlayer">
                              </div>
                              <div class="form-group">
                                  <label for="ethRequiredToParticipate"> Amount of Ether required to participate </label>
                                  <input class="form-control"
                                      type="number" id="ethRequiredToParticipate"
                                      v-model="ethRequiredToParticipate">
                              </div>
                              <button class="btn btn-success" type="submit">Activate</button>
                          </form>
                        </div>
                    </div>

                    <div v-if="showError" class="alert alert-danger voffset2" role="alert">
                        There was an error while making transaction. Try again later.
                    </div>
                    <div v-if="showProgress" class="progress voffset2">
                        <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" :aria-valuenow="progress" aria-valuemin="0" aria-valuemax="100" :style="{'width': progress + '%'}"></div>
                    </div>
                </div> 
            </div>
        </div>
    </div>
</template>

<script>
import Lottery from "../web3/Lottery";
import LotteryGenerator from "../web3/LotteryGenerator";

export default {
  props: [
    "lotteryAddress",
    "isLotteryLive",
    "accounts",
    "changeLotteryStatus",
    "updateWinner"
  ],
  data() {
    return {
      maxEntriesPerPlayer: 0,
      ethRequiredToParticipate: 0,
      showError: false,
      showProgress: false,
      progress: 0
    };
  },
  methods: {
    activateLottery() {
      Lottery.methods
        .activateLottery(
          this.maxEntriesPerPlayer,
          this.ethRequiredToParticipate
        )
        .send({
          from: this.accounts[0],
          gas: 2000000
        })
        .once("transactionHash", hash => {
          this.showProgress = true;
        })
        .on("error", error => {
          console.log(error);
          this.showError = true;
        })
        .then(reciept => {
          this.progress = 99;
          this.changeLotteryStatus(true);
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
    },

    declareWinner() {
      Lottery.methods
        .declareWinner()
        .send({
          from: this.accounts[0],
          gas: 200000
        })
        .once("transactionHash", hash => {
          this.showProgress = true;
        })
        .on("error", error => {
          console.log(error);
          this.showError = true;
        })
        .then(reciept => {
          this.progress = 99;
          this.changeLotteryStatus(false);
          this.updateWinner(reciept.events.WinnerDeclared.returnValues);
        });
      var interval = setInterval(() => {
        if (this.progress == 100) {
          clearInterval(interval);
          this.showProgress = false;
          this.progress = 0;
        } else {
          this.progress++;
        }
      }, 1000);
    },

    deleteLottery() {
      LotteryGenerator.methods
        .deleteLottery(this.lotteryAddress)
        .send({
          from: this.accounts[0],
          gas: 200000
        })
        .once("transactionHash", hash => {
          this.showProgress = true;
        })
        .on("error", error => {
          console.log(error);
          this.showError = true;
        })
        .then(reciept => {
          this.progress = 99;
          this.$router.push('/');
        });
      var interval = setInterval(() => {
        if (this.progress == 100) {
          clearInterval(interval);
          this.showProgress = false;
          this.progress = 0;
        } else {
          this.progress++;
        }
      }, 1000);
    }
  },
  created() {
    Lottery.options.address = this.lotteryAddress;
  }
};
</script>

<style>

</style>
