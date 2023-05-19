<template>
    <div id="home">
        <Logo />
        <a v-if="homePage" href="/about">
            <div class="byline">
                Channel is a composable media network for the creator
                communities of the future.
            </div>
        </a>
        <Grid :tiles="episodes" />
    </div>
</template>

<style scoped>
.byline {
    margin: 10% auto 0 auto;
    max-width: 300px;
    text-align: center;
}
@media (min-width: 960px) {
    .byline {
        display: none;
    }
}
</style>

<script>
import { mapGetters } from "vuex";
import Logo from "../components/Logo.vue";
import Grid from "../components/Grid.vue";

export default {
    name: "Home",
    components: {
        Logo,
        Grid,
    },
    data() {
        return {
            loading: false,
            index: 0,
        };
    },
    methods: {
        loadNextPage() {
            if (this.$route.path !== "/") return;
            this.loading = true;
            this.$store.dispatch(
                "getEpisodesByPage",
                process.env.VUE_APP_PAGE_LIMIT * this.index
            );
            this.index++;
            this.loading = false;
        },
        checkScroll(e) {
            const el = e.target.activeElement;
            if (window.pageYOffset + el.clientHeight >= el.scrollHeight) {
                this.loadNextPage();
            }
        },
    },
    computed: {
        ...mapGetters(["episodes"]),
        homePage() {
            if (this.$route.path == "/" || this.$route.path == "/home") {
                return true;
            } else {
                return false;
            }
        },
    },
    mounted() {
        // Detect when scrolled to bottom.
        document.addEventListener("scroll", (e) => this.checkScroll(e));

        // Initially load some items.
        this.loadNextPage();
    },
    beforeUnmount() {
        document.removeEventListener("scroll", (e) => this.checkScroll(e));
    },
    unmounted() {},
};
</script>
