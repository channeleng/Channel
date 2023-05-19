<template>
    <div class="button" @click="signForMedia()">
      Listen
    </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { useStore } from 'vuex';
  import { useSignMessage } from 'vagmi';

  const store = useStore();
  const rssLink = ref('');
  const { signMessage } = useSignMessage({
    onSuccess(signature, vars) {
        store.dispatch('setSignedIn', true);
      }
  });
  function signForMedia() {
    if (!store.state.account.address || !store.state.isConnected) {
      // need to first sign / authenticate
      console.log("Not connected. Can't sign message. Connect wallet.");
      return;
    } else {
      // presign message to increment user nonce and return message for signing
      store
        .dispatch("preSign", { signingMessage: "signForMedia" })
        .then((message) => {
          signMessage({ message });
        })
    }
  }
</script>

<script>
  export default {
    name: 'ListenButton'
  }
</script>

<style scoped>
    .button {
      background: var(--purple);
      color: white;
      position: relative;
      font-weight: 600;
      border-radius: 5px;
      margin: 4px auto 23px;
      padding: 12px 15px;
      cursor: pointer;
      text-align: center;
      max-width: 130px;
    }
    .button:hover {
      opacity: .8;
    }
    @media (max-width: 960px) {
      .button {
        max-width: 100%;
      }
    }
</style>
