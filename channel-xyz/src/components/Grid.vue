<template>
  <div class="grid">
    <Tile v-for="(t, index) in tiles"
      :key="index" 
      :data="t.value"
      :isNarrow="isNarrow"
    />
  </div>
</template>
  
<script>
  import Tile from './Tile.vue'

  export default {
    name: 'Grid',
    components: {
      Tile
    },
    props: {
      isNarrow: Boolean,
      tiles: Array
    }
  }
  </script>
  
  <style scoped>
  .grid {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    padding-top: 50px;
  }
  </style>
  