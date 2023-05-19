<template>
    <div id="dashboard">
        <router-view :key="$route.path" />
        <div v-if="isCreator" class="side-nav">
            <router-link to="/dashboard">Episodes</router-link>
            <router-link to="/dashboard/settings">Settings</router-link>
        </div>
        <div v-else class="side-nav">
            <router-link to="/dashboard">Settings</router-link>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    
export default {
    name: "Dashboard",
    computed: {
        ...mapState(['isCreator'])
    },
    methods: {
      updatePath() {
        if (this.$route.path.includes('/dashboard/settings')) return;
        let toPath = this.isCreator ? '/dashboard/episodes' : '/dashboard/settings'
        this.$router.push(toPath)
      }
    },
    mounted() {
      this.updatePath();
    }
};
</script>

<style scoped>
.side-nav {
    position: fixed;
	display: flex;
    flex-direction: column;
	align-items: left;

    top: 30%;
    left: 80px;
	min-height: 50px;
	font-weight: 500;
	z-index: 9;
}

a {
    padding: 5px;
}
.router-link-exact-active {
    color: var(--purple);
}
</style>
