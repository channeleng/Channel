<template>
    <div class="badge" :class="{ large: isLarge, small: isSmall }">
        <router-link
            v-if="address"
            @mouseover="showInfo"
            @mouseleave="hideInfo"
            :to="{ name: 'Profile', params: { address: address } }"
        >
            <div class="borders">
                <img :class="{ grow: doShow }" v-bind:src="badge" />
            </div>
        </router-link>
        <div v-if="doShow" class="triangle"></div>
        <div v-if="doShow" class="info">
            <div class="name">{{ name }}</div>
            <div class="description">{{ bio }}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Badge",
    props: {
        address: String,
        badge: String,
        isLarge: Boolean,
        isSmall: Boolean,
        name: String,
        bio: String,
    },
    data() {
        return {
            doShow: false,
        };
    },
    watch: {
        badge: function (newValue) {},
    },
    methods: {
        showInfo() {
            this.doShow = true;
        },
        hideInfo() {
            this.doShow = false;
        },
    },
};
</script>

<style scoped>
.badge {
    position: relative;
    z-index: 9;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-shrink: 0;
    flex-grow: unset;
    min-width: 150px;
}
img {
    max-width: 75px;
    position: absolute;
    left: 0;
    right: 0;
    top: 1px;
    bottom: 0;
    margin: 0 auto;
    clip-path: circle(33px at 50% 50%);
    transform: scale(1);
    transition: transform 0.3s;
}
.borders {
    display: inline-block;
    position: relative;
    width: 77px;
    height: 77px;
    background: #eee;
    box-sizing: border-box;
    clip-path: circle(33px at 50% 50%);
}
.badge.large {
    top: 7%;
}

.badge.small {
    top: 7%;
    margin-top: -5em;
}

.narrow .badge.small {
    top: 11%;
}

.row .badge.small {
    top: 19%;
}

.large img {
    max-width: 100px;
    clip-path: circle(50px at 50% 50%);
}
.large .borders {
    width: 102px;
    height: 102px;
    clip-path: circle(50px at 50% 50%);
}
.small img {
    max-width: 50px;
    clip-path: circle(25px at 50% 50%);
}
.small .borders {
    width: 52px;
    height: 52px;
    clip-path: circle(25px at 50% 50%);
}

img.mini {
    max-width: 30px;
    position: static;
    clip-path: circle(15px at 50% 50%);

    margin: 0;
}
.mini .borders {
    width: 32px;
    height: 32px;
    clip-path: circle(15px at 50% 50%);
}

.triangle {
    position: absolute;
    bottom: -3px;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 10px 12px 10px;
    border-color: transparent transparent #ffffffaa transparent;
}

.info {
    background: rgba(255, 255, 255, 0.6);
    padding: 15px 20px;
    display: flex;
    flex-direction: column;
    filter: drop-shadow(0 0 0.75rem #66666654);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    position: absolute;
    top: 58px;
    max-width: 300px;
    line-height: 1.5em;
    border-radius: 2px;
    text-align: center;
}

.badge.large .info {
    top: 106px;
}

.info .mini,
.info .name,
.info .description {
    margin: 4px 0;
}
.name {
    font-size: 1.3em;
    font-weight: 500;
}

@media (max-width: 960px) {
    /* .badge {
        position: absolute;
        top: 80px;
        left: 0;
        right: 0;
      } */

    .badge.small {
        position: relative;
    }
}
</style>
