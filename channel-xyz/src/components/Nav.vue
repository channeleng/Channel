<template>
  <div>
    <div id="nav">
        <div>
            <a
                v-if="homePage && !logomark"
                href="/about"
                class="desktop byline"
            >
                Channel is a composable media network for the creator
                communities of the future.
            </a>
            <a v-else href="/" class="icon">
                <svg
                    width="18px"
                    data-name="Layer 1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 262.31039 245.84041"
                >
                    <title>channel_embled</title>
                    <path
                        d="M126.68748.11413c39.42452,0,78.84951.105,118.27285-.11372,5.88143-.03273,6.65649,1.8663,7.004,7.47393.68347,11.022,1.62145,22.42484,5.08287,32.79251,6.57406,19.69119,7.53632,38.50137-1.79359,57.46577-6.05778,12.31355-6.18138,24.94354-.17587,37.36068,9.23381,19.09247,9.39462,38.18283,1.80368,57.95595-4.71909,12.29189-7.23472,25.26632-4.21031,38.58189a43.93677,43.93677,0,0,0,2.865,8.26381c1.77331,3.92826.324,5.61374-3.59111,5.6726-6.079.09158-12.16146-.04544-18.24.05227-4.25787.06851-5.65989-2.91682-6.86956-6.10651-4.86576-12.83034-3.40747-25.73908-.5667-38.71444a81.21554,81.21554,0,0,0,2.16437-14.46238c.44309-12.96666-7.29617-18.7857-20.59974-17.28291-8.99626,1.01614-15.51784,6.232-20.1371,13.75913-8.83663,14.39976-11.39229,30.25639-9.97143,46.824.27455,3.19911,1.85642,6.34713,3.15084,9.384,2.04806,4.80478,1.22545,6.38056-4.10177,6.55384-4.7026.153-9.44853-.32114-14.11229.13114-5.86213.56881-8.53339-2.2955-10.19981-7.39859-3.97322-12.16782-2.877-24.28361-.27829-36.48439,1.09713-5.15111,2.433-10.379,2.52246-15.59153.21283-12.3856-8.01493-18.93355-20.30426-17.23535a26.57363,26.57363,0,0,0-19.32485,12.05787c-10.08539,15.33585-13.35913,32.32658-10.78157,50.44247a23.71369,23.71369,0,0,0,1.92681,6.12111c3.09107,6.98751,2.50151,7.9448-5.31027,7.99306-4.119.02566-8.29324-.42237-12.34416.10289-6.42953.83392-9.2357-2.50622-10.97086-7.9342-3.904-12.21161-2.591-24.36319.10147-36.54207a93.05155,93.05155,0,0,0,2.07325-10.91459c1.71327-17.49339-9.12928-25.75791-25.76144-19.83363-7.02542,2.50245-11.9159,7.40918-15.539,13.66378-8.2438,14.23142-10.58169,29.734-9.15777,45.8743.26557,3.01264,1.71186,5.99515,2.97615,8.82957,2.29362,5.14216,1.51645,6.60375-4.23477,6.73065-5.0972.1123-10.23962-.37552-15.28738.13655-5.48281.55634-7.918-2.26254-9.44594-6.75467C-.66,227.26427-.05448,215.41523,2.60336,203.6154A143.759,143.759,0,0,1,7.701,186.1884c5.48543-15.10771,5.39479-30.072-1.60615-44.51018-8.19224-16.89491-8.07335-33.36509.03885-50.20326,7.08875-14.71359,6.92418-29.79729,1.27112-45.0571C2.67917,33.66122-.05777,20.52434.68244,6.75673.95013,1.78031,2.7272.00018,7.82607.0216,47.446.18923,87.06688.11413,126.68748.11413Zm-53.3574,112.85C76.371,104.46893,78.96054,96.9279,81.77,89.47c3.09555-8.2172,4.47894-16.49608,2.52223-25.2489C81.57082,52.04832,72.86133,46.149,58.81543,47.30216c-11.923.97871-17.97721,8.08488-19.2116,20.35794-.848,8.4338-3.11388,16.7779-5.33051,25.00428-1.80438,6.696-4.47659,13.15783-6.96444,20.29979Zm148.53536.00047c2.81205-7.957,5.38066-15.46793,8.12161-22.91525,2.94036-7.98906,4.72238-15.97742,2.90246-24.61275C230.10571,52.228,222.446,46.44965,207.94409,47.261c-12.12356.67806-19.29283,7.47652-19.6401,20.32-.27687,10.24619-3.27442,19.51626-6.90817,28.82941-2.03276,5.2095-3.47575,10.64926-5.36677,16.55423Zm-119.60115.0299H147.897c2.99334-8.40178,5.72487-16.49443,8.75941-24.472,3.23231-8.4969,4.102-17.08255,1.726-25.89376-3.04866-11.30589-11.42737-16.42474-24.932-15.33844-11.477.92315-18.03819,6.992-18.684,18.6369a93.93093,93.93093,0,0,1-7.75786,31.67607C105.00733,102.34035,103.93256,107.46885,102.26429,112.99455Z"
                    />
                </svg>
            </a>
        </div>
        <div class="secondary">
            <router-link v-if="!isSearchActive && isCreator" to="/dashboard"
                >Dashboard</router-link
            >
            <a href="/about">About</a>
            <div class="searchIcon" @click="doSearch">Search</div>
            <Wallet />
        </div>
        <div v-if="onCoverShow" class="cover"></div>
    </div>

    <div class="search" :class="{ active: isSearchActive }">
        <SearchModal
            :active="isSearchActive"
            :isScrolling="false"
            terms="creators"
            @searchChanged="handleSearchChange"
            @searchSelected="handleSearchSelected"
        />
    </div>
  </div>
