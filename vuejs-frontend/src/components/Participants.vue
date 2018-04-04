<template>
  <div class="row">
      <div class="col-md-12">
          <div class="card">
              <h5 class="card-header"> Participants ({{totalPlayers}})</h5>
              <div class="card-body">
                <ul class="list-group">
                    <li class="list-group-item" :key="address+''"
                      v-for="(player, address) in players">{{player[0]}} ({{player[1]}})</li>
                </ul>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
import { eventBus } from "../main";
import Vue from "vue";
import Lottery from "../web3/Lottery";
export default {
  props: ["lotteryAddress", "accounts"],
  data() {
    return {
      totalPlayers: 0,
      players: {},
      playersAddresses: []
    };
  },
  async created() {
    this.playersAddresses = await Lottery.methods.getPlayers().call();
    this.totalPlayers = this.playersAddresses.length;
    this.playersAddresses.forEach(playerAddress => {
      Lottery.methods
        .getPlayer(playerAddress)
        .call()
        .then(result => {
          Vue.set(this.players, playerAddress, result);
        });
    });

    eventBus.$on("playerParticipated", result => {
      const player = {
        0: result.name,
        1: result.entryCount
      };
      this.totalPlayers++;
      Vue.set(this.players, this.accounts[0], player);
    });
  }
};
</script>

<style>

</style>
