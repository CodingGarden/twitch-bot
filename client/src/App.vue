<template>
  <div id="app">
    <nav-bar />
    <router-view />
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue';

export default {
  components: {
    NavBar,
  },
};
</script>

<style lang="scss">
body {
  margin: 0;
  font-family: 'Share Tech', sans-serif;
  background: hsl(0, 0%, 8%);
  color: hsl(0, 0%, 100%);
}
</style>
