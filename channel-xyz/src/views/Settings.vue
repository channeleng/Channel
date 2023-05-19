<template>
  <div id="settings">
      <div v-if="isCreator" class="tabs">
        <router-link to="/dashboard/settings/profile">Profile</router-link>
      </div>
      <div v-else class="tabs">
        <router-link to="/dashboard/settings/subscriptions">Subscriptions</router-link>
      </div>
      <router-view :key="$route.path" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: "Settings",
    computed: {
      ...mapGetters(['address', 'profile', 'isCreator']),
      name() {
        return this.profile && this.profile.value ? this.profile.value.name : '';
      },
      memberships() {
        return this.profile && this.profile.value ? this.profile.value.membership_contracts : '';
      }
    },
    watch: {
      isCreator(newValue) {
        this.updatePath();
      }
    },
    methods: {
      updatePath() {
        const toPath = '/dashboard/settings/profile'
        this.$router.push(toPath)
      }
    },
    mounted() {
      this.updatePath();
      if (this.address) this.$store.dispatch('getProfile', this.address)
    }
}

</script>

<style scoped>

  #settings {
    max-width: 600px;
    margin: 0 auto;
  }

  .tabs {
    width: 600px;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
  .tabs a {
    padding-top: .5rem;
    padding-bottom: .5rem;
    width: 150px;
    text-decoration: none;
    background-color: var(--grey);
    color: #000000;
    margin-right: .1rem;
    text-align: center;
  }
  .tabs .router-link-exact-active {
    border: 1px solid #e1e1e1;
    background-color: var(--white);
  }
</style>
