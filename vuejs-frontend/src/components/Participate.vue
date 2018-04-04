<template>
  <div class="row">
      <div class="col-md-12">
          <div class="card">
            <h5 class="card-header">Participate - Max ({{maxEntriesForPlayer}})</h5>
            <div class="card-body">
              <p>You can only participate for the max allowed entries by the creator of the Lottery.</p>
              <p>Current winning price: {{currentWinningPrice}} eth</p>
              <form @submit.prevent="participate">
                  <div class="form-group">
                      <label for="playerName">Name</label>
                      <input type="text"
                          class="form-control" id="playerName"
                          placeholder="Enter Player name"
                          v-model="playerName" required>
                  </div>
                  <div class="form-group">
                      <label for="ethToParticipate"> Ether required to participate </label>
                      <input type="text"
                          class="form-control" id="ethToParticipate"
                          v-model="ethToParticipate" disabled>
                  </div>
                  <button type="submit" class="btn btn-primary">Participate</button>
                  <div v-if="error" class="alert alert-danger voffset2" role="alert">
                    {{error}}
                  </div>
                  <div v-if="showProgress" class="progress voffset2">
                    <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" :aria-valuenow="progress" aria-valuemin="0" aria-valuemax="100" :style="{'width': progress + '%'}"></div>
                  </div>
              </form>
            </div>
        </div>
      </div>
  </div>
</template>

<script>
import { eventBus } from "../main";

import web3 from "../web3/web3";
import Lottery from "../web3/Lottery";

export default {
  props: ["lotteryAddress", "accounts"],
  data() {
    return {
      currentWinningPrice: 0,
      ethToParticipate: 0,
      maxEntriesForPlayer: 0,
      player: {},
      playerName: "",
      error: null,
      progress: 0,
      showProgress: false
    };
  },
  methods: {
    participate() {
      if (this.maxEntriesForPlayer - this.player[1] <= 0) {
        this.error = "You have reached participation limit";
        return;
      }
      Lottery.methods
        .participate(this.playerName)
        .send({
          from: this.accounts[0],
          gas: "1000000",
          value: web3.utils.toWei(this.ethToParticipate, "ether")
        })
        .once("transactionHash", hash => {
          this.showProgress = true;
        })
        .on("error", error => {
          console.log(error);
          this.error =
            "There was an error while making transaction, please try again later.";
        })
        .then(reciept => {
          this.progress = 99;
          eventBus.$emit(
            "playerParticipated",
            reciept.events.PlayerParticipated.returnValues
          );
          this.currentWinningPrice = parseFloat(this.ethToParticipate) + parseFloat(this.currentWinningPrice);
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
  created() {
    Lottery.options.address = this.lotteryAddress;
    Lottery.methods
      .ethToParticipate()
      .call()
      .then(result => {
        this.ethToParticipate = result;
      });
    Lottery.methods
      .maxEntriesForPlayer()
      .call()
      .then(result => {
        this.maxEntriesForPlayer = result;
      });
    Lottery.methods
      .getWinningPrice()
      .call()
      .then(result => {
        this.currentWinningPrice = web3.utils.fromWei(result, "ether");
      });
    Lottery.methods
      .getPlayer(this.accounts[0])
      .call()
      .then(player => {
        this.player = player;
      });
  }
};
</script>

<style>

</style>
