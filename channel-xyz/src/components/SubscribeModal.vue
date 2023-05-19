<script>
   import SearchModal from './SearchModal.vue'

    export default {
        name: 'SubscribeModal',
        components: {
            SearchModal
        },
        props: {
            active: Boolean
        },
        mounted () {
        }
    }
</script>

<template>
    <div v-if="active" id="subscribeModal">
        <h2>Subscribe</h2>
        <div class="searchContainer">
            <a class="searchIcon" @click="doSearch">
                <svg viewBox="0 0 16 16"><path fill="#000" d="M11.3,9.2C11.7,8.4,12,7.5,12,6.5C12,3.5,9.5,1,6.5,1S1,3.5,1,6.5S3.5,12,6.5,12c1,0,1.9-0.3,2.7-0.7l3.3,3.3c0.3,0.3,0.7,0.4,1.1,0.4s0.8-0.1,1.1-0.4c0.6-0.6,0.6-1.5,0-2.1L11.3,9.2zM6.5,10.3c-2.1,0-3.8-1.7-3.8-3.8c0-2.1,1.7-3.8,3.8-3.8c2.1,0,3.8,1.7,3.8,3.8C10.3,8.6,8.6,10.3,6.5,10.3z"></path></svg>
            </a>
            <SearchModal :active="active" :isScrolling="true" />
        </div>
        <div class="button">Subscribe</div>
    </div>
</template>

<style scoped>
    body {
        overflow: hidden !important;
    }
    h2 {
        margin-bottom: 0;
        text-align: center;
    }
    #subscribeModal {
        border: 1px solid #000;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 360px;
        height: 500px;
        margin: auto;
        padding: 20px;
    }
    .searchIcon {
        position: absolute;
        left: 100px;
        top: 66px;
    }
    .searchIcon svg {
        width: 13px;
        height: 13px;
        margin-bottom: -2px;
        margin-right: 3px;
    }

    .searchIcon svg path {
        stroke: none;
    }

    .button {
        margin: 0 auto;
        text-align: center;
        width: 110px;
        background: var(--purple);
        color: white;
        position: relative;
        font-weight: 600;
        border-radius: 5px;
        padding: 12px 15px;
        cursor: pointer;
        top: -20px;
    }
</style>