</template>

<script>
import SearchModal from "../components/SearchModal.vue";
import Wallet from "./Wallet/Wallet.vue";

export default {
    name: "Nav",
    props: ["logomark"],
    components: {
        Wallet,
        SearchModal,
    },
    data() {
        return {
            isSearchActive: false,
            onCoverShow: false,
        };
    },
    computed: {
        isCreator() {
            return this.$store.state.isCreator;
        },
        homePage() {
            if (this.$route.path == "/" || this.$route.path == "/home") {
                return true;
            } else {
                return false;
            }
        },
    },
    methods: {
        doSearch: function () {
            this.isSearchActive = true;
        },
        handleSearchChange: function (s) {
            !s ? (this.onCoverShow = false) : (this.onCoverShow = true);
        },
        handleSearchSelected: function () {
            this.onCoverShow = false;
            this.isSearchActive = false;
        },
    },
};
</script>

<style scoped>
#nav {
    display: flex;
    justify-content: space-between;
    align-items: center;

    min-height: 50px;
    font-weight: 500;
    z-index: 9;
}

#nav .cover {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    height: 100vh;
    background: #fff;
    opacity: 0.9;
    pointer-events: none;
    z-index: -1;
}

#nav .mobile {
    display: none;
}

.byline {
    display: inline-block;
    max-width: 300px;
}
@media (max-width: 960px) {
    .byline {
        display: none;
    }
}
.primary {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    margin: 0 auto;
}

.primary a,
.primary .search,
.primary .subscribe {
    position: relative;
    display: inline;
    margin: 0 0 0 12px;
    white-space: nowrap;
}

.primary .search.active {
    margin-left: -80px;
}

.secondary {
    display: flex;
    align-items: center;
}

.secondary a,
.searchIcon {
    cursor: pointer;
    margin-right: 30px;
}

@media (max-width: 960px) {
    #nav .desktop {
        display: none;
    }
    #nav .mobile {
        display: block;
        font-weight: 500;
    }
    .primary {
        position: fixed;
        z-index: 99;
        bottom: 50px;
        display: flex;
        justify-content: center;
        background-color: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        background: hsla(0, 0%, 88%, 0.7);
        backdrop-filter: blur(5px);
    }
    .secondary {
        margin-right: 0px;
    }
}

.loggedIn {
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 3px 7px;
    border-radius: 20px;
}

.loggedIn:hover {
    background: #eee;
}

.loggedIn .badge {
    width: 30px;
    height: 30px;
    border: 0;
}
.loggedIn svg {
    width: 15px;
    margin-left: 10px;
}
</style>
