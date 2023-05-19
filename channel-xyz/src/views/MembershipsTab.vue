<template>
    <div class="memberships-tab">
        <CreatorRow 
          v-for="(f, index) in feed"
          :key="index"
          :data="f.value"
        />
    </div>
  </template>
  
<script>
  import { mapGetters } from 'vuex'
  import CreatorRow from '../components/CreatorRow.vue'

  export default {
    name: 'MembershipsTab',
    components: {
      CreatorRow
    },
    computed: {
      ...mapGetters(['address', 'feed']),
    },
    methods: {
      updateMembership() {
        // TBD
        // POST to delete or add new membership contract
      }
    },
    mounted () {
      if (this.address) this.$store.dispatch("getFeed", this.address);
    }
  }
</script>
  
<style scoped>
  .memberships-tab {
    border: 1px solid #e1e1e1;
    margin-top: 30px;
    padding: 20px;
  }
</style>
  