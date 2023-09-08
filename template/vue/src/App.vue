<template>
  <div class="home">
    <h2>Welcome to Vue - Script Custom Module</h2>
    <p>If you like this project, click "Like" below!!</p>
    <Counter />
  </div>
</template>

<script setup>
import * as echarts from 'echarts';
import Counter from 'src/components/Counter.vue';

console.log(echarts);
</script>

<script>
export default {
  name: 'App'
};
</script>

<style lang="scss">
.home {
  max-width: 600px;
  margin: auto;
  text-align: center;
}
</style>
