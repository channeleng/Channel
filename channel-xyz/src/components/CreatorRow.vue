<template>
    <div class="creatorRow">
        <router-link :to="{ name: 'Profile', params: { 'address': creatorAddress } }">
            <div class="panel">
                    <Badge
                      :badge="badgeImg"
                      :address='creatorAddress'
                      :isSmall="true"
                      :name="author"
                      :bio="badgeBio"
                    />
                    <div>
                        {{ name }}<br>
                        Membership Type
                    </div>
            </div>
        </router-link>
        <div class="links">
            <div>
                <CopyText />
            </div>
            <div>
                <a href="https://opensea.io" target="_blank">OpenSea</a>
                <a href="https://etherscan.io" target="_blank">Etherscan</a>
            </div>
        </div>
    </div>
  </template>

  <script>
  import { mapState } from 'vuex'
  import Badge from './Badge.vue'
  import CopyText from './CopyText.vue'

  export default {
    name: 'CreatorRow',
    components: {
      Badge,
      CopyText
    },
    props: {
      data: Object
    },
    computed: {
        ...mapState(['profiles']),
        creatorAddress() {
            return this.data['creatorAddress'] ? this.data.creatorAddress : ''
        },
        badgeImg() {
            if (this.data['address'] && this.data['imageCid']) {
                return process.env.VUE_APP_BUCKET + this.data['imageCid']
            }
            else {
                return require('../assets/img/channel-avatar.jpeg')
            }
        },
        author() {
            return this.data['name'] ? this.data.name : 'Channel Creator'
        },
        badgeBio() {
            return this.data['bio'] ? this.data.bio : ''
        }
    }
  }
  </script>

  <style scoped>
    .creatorRow {
        height: 150px;
    }
    .row {
      display: flex;
      padding: 27px;
      border-bottom: 1px #e6e6e6 solid;
      margin-bottom: -1px;
    }
    .row img {
        max-width: 150px;
    }
    .links {
        display: flex;
        justify-content: space-between;
    }
    .links a {
        margin: 5px;
        line-height: 40px;
    }
    .panel {
        border: 1px solid #e1e1e1;
        display: flex;
        align-items: center;
    }
  </style>
