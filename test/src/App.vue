<template>
  <div id="app">
    <Counter />
    <Counter2 />
  </div>
</template>

<script setup>
import Counter from './Counter.vue';
</script>

<script>
import Counter2 from './Counter2.vue';

export default {
  components: {
    Counter2,
  },
};
</script>
