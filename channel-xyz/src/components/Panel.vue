<template>
    <div class="panel">
        <input type="checkbox" class="hitbox">
        <label class="panel-label" for="hitbox">{{ title }}</label>
        <div class="panel-content">
          <p>{{ content }}</p>
        </div>
    </div>
</template>
  
<script>
    export default {
      name: 'Panel',
    }
</script>
  
  <style scoped>
    .panel {
        overflow: hidden;
        position: relative;
        width: 100%;
        border-bottom: 5px dotted black;
        padding: 30px 0px;
        cursor: pointer;
    }
    .panel-label {
      display: flex;
      justify-content: space-between;
      padding: 1rem;
    }
    .panel-label::after {
      position: relative;
      top: -15px;
      right: 0;
      content: "+";
      font-family: "permanent marker";
      font-size: 2rem;
      transition: all .5s;
    }
    .panel-content {
      max-height: 0;
      padding: 0 1em;
      transition: all .5s;
    }
    input:checked ~ .panel-content {
      max-height: 100vh;
      padding: 1em;
    }
  
  </style>
  