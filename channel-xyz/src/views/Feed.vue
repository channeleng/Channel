<template>
    <div id="feed">
        <div class="badges">
          <Badge v-for="(e, index) in feed"
            :key="index"
            :id="index"
            :badge="e.value.imageCid"
            :isLarge="true"
          />
        </div>
        <div class="list">
          <Row v-for="(e, index) in feed"
            :key="index"
            :id="index"
            :data="e.value"
          />
        </div>
    </div>
  </template>
  
  <script>
    import { mapGetters } from 'vuex';
    import Row from '../components/Row.vue'
    import Badge from '../components/Badge.vue'
    
    export default {
      name: 'Feed',
      components:{
        Row,
        Badge
      },
      computed: {
        ...mapGetters(['feed', 'address'])
      },
      mounted () {
        if (this.address) this.$store.dispatch("getFeed");
      }
    }
  </script>
  
  <style scoped>
    #feed {
      border: 1px #e6e6e6 solid;
      max-width: 800px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
    }
    .badges {
      display: flex;
      justify-content: left;
      margin: 10px 0;
    }
  </style>