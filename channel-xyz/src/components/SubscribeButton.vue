<template>
    <CopyText
        v-if="rssLink"
        :rssLinkText="rssLink"
    />
    <div v-else class="button" @click="signForRSSLink()">
      Get RSS Link
    </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { useStore } from 'vuex';
  import { useSignMessage } from 'vagmi';
  import * as CryptoJS from 'crypto-js';

  const props = defineProps({
    address: { type: String, default: '' }
  });

  const emit = defineEmits(['subscribed']);
  const store = useStore();
  const rssLink = ref('');
  const { signMessage } = useSignMessage({
    onSuccess(signature, vars) {
        store
            .dispatch("signForRSSLink", { signature: signature, message: vars.message })
            .then((link) => {
              if (link.cid) {
                const _rssLink = `${window.location.origin}/api/rss/${link.cid}`;
                console.log('RSS Link', _rssLink);
                rssLink.value = _rssLink;
              } else {
                console.log('Not subscribed (no tokens), or error signing.');
              }
            })
            .catch((err) => {
                console.log("Could not sign.");
            });
      }
  });
  function signForRSSLink() {
    if (!store.state.account.address || !store.state.isConnected) {
      // need to first sign / authenticate
      console.log("Not connected. Can't sign message. Connect wallet.");
      return;
    } else {
    // presign message to increment user nonce and return message for signing
    store
      .dispatch("preSign", { signingMessage: "signForRSSLink" })
      .then((message) => {
        signMessage({ message });
      })
    }
  }
</script>

<script>
  import CopyText from '../components/CopyText.vue'

  export default {
    name: 'SubscribeButton',
    components: {
        CopyText
    }
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
