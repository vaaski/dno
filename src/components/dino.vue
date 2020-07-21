<template>
  <div class="dino">
    <div class="wrapper" ref="wrapper"></div>
  </div>
</template>

<script>
export default {
  name: "dino",
  data: () => ({
    runner: false,
  }),
  created() {
    window.dino = this
  },
  mounted() {
    this.generateSeed("tester")
    this.runner = new this.Runner(this.$refs.wrapper)
  },
  methods: {
    generateSeed(seed = "default") {
      const self = this
      window.randomFns = {
        obstacleSize: (() => new self.seedrandom(`obstacleSize-${seed}`))(),
        obstacleYPosConf: (() => new self.seedrandom(`obstacleYPosConf-${seed}`))(),
        gap: (() => new self.seedrandom(`gap-${seed}`))(),
        obstacleTypeIndex: (() => new self.seedrandom(`obstacleTypeIndex-${seed}`))(),
      }
    },
  },
}
</script>

<style lang="stylus">
.dino
  font-size: 1em
  max-width: 600px
  width: 100%
  height: 100%

  .wrapper
    direction: ltr
    height: 150px
    width: 600px
    max-width: 600px
    overflow: hidden
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%) scale(1.5)
    image-rendering: pixelated

    .runner-canvas
      height: 150px
      max-width: 600px
      opacity: 1
      overflow: hidden
      position: absolute
      top: 0
      z-index: 10

      @media (prefers-color-scheme: dark)
        filter: invert(1)
</style>