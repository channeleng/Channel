<template>
    <a
        class="button"
        :href="href"
        target="_blank"
    >
        {{ label }}
  </a>
</template>

<script>
  export default {
    name: 'ExtSubscribeButton',
    props: {
      href: String,
      label: {
            type: String,
            default: "Subscribe"
        }
    }
  }
</script>

<style scoped>
  a {
    display: block;
  }
  .button {
    background: var(--purple);
    color: white;
    position: relative;
    font-weight: 600;
    border-radius: 5px;
    margin: 4px auto 23px;
    padding: 12px 15px;
    cursor: pointer;
    text-align: center;
    max-width: 130px;
  }
  .button:hover {
    opacity: .8;
  }
</style>
