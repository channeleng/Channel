<script setup>

const checkBalance = () => {
  console.log("check balance");
}

</script>

<script>
export default {
    name: "CheckBalance",
    mounted() {
    }
}
</script>

<template>
    <div>
        <button @click="checkBalance()">
            Check Balance
        </button>
    </div>
</template>
