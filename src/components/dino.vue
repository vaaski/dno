<template>
  <div class="dino">
    <div class="wrapper" ref="wrapper"></div>

    <div class="status">
      <div v-if="waiting">waiting</div>
      <div v-else-if="ended && crashed">you lost</div>
      <div v-else-if="ended && !crashed">you won</div>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client"

export default {
  name: "dino",
  data: () => ({
    runner: false,
    destroying: false,
    socket: false,
    waiting: false,
    running: false,
    crashed: false,
    ended: false,
  }),
  computed: {
    room() {
      return this.$route.params.room
    },
  },
  created() {
    window.dino = this
    const self = this

    self.socket = this.dev
      ? io(`http://${location.hostname}:7934`)
      : io("https://colo.vaaski.com", { path: "/dno" })

    self.socket.on("connect", () => self.socket.emit("join", self.room))
    self.socket.on("end", () => {
      console.log("end")
      self.destroying = true
      self.running = false
      self.ended = true
      if (!self.crashed) self.runner.playSound(self.runner.soundFx.WON)
      self.reInit()
    })

    this.offDino()
  },
  mounted() {
    this.init()
    this.generateSeed()
  },
  beforeDestroy() {
    this.destroy()
    this.socket.close()
  },
  methods: {
    reInit() {
      this.destroy()
      this.init()
    },
    init() {
      this.onDino()
      this.runner = new this.Runner(this.$refs.wrapper, { SPEED: 13 })
      this.running = false
      this.waiting = false
    },
    destroy() {
      this.destroying = true
      this.runner.gameOver()
      this.runner.stop()
      this.runner.stopListening()
      this.offDino()
      delete this.runner
      this.$refs.wrapper.innerHTML = ""
    },
    async onCrash() {
      if (this.destroying) return (this.destroying = false)
      console.log("crashed")
      this.running = false
      this.crashed = true
      this.socket.emit("crashed", this.room)
      this.reInit()
    },
    onStart() {
      console.log("onStart")
      const self = this
      return new Promise(res => {
        self.crashed = false
        self.waiting = true
        self.ended = false
        self.socket.emit("ready", self.room, seed => self.generateSeed(seed))
        self.socket.once("start", () => {
          self.waiting = false
          self.running = true
          res()
        })
      })
    },
    onDino() {
      window.onDino.onCrash = this.onCrash
      window.onDino.onStart = this.onStart
    },
    offDino() {
      window.onDino = {}
      window.onDino.onCrash = () => {}
      window.onDino.onStart = () => {}
    },
    generateSeed(seed = "default") {
      const self = this
      console.log("seeded with", seed)
      window.randomFns = {
        obstacleSize: (() => new self.seedrandom(`obstacleSize${seed}`))(),
        obstacleYPosConf: (() => new self.seedrandom(`obstacleYPosConf${seed}`))(),
        gap: (() => new self.seedrandom(`gap${seed}`))(),
        obstacleTypeIndex: (() => new self.seedrandom(`obstacleTypeIndex${seed}`))(),
        obstacleSpeedOffset: (() => new self.seedrandom(`obstacleSpeedOffset${seed}`))(),
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

  .status
    position: absolute
    top: 50%
    left: 50%
    z-index: 2
    transform: translate(-50%, -50%)
    font-size: 2em

  .wrapper
    direction: ltr
    height: 150px
    width: 600px
    max-width: 600px
    overflow: hidden
    position: absolute
    top: 50%
    left: 50%
    z-index: 1
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