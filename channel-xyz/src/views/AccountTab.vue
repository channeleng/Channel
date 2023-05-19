<template>
    <div class="account-tab">
        <div class="row wallet">
          <strong>Wallet Address</strong>
          <p>{{ address }}</p>
        </div>
        <div class="row">
          <label for="hosting">Hosting Configuration</label>
          <input v-model="hosting" type="text" placeholder="..." />
        </div>
        <div class="row">
          <label for="integrations">Integrations</label>
          <input v-model="integrations" type="text" placeholder="..." />
        </div>
        <div class="row">
          <label for="verifications">Verifications</label>
          <input v-model="verifications" type="text" placeholder="..." />
        </div>
        <div class="row">
          <label for="email">Email (opt-in)</label>
          <input v-model="email" type="email" placeholder="..." />
        </div>
        <div class="buttons">
          <div class="button" @click="updateAccount">SAVE</div>
          <div class="button del" @click="deleteAccount">DELETE ACCOUNT</div>
        </div>
    </div>
  </template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'AccountTab',
    computed: {
      ...mapGetters(['address', 'profile'])
    },
    data () {
      return {
        hosting: '',
        integrations: '',
        verifications: '',
        email: ''
      }
    },
    methods: {
      updateSettings() {
        const dataObj = {
          hosting: this.hosting,
          integrations: this.integrations,
          verifications: this.verifications,
          email: this.email
        }
        this.$store.dispatch("updateAccount", dataObj);
      },
      deleteAccount() {
      }
    },
    mount () {
    }
  }
</script>

<style scoped>
  .buttons {
    display: flex;
    justify-content: space-between;
  }
  .row {
    display: flex;
    flex-direction: column;
    margin: 5px 0 10px;
  }
  .row label {
    margin: 10px 0 5px;
  }
  .row input {
    height: 30px;
    padding: 5px;
  }
  .row p {
    margin-bottom: 0;
  }
  .button {
    border: 1px var(--black) solid;
      display: block;
      position: relative;
      font-weight: 600;
      border-radius: 5px;
      margin: 13px 0;
      padding: 12px 15px;
      max-width: 200px;
      text-align: center;
      cursor: pointer;
    }
    .button.del {
      background: red;
      color: white;
    }
    .button:hover {
      opacity: .8;
    }
  .row.wallet {
    margin: 20px 0 10px;
  }
</style>
