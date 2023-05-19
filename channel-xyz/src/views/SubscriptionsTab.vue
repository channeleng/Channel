<template>
    <div class="subscriptions-tab">
      <CopyText
        v-if="hasToken"
        :rssLinkText="rssLink"
      />
      <ExtSubscribeButton
        v-else
        label="Get RSS Link"
        :href="tokenStoreURL"
      />
    </div>
  </template>

<script>
  import CopyText from '../components/CopyText.vue';
  import ExtSubscribeButton from '../components/ExtSubscribeButton.vue';

  export default {
    name: 'SubscriptionsTab',
    components: {
      CopyText,
      ExtSubscribeButton,
    },
    computed: {
      hasToken() {
        return this.$store.state.hasToken
      }
    },
    data () {
      return {
        rssLink: null, // need to get this from an endpoint?
        tokenStoreURL: process.env.VUE_APP_TOKEN_STORE_URL
      }
    },
  }
</script>

<style scoped>
  .subscriptions-tab {
    border: 1px solid #e1e1e1;
    margin-top: 30px;
    padding: 20px;
    text-align: center;
  }
</style>
