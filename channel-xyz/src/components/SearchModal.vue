<template>
    <div v-if="active" class="searchModal" :class="{scrolling: isScrolling}">
      <div class="searchInput">
        <input type="text" ref="input" autofocus v-model="searchInput" @input="$emit('searchChanged', $event.target.value)" placeholder="Search by creator or episode">
      </div>
      <div class="searchResults">
        <div class="item result" v-for="result in searchAction" :key="result.value.cid">
          <SearchRow 
            :cid="result.value.cid"
            :data="result.value"
            @click="$emit('searchSelected')"
          />
        </div>
      </div>
      <div class="item error" v-if="searchInput&&!searchAction.length">
        <p>No results found</p>
      </div>
    </div>
  </template>
  
  <script>
    import { mapGetters } from 'vuex';
    import SearchRow from './SearchRow.vue';

  export default {
    name: 'SearchModal',
    components: {
      SearchRow
    },
    props: {
      active: Boolean,
      isScrolling: Boolean,
      terms: String
    },
    watch: {
      active(newValue) {
        if (!newValue) {
          this.searchInput = ''
          this.$refs.input.value = ''
        }
      }
    },
    data() {
      return {
        searchInput: '',
      }
    },
    computed: {
      ...mapGetters(['allEpisodes']),
      searchAction() {
        if (this.searchInput != '' && this.searchInput && this.allEpisodes.length) {
          const results =  this.allEpisodes.filter((ep) => {
            return Object.keys(ep.value).find(key => typeof ep.value[key] === 'string' ? ep.value[key].toLowerCase().includes(this.searchInput.toLowerCase()) : false)
          })
          return results;
        }
        return [];
      }
    }
  }
  </script>
  
  <style scoped>

.scrolling.searchModal {
  margin: 0;
  position: static;
  height: 390px;
}

.searchInput input {
    display: block;
    border: 0;
    background: 0;
    padding: 10px;
    margin: 0 90px;
    width: 225px;
    font-family: system-ui, sans-serif;
    font-size: 14px;
    font-weight: 500;
    margin: 0 auto;
}

.searchInput input:focus {
    outline: 0;
}

.searchResults {
    margin: 0 auto;
}

.scrolling .searchResults {
  overflow-y: scroll;
  height: 320px;
  overflow-x: hidden;
}

.searchResults .item {
    display: flex;
    cursor: pointer;
}

.searchResults .item .details {
    display: block;
    margin-top: 0;
}

.searchResults .item:hover {
    opacity: 0.7;
}

.searchResults .item .thumbnail {
    margin-right: 10px;
    flex-shrink: 0;
    width: 100px;
}
  </style>
  