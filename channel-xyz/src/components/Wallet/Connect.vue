<script setup>
import { useAccount, useBalance, useEnsName, useConnect, useDisconnect, useSignMessage } from 'vagmi';
import { computed, watchEffect } from 'vue';
import { useStore } from 'vuex';

const {
  activeConnector,
  connect,
  connectors,
  error,
  isConnecting,
  pendingConnector,
} = useConnect();

const store = useStore();
const { address, isConnected, isDisconnected } = useAccount({
    onDisconnect() {
        console.log("onDisconnect, isConnected", isConnected.value);
        store.dispatch('setConnected', isConnected.value );
        store.dispatch('setAccount', {});
        store.dispatch('verifyProfile', address.value);
    }
});

const filteredConnectors = computed(() => {
  return connectors.value.filter(c => c.ready && c.id !== activeConnector.value?.id);
});

watchEffect(() => {
  // this only seems to fire on connect, not disconnect. Am using onDisconnect callback above to catch that state change...
  // console.log("watchEffect, isConnected", isConnected.value);
  store.dispatch('setConnected', isConnected.value );
  store.dispatch('setAccount', { 'address': address.value });
  store.dispatch('verifyProfile', address.value);
  store.dispatch('checkForToken');
});

</script>

<script>
export default {
  data() {
    return {
      doConnect: false
    }
  },
  mounted() {
    // Hack for WalletConnect Modal: expose Buffer in the `window` namespaces
    // https://github.com/WalletConnect/walletconnect-monorepo/issues/748
    window.Buffer = window.Buffer || require("buffer").Buffer;
  }
}
</script>

<template>
  <div>
    <div v-if="!isConnected">
      <div class="connect" @click="doConnect = true">
        Connect
      </div>
      <div v-if="doConnect" class="curtain" @click="doConnect = false">
        <div class="popup">
          <div class="header">
            <h2>Connect your wallet</h2>
          </div>
          <ul class="options">
            <li v-for="c in filteredConnectors" :key="c.id">
              <div class="option" @click.stop="connect(c)">
                <div class="badge" :class="{meta: c.name == 'MetaMask', wc: c.name == 'WalletConnect', coinbase: c.name == 'Coinbase Wallet'}"></div>
                {{ c.name }}
              </div>
            </li>
          </ul>
          <h4>Don't have a wallet yet? <a href="https://learn.rainbow.me/understanding-web3" target="_blank">Learn more</a></h4>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

h4 {
  font-size: 1rem;
  line-height: 1.35;
  font-weight: 500;
  text-align: center;
}

h4 a {
  color: var(--purple);
}

.connect {
  cursor: pointer;
  background-color: var(--lightpurple);
  color: var(--purple);
  padding: 10px 15px;
  border-radius: 5px;
}
.curtain {
  position: fixed;
  z-index: 999;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.popup {
  display: block;
  width: 100%;
  max-width: 450px;
  background: white;
  border-radius: 2px;
  padding: 40px;
}
.popup .header {
  text-align: center;
  margin-bottom: 30px;
}

ul {
  line-height: 2;
}

.options, h4 {
  margin-bottom: 30px;
}

.option {
  display: flex;
  align-items: center;
  padding: 10px;
  width: 100%;
  min-height: 72px;
  border-radius: 5px;
  border: 1px solid rgb(245, 245, 245);
  margin-bottom: 10px;
  cursor: pointer;
}

.badge {
  position: relative;
  width: 50px;
  height: 50px;
  background: #eee;
  border: 1px solid #eee;
  border-radius: 100%;
  flex-grow: unset;
  flex-shrink: 0;
  transition: transform 100ms;
  cursor: pointer;
}

.badge.meta {
  background:white url('@/assets/img/icon-meta.png') center/70% no-repeat;
}

.badge.wc {
  background:white url('@/assets/img/walletConnect.svg') center/70% no-repeat;
}

.badge.coinbase {
  background:white url('@/assets/img/coinbase.png') center/70% no-repeat;
}

.option .badge {
  width: 50px;
  height: 50px;
  border-radius: 100%;
  margin-right: 10px;
}
</style>