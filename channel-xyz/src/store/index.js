import { createStore } from "vuex";
import * as CryptoJS from "crypto-js";

export default createStore({
    state: {
        isConnected: false,
        isCreator: false,
        hasToken: false,
        signedIn: false,
        account: {
            address: ''
        },
        feed: {},
        episodes: [],
        allEpisodes: [],
        creatorEpisodes: [],
        episode: {},
        profiles: {},
        profile: {
            value: {
                imageCid: null,
                name: null,
                website: null,
                ens: null,
                bio: null,
                location: null
            }
        },
        tokenStoreURL: 'https://www.gem.xyz/collection/channel-s0/' // should be coming from .env file
    },
    getters: {
        hasToken( state ) {
            return state.hasToken;
        },
        address( state ) {
            return state.account.address;
        },
        isCreator( state ) {
            return state.isCreator;
        },
        isConnected( state ) {
            return state.isConnected;
        },
        feed( state ) {
            return state.feed;
        },
        creatorEpisodes( state ) {
            return state.creatorEpisodes;
        },
        allEpisodes( state ) {
            return state.allEpisodes;
        },
        episodes( state ) {
            return state.episodes;
        },
        episode( state ) {
            return state.episode;
        },
        profiles( state ) {
            return state.profiles;
        },
        profile( state ) {
            return state.profile;
        },
        signedIn( state ) {
          return state.signedIn;
        }
    },
    mutations: {
        TOGGLE_CREATOR( state ) {
            state.isCreator = !state.isCreator;
        },
        SET_CREATOR( state, val ) {
            state.isCreator = val;
        },
        SET_CONNECTED( state, val ) {
            state.isConnected = val;
        },
        SET_ACCOUNT( state, data ) {
            state.account = data;
        },
        RESET_CREATOR_EPISODES( state ) {
            state.creatorEpisodes = [];
        },
        SET_CREATOR_EPISODES( state, data ) {
            for (var k in data) {
                state.creatorEpisodes = [...state.creatorEpisodes, data[k]]
            }
        },
        SET_ALL_EPISODES( state, data ) {
            state.allEpisodes = data
        },
        SET_EPISODES( state, data ) {
            for (var k in data) {
                state.episodes = [...state.episodes, data[k]]
            }
        },
        SET_EPISODE( state, data ) {
            state.episode = data;
        },
        SET_FEED( state, data ) {
            state.feed = data;
        },
        SET_PROFILE( state, data ) {
            state.profile = data;
        },
        SET_PROFILE_FIELD(state, field ) {
            state.profile.value[field.key] = field.value
        },
        SET_PROFILES( state, data ) {
            state.profiles = data;
        },
        SET_HAS_TOKEN( state, data ) {
            state.hasToken = data
        },
        SET_SIGNED_IN( state, data ) {
          state.signedIn = data
      }
    },
    actions: {
        preSign({ commit }, vars) {
          let body = new FormData();
          body.append("signingMessage", vars.signingMessage)
          return new Promise((resolve) => {
            fetch(`/api/profiles/${this.state.account.address}/preSign`, {
              method: 'POST',
              body: body
            })
            .then((res) => res.json())
            .then((res) => {
                resolve(res.signingMessage);
            })
            .catch((err) => {
                console.log("error:", err);
            });
          })
        },
        checkForToken({ commit }) {
            let profileAddress = this.state.account.address;
            if(typeof profileAddress === 'undefined') return;
            return new Promise((resolve) => {
                fetch(`/api/profiles/${this.state.account.address}/balance`)
                .then((res) => res.json())
                .then(function (data) {
                    commit("SET_HAS_TOKEN", data.balance)
                    resolve();
                })
                .catch((err) => {
                    console.log("checkForToken error:", err);
                });
            })
        },
        signForRSSLink({ commit }, vars) {
          let body = new FormData();
          body.append("signature", vars.signature)
          // encrypt message to send to server so we don't lose any data
          var encryptedMessageAES = CryptoJS.AES.encrypt(vars.message, process.env.VUE_APP_AES_KEY);
          body.append("message", encryptedMessageAES.toString())
          return new Promise((resolve) => {
            fetch(`/api/link/${this.state.account.address}`, {
                method: 'POST',
                body: body
            })
            .then((res) => res.json())
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                console.log("error:", err);
            });
          });
        },
        verifyProfile ({ commit }, address) {
            let profileAddress = address ? address : this.state.account.address;
            if(typeof profileAddress === 'undefined') return;
            return new Promise((resolve) => {
                fetch(`/api/profiles/${profileAddress}/verify`)
                    .then((res) => res.json())
                    .then(function (data) {
                        commit("SET_CREATOR", data.isCreator)
                        resolve();
                    })
                    .catch((err) => {
                        console.log("verifyProfile error:", err);
                    });
            });
        },
        setConnected ({ commit }, val ) {
            return new Promise((resolve) => {
                commit("SET_CONNECTED", val);
                resolve();
            });
        },
        setAccount ( { commit }, data ) {
            return new Promise((resolve) => {
                commit("SET_ACCOUNT", data );
                resolve();
            });
        },
        setSignedIn ({ commit }, val) {
          return new Promise((resolve) => {
            commit("SET_SIGNED_IN", val );
            resolve();
          });
        },
        setProfile ( { dispatch, state }, vars) {
            return new Promise((resolve) => {
                vars.formData.append("signature", vars.signature);
                // encrypt message to send to server so we don't lose any data
                var encryptedMessageAES = CryptoJS.AES.encrypt(vars.message, process.env.VUE_APP_AES_KEY);
                vars.formData.append("message", encryptedMessageAES.toString());
                fetch(`/api/profiles/${state.account.address}`,
                    {
                        method: 'POST',
                        body: vars.formData
                    })
                    .then((res) => res.json())
                    .then((obj) => {
                        dispatch('getProfile', state.account.address);
                        resolve();
                    })
                    .catch((err) => {
                        console.log("error:", err);
                    });
            });
        },
        getProfiles ({ commit }) {
            // console.log("in store, getProfiles");
            return new Promise((resolve) => {
                fetch('/api/profiles')
                    .then((res) => res.json())
                    .then(function (data) {
                        // console.log("got profiles!", data)
                        commit("SET_PROFILES", data );
                        resolve();
                    })
                    .catch((err) => {
                        console.log("error:", err);
                    });
            });
        },
        getProfile ({ commit }, address) {
            let profileAddress = address ? address : this.state.account.address;
            if(typeof profileAddress === 'undefined') return;
            return new Promise((resolve) => {
                fetch(`/api/profiles/${profileAddress}`)
                    .then((res) => res.json())
                    .then(function (data) {
                        if (data) {
                            commit("SET_PROFILE", data);
                        }
                        resolve();
                    })
                    .catch((err) => {
                        console.log("error:", err);
                    });
            });
        },
        getAllEpisodes ({ commit }) {
            return new Promise((resolve) => {
                fetch('/api/episodes/?order=DESC')
                    .then((res) => res.json())
                    .then(function (data) {
                        commit("SET_ALL_EPISODES", data.rows);
                        resolve();
                    })
                    .catch((err) => {
                        console.log("error:", err);
                    });
            });
        },
        getEpisodesByPage ({ commit }, offset) {
            return new Promise((resolve) => {
                fetch('/api/episodes/?order=DESC&limit=' + process.env.VUE_APP_PAGE_LIMIT + '&offset=' + offset)
                    .then((res) => res.json())
                    .then(function (data) {
                        commit("SET_EPISODES", data.rows);
                        resolve();
                    })
                    .catch((err) => {
                        console.log("error:", err);
                    });
            });
        },
        resetCreatorEpisodes({ commit }) {
          commit("RESET_CREATOR_EPISODES");
        },
        getEpisodesByCreator ({ commit }, vars) {
            return new Promise((resolve) => {
                let creatorAddress = vars.address ? vars.address : this.state.account.address;
                fetch('/api/episodes/?order=DESC&creatorAddress=' + creatorAddress + '&limit=' + process.env.VUE_APP_PAGE_LIMIT + '&offset=' + vars.offset)
                    .then((res) => res.json())
                    .then(function (data) {
                        commit("SET_CREATOR_EPISODES", data.rows);
                        resolve();
                    })
                    .catch((err) => {
                        console.log("error:", err);
                    });
            });
        },
        getEpisode ({ commit }, cid) {
            return new Promise((resolve) => {
                fetch('/api/episodes/?cid=' + cid)
                    .then((res) => res.json())
                    .then(function (data) {
                        commit("SET_EPISODE", data.rows[0]);
                        resolve();
                    })
                    .catch((err) => {
                        console.log("error:", err);
                    })
            });
        },
        addEpisode ( { dispatch }, vars ) {
            return new Promise((resolve) => {
                vars.formData.append("signature", vars.signature);
                // encrypt message to send to server so we don't lose any data
                var encryptedMessageAES = CryptoJS.AES.encrypt(vars.message, process.env.VUE_APP_AES_KEY);
                vars.formData.append("message", encryptedMessageAES.toString());
                fetch('/api/episodes/create/',
                    {
                        method: 'POST',
                        body: vars.formData
                    })
                    .then((res) => res.json())
                    .then((res) => {
                        dispatch("resetCreatorEpisodes");
                        dispatch("getEpisodesByCreator", { offset: 0 });
                        resolve(res);
                    })
                    .catch((err) => {
                        console.log("error:", err);
                    });
            });
        },
        deleteEpisode ( { dispatch }, vars ) {
            return new Promise((resolve) => {
                let formData = new FormData();
                formData.append("signature", vars.signature);
                // encrypt message to send to server so we don't lose any data
                var encryptedMessageAES = CryptoJS.AES.encrypt(vars.message, process.env.VUE_APP_AES_KEY);
                formData.append("message", encryptedMessageAES.toString());
                formData.append("creatorAddress", this.state.account.address);
                fetch('/api/episodes/delete/?id=' + vars.id,
                    {
                        method: 'DELETE',
                        body: formData
                    })
                    .then((res) => res.json())
                    .then((res) => {
                        dispatch("resetCreatorEpisodes");
                        dispatch("getEpisodesByCreator", { offset: 0 });
                        resolve(res);
                    })
                    .catch((err) => {
                        console.log("error:", err);
                    });
            });
        }
    },
});
