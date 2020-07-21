<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  created() {
    window.vue = this
  },
}
</script>

<style lang="stylus">
body, html
  margin: 0
  padding: 0
  position: relative
  height: 100%
  width: 100%

#app
  height: 100%
  width: 100%
  background: #eee

@media (prefers-color-scheme: dark)
  #app
    background: #111
</style>
