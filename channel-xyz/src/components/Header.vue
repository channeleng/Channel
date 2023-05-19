<template>
  <div>
    <div id="header-spacer"></div>
    <div id="fixed-header" class="active">
      <Nav v-bind:logomark="this.scrollPosition > 250" />
    </div>
  </div>
</template>

<script>
import Nav from "./Nav.vue";

export default {
    name: "Header",
    components: {
        Nav,
    },
    data() {
        return {
            scrollPosition: 0,
        };
    },
    methods: {
        updateScroll() {
            this.scrollPosition = window.scrollY;
        },
    },
    mounted() {
        window.addEventListener("scroll", this.updateScroll);
    },
};
</script>

<style scoped>
#header {
    position: relative;
    margin: 0;
    padding: 4%;
    background-color: rgba(255, 255, 255, 0.95);
    width: 100%;
    top: 0;
    z-index: 100;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    z-index: 10;
}

@media (max-width: 700px) {
    #header.white {
        background-color: transparent;
    }
    #fixed-header {
      padding: 10px 4% !important;
    }
    #header-spacer {
      height: 50px !important;
    }
}

#header.white,
#header.white a,
#header.white svg {
    color: white;
    fill: white;
    stroke: white;
}

#header.active {
    position: fixed;
    margin: 0;
}

#header.active,
#header.active a,
#header.active svg {
    color: black;
    stroke: black;
}

#header.white.active svg {
    fill: black;
    stroke: none;
}

#header nav {
    min-height: 50px;
    align-items: center;
    font-weight: 500;
    z-index: 9;
}

#header-spacer {
  height: 130px;
}

#fixed-header {
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(255, 255, 255, 0.95);
    width: 100%;
    z-index: 100;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    padding: 50px 4%;
    /* transition: transform 300ms; */
    transform: translateY(-100%);
}

#fixed-header.active {
    transform: translateY(0%);
}
</style>
