<template>
  Count: {{ count }}
  <button class="btn" @click="addCount">ADD COUNT</button>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const count = ref<number>(16);

const fontsize = computed(() => count.value + 'px');

const addCount = () => {
  count.value += 1;
}
</script>

<style lang="scss" scoped>
.btn {
  color: red;
}
</style>

<style lang="scss">
.btn {
  font-size: v-bind(fontsize);
}
</style>
