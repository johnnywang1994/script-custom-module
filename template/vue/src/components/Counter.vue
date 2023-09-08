<template>
  <div class="counter">
    <span>Count: {{ count }}</span>
    <br>
    <button class="btn" @click="addCount">LIKE!</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const count = ref(0);

const addCount = () => {
  count.value += 1;
}
</script>

<style lang="scss" scoped>
.counter {
  text-align: center;
}
.btn {
  font-size: 16px;
  color: #111111;
}
</style>
