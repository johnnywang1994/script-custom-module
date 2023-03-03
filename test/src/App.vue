<template>
  <div id="app">
    <Counter />
    <Counter2 />
  </div>
</template>

<script setup>
import Counter from 'src/Counter.vue';
</script>

<script>
import Counter2 from 'src/Counter2.vue';

export default {
  components: {
    Counter2,
  },
};
</script>
