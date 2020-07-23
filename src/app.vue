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

html
  filter: invert(0)
  transition: filter 1s

  &.inverted
    filter: invert(1)

    @media (prefers-color-scheme: dark)
      .runner-canvas
        filter: invert(0) !important

#app
  height: 100%
  width: 100%
  background: #eee
  color: #111

#app, input, button
  font-family: "Roboto Mono", monospace

@media (prefers-color-scheme: dark)
  #app
    background: #111
    color: #eee
</style>
