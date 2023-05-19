<template>
    <div class="profileInfo">
        <Badge :badge=badge :address='creatorAddress' :isSmall="true" />
        <div class="name">
            <h3>{{ name }}</h3>
            <p class="bio">{{ bio }}</p>
        </div>
    </div>
  </template>

  <script>
  import { mapState } from 'vuex'
  import Badge from './Badge.vue'

  export default {
    name: 'ProfileInfo',
    components: {
      Badge
    },
    props: {
      data: Object
    },
    computed: {
        ...mapState(['profiles']),
        creatorAddress() {
            return this.data['creatorAddress'] ? this.data.creatorAddress : ''
        },
        badge() {
          if (this.data && this.data['imageCid']) {
            return process.env.VUE_APP_BUCKET + this.data['imageCid']
          }
          else {
            return require('../assets/img/channel-avatar.jpeg')
          }

          // return process.env.VUE_APP_BUCKET + this.creatorAddress + '/profile';
        },
        name() {
            return this.data['name'] ? this.data.name : 'Channel Creator'
        },
        bio() {
            return this.data['bio'] ? this.data.bio : ''
        }
    }
  }
  </script>

  <style scoped>
    .profileInfo {
        width: 300px;
        height: 300px;
        background: rgba(255,255,255,.8);
    }
  </style>
