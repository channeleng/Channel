<template>
    <div class="copyText">
      <input
        :value="rssLinkText"
        type="text"
      />
      <div type="button" @click="doCopy">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><polyline points="168 168 216 168 216 40 88 40 88 88" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="12"/><rect x="40" y="88" width="128" height="128" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="12"/></svg>
      </div>
    </div>
</template>

<script>
  import { copyText } from 'vue3-clipboard'

  export default {
    name: 'CopyText',
    props: {
      rssLinkText: String,
    },
    setup(props) {
      const doCopy = () => {
        copyText(props.rssLinkText, undefined, (error, event) => {
          if (error) {
            alert('Can not copy')
            console.log(error)
          } else {
            alert('Copied')
          }
        })
      }

      return { doCopy }
    }
  }
</script>

<style scoped>
  .copyText {
    cursor: pointer;
    display: flex;
    margin: 10px auto;
    justify-content: center;
  }
  .copyText svg {
    width: 22px;
  }
  .copyText input {
    border: 0;
    outline: none;
    background: rgba(223, 222, 222, .5);
    width: 100%;
    max-width: 515px;
  }
</style>
