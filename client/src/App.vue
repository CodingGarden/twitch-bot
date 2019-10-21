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
@import '~@/styles/variables.scss';

body {
  margin: 0;
  font-family: 'Share Tech', sans-serif;
  background: hsl(0, 0%, 8%);
  color: hsl(0, 0%, 100%);
}

.error {
  color: $red;
}

label {
  margin-right: 1em;

  > div {
    font-size: 0.9em;
    font-weight: bold;
    margin-bottom: 4px;
    cursor: pointer;
  }
  select,
  input {
    border-radius: 4px;
    font-family: inherit;
    font-size: 1.15rem;
    box-sizing: border-box;
    padding: 0.25em 0.5em;
    border: 0;
    outline-color: $orange;
  }
  select {
    appearance: none;
    cursor: pointer;
    padding-right: 2em;
  }
}
</style>
