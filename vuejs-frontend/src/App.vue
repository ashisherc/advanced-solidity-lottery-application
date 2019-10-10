<template>
  <div id="app">
    <app-header class="header"></app-header>
    <div v-show="!isMetaMaskPresent" class="alert alert-danger" role="alert">
      Meta mask is not detected
    </div>
    <div v-show="!isMetaMaskLoggedin" class="alert alert-danger" role="alert">
      Please log into Metamask
    </div>
    <div class="alert alert-primary" role="alert">
      This Dapp is deployed on Rinkeby test network. Please make sure that metamask is connected to Rinkeby testnet.
    </div>

    <div v-if="isMetaMaskPresent && isMetaMaskLoggedin" class="container">
      <router-view/>
    </div>
  <app-footer class="voffset3"></app-footer>
  </div>
</template>

<script>
import Header from "./components/shared/Header";
import Footer from "./components/shared/Footer";

import web3 from "./web3/web3";

export default {
  data() {
    return {
      isMetaMaskPresent: false,
      isMetaMaskLoggedin: false,
    };
  },
  async created() {
    this.isMetaMaskPresent = web3 ? true : false;
    try {
      await ethereum.enable();
    } catch (error) {
    }
    if (this.isMetaMaskPresent) {
      const accounts = await web3.eth.getAccounts();
      this.isMetaMaskLoggedin = accounts.length ? true : false;
    }
  },
  components: {
    AppHeader: Header,
    AppFooter: Footer
  }
};
</script>

<style>
.header {
  margin-bottom: 15px;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.voffset {
  margin-top: 2px;
}
.voffset1 {
  margin-top: 5px;
}
.voffset2 {
  margin-top: 10px;
}
.voffset3 {
  margin-top: 15px;
}
.voffset4 {
  margin-top: 30px;
}
.voffset5 {
  margin-top: 40px;
}
.voffset6 {
  margin-top: 60px;
}
.voffset7 {
  margin-top: 80px;
}
.voffset8 {
  margin-top: 100px;
}
.voffset9 {
  margin-top: 150px;
}
</style>
