<template>
  <span :style="`font-size: ${fontsize}`">Count: {{ count }}</span>
  <button class="btn" @click="addCount">ADD COUNT</button>
</template>

<script setup>
import { ref, computed } from 'vue'

const count = ref(16);

const fontsize = computed(() => `${count.value}px`);

const addCount = () => {
  count.value += 1;
}
</script>

<style lang="scss" scoped>
.btn {
  font-size: 16px;
  color: blue;
}
</style>

<style lang="scss">
.btn {
  text-decoration: underline;
}
</style>
