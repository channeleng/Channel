<template>
    <div id="episodes">
        <div class="panel">
            <input ref="editorBox" type="checkbox" id="editorBox" />
            <label class="panelLabel" for="editorBox">
                <h2>Create new episode...</h2>
            </label>
            <div class="panelContent">
                <Editor
                    :onPublished="onPublished"
                    :onError="onError"
                    @publish="createEpisode"
                />
            </div>
        </div>
        <div v-if="creatorEpisodes.length" class="list">
            <Row
                v-for="(e, index) in creatorEpisodes"
                :key="index"
                :data="e.value"
                :cid="e.cid"
                @delete="deleteEpisode(e.id)"
            />
        </div>
        <div v-else class="no-list">
            <p>You haven't created any episodes yet...</p>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from "vuex";
import { useSignMessage } from "vagmi";

const onPublished = ref(false);
const onError = ref(false);
const editorBox = ref(null);

const store = useStore();
const { signMessage } = useSignMessage({
    onSuccess(signature, vars) {
        if (vars.method == "create") {
            store
                .dispatch("addEpisode", {
                    signature: signature,
                    message: vars.message,
                    formData: vars.formData,
                })
                .then((res) => {
                    editorBox.value.checked = false;
                    onPublished.value = true;
                })
                .catch((err) => {
                    console.log("error adding episode", err);
                    onError.value = true;
                });
        } else if (vars.method == "delete") {
            store
                .dispatch("deleteEpisode", {
                    signature: signature,
                    message: vars.message,
                    id: vars.id,
                })
                .then((res) => {
                    console.log("deleted episode", res);
                })
                .catch((err) => {
                    console.log("delete episode", err);
                });
        }
    },
});
function createEpisode(formData) {
    // need to first sign / authenticate
    if (!store.state.account.address || !store.state.isConnected) {
        console.log("Not connected. Can't sign message. Connect wallet.");
        return;
    }
    const method = "create";
    // const message = `Create new Episode`;

    // presign message to increment user nonce and return message for signing
    store
        .dispatch("preSign", { signingMessage: "signForEpisodeCreate" })
        .then((message) => {
            signMessage({ method, message, formData });
        });
}
function deleteEpisode(id) {
    // need to first sign / authenticate
    if (!store.state.account.address || !store.state.isConnected) {
        console.log("Not connected. Can't sign message. Connect wallet.");
        return;
    }
    const method = "delete";

    // presign message to increment user nonce and return message for signing
    store
        .dispatch("preSign", { signingMessage: "signForEpisodeDelete" })
        .then((message) => {
            signMessage({ method, message, id });
        });
}
</script>

<script>
import { mapGetters } from "vuex";
import Editor from "../components/Editor.vue";
import Row from "../components/Row.vue";

export default {
    name: "Episodes",
    components: {
        Editor,
        Row,
    },
    data() {
        return {
            address: "",
            loading: false,
            index: 0,
        };
    },
    computed: {
        ...mapGetters(["creatorEpisodes"]),
    },
    methods: {
        loadNextPage() {
            if (!this.$route.path.includes("/episodes")) return;
            this.loading = true;
            this.$store.dispatch("getEpisodesByCreator", {
                offset: process.env.VUE_APP_PAGE_LIMIT * this.index,
            });
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
    mounted() {
        this.$store.dispatch("resetCreatorEpisodes");
        // Detect when scrolled to bottom.
        document.addEventListener("scroll", (e) => this.checkScroll(e));

        // Initially load some items.
        this.loadNextPage();
    },
    beforeUnmount() {
        document.removeEventListener("scroll", (e) => this.checkScroll(e));
    },
};
</script>

<style scoped>
#episodes {
    max-width: 800px;
    margin: 0 auto;
}
.panel {
    border-top: 1px #e6e6e6 solid;
    border-bottom: 1px #e6e6e6 solid;
    overflow: hidden;
    width: 100%;
}
.panelLabel {
    border-left: 1px #e6e6e6 solid;
    border-right: 1px #e6e6e6 solid;
    display: flex;
    justify-content: space-between;
    padding: 1rem;
    cursor: pointer;
}
.panelLabel h2 {
    margin-bottom: 0;
}
.panelLabel::after {
    position: relative;
    top: -5px;
    right: 0;
    content: "+";
    font-family: "permanent marker";
    font-size: 2rem;
    transition: all 0.5s;
}
.panelContent {
    max-height: 0;
    transition: all 0.5s;
}
#editorBox {
    display: none;
}
input:checked ~ .panelContent {
    max-height: 100vh;
    height: 659px;
}
.list {
    border: 1px #e6e6e6 solid;
    margin-top: 50px;
}
.no-list {
    margin-top: 50px;
}
</style>
