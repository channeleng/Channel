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
const { address, isConnected, isDisconnected } = useAccount({
    onDisconnect() {
        store.dispatch('setConnected', isConnected.value );
        // store.dispatch('setAccount', {});
    }
});
const { disconnect } = useDisconnect();
const filteredConnectors = computed(() => {
  return connectors.value.filter(c => c.ready && c.id !== activeConnector.value?.id);
});
const store = useStore();

watchEffect(() => {
  store.dispatch('setConnected', isConnected.value );
  // store.dispatch('setAccount', { 'address': address.value });
});

const { signMessage } = useSignMessage({
    onSuccess(signature, variables) {

        // console.log('sig', signature, 'vars', variables);

        console.log(`${address.value} signed with signature: ${signature}`);

        const result = {
            address: address.value,
            signature: signature,
            message: variables.message
        }

        console.log(result);

    }
});

const handleSignMessage = () => {
    // e.preventDefault();
    if (!address.value || isDisconnected.value) {
        console.log("Not connected. Can't sign message. Connect wallet.");
        return;
    }
    const timestamp = Date.now().toString();
    const message = `Verifies that a signature request was made from ${address.value} at the timestamp ${timestamp}`;

    signMessage({ message });
};

</script>

<script>
export default {
    name: "SignMessage",
    mounted() {
    }
}
</script>

<template>
    <div>
        <button @click="handleSignMessage">
            Sign Message
        </button>
    </div>
</template>
