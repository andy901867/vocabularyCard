<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  created(){
    this.$store.dispatch('fetchCardGroups')
    this.$store.dispatch('initFetchVocaularies')
  }
}
</script>

<style lang="scss">
@import "../node_modules/bootstrap/scss/bootstrap";
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: #ddd;
  min-height:100vh;
  display: flex;
  flex-direction: column;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
