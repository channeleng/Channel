<template>
    <div class="media-player">
        <img :src="imageSrc" />
        <audio v-if="hasToken && signedIn" controls="" :src="audioSrc"></audio>
        <ListenButton v-if="hasToken && !signedIn" />
        <SubscribeButton
          v-if="hasToken"
        />
        <ExtSubscribeButton
          v-else
          :href="tokenStoreURL"
        />
    </div>
  </template>

  <script>
  import ExtSubscribeButton from '../components/ExtSubscribeButton'
  import SubscribeButton from '../components/SubscribeButton'
  import ListenButton from '../components/ListenButton'

    export default {
      name: 'MediaPlayer',
      components: {
        ListenButton,
        SubscribeButton,
        ExtSubscribeButton,
      },
      computed: {
        tokenStoreURL() {
          return this.$store.state.tokenStoreURL
        },
        hasToken () {
          return this.$store.state.hasToken
        },
        signedIn () {
          return this.$store.state.signedIn
        }
      },
      props: {
        imageSrc: String,
        audioSrc: String
      }
    }
  </script>

  <style scoped>
    .media-player {
      max-width: 360px;
    }
    audio {
      width: 100%;
    }
    @media (max-width: 960px) {
      .media-player {
          max-width: 100%;
      }
    }
  </style>
