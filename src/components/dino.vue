<template>
  <div class="dino">
    <div
      class="wrapper"
      ref="wrapper"
      :style="{ transform: `translate(-50%, -50%) scale(${(width / 600) *scaling})` }"
    ></div>

    <div class="status">
      <div v-if="waiting">waiting</div>
      <div v-else-if="ended && crashed">you lost</div>
      <div v-else-if="ended && !crashed">you won</div>
      <div v-else-if="paused">paused</div>
    </div>
    <div class="roominfo">
      <div class="info">players: {{ roomConf.length }}</div>
      <div class="info" v-for="(info, key) in roomConf" :key="key">
        <span v-if="key !== 'length'">{{ key }}: {{ yn(info) }}</span>
      </div>
    </div>
    <div class="tutorial">
      <p>
        W, ARROW_UP or SPACE to
        <span class="highlight">jump</span>
      </p>
      <p>
        S or ARROW_DOWN to
        <span class="highlight">duck</span>
      </p>
      <p>
        A, D, Q, E, B, ARROW_LEFT or ARROW_RIGHT to
        <span class="highlight">pause</span>
      </p>
      <p>
        U to
        <span class="highlight">unpause</span>
      </p>
    </div>
  </div>
</template>

<script>
import Runner from "../assets/dino"
import io from "socket.io-client"
const throttle = (fn, wait) => {
  let inThrottle, lastFn, lastTime
  return function() {
    const context = this,
      args = arguments
    if (!inThrottle) {
      fn.apply(context, args)
      lastTime = Date.now()
      inThrottle = true
    } else {
      clearTimeout(lastFn)
      lastFn = setTimeout(function() {
        if (Date.now() - lastTime >= wait) {
          fn.apply(context, args)
          lastTime = Date.now()
        }
      }, Math.max(wait - (Date.now() - lastTime), 0))
    }
  }
}
const wait = t => new Promise(r => setTimeout(r, t))
const ls = (k, v) =>
  v ? localStorage.setItem(k, JSON.stringify(v)) : JSON.parse(localStorage.getItem(k))

window.setBruh = b => ls("bruhMode", b)

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
    width: window.document.body.offsetWidth,
    scaling: 0.8,
    paused: false,
    roomConf: {
      length: 0,
    },
    bruhMode: ls("bruhMode"),
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

    self.socket.on("connect", () => {
      self.socket.emit("join", self.room, conf => {
        self.roomConf = conf
      })
    })
    self.socket.on("end", () => {
      self.log("end")
      self.destroying = true
      self.running = false
      self.ended = true
      if (!self.crashed) {
        if (localStorage) self.runner.playSound(self.runner.soundFx.WON)
        else self.runner.playSound(self.runner.soundFx.SCORE)
      }
      self.reInit()
    })
    self.socket.on("pause", newSeed => {
      self.log("pause")
      self.runner.tRex.reset()
      self.paused = true
      self.generateSeed(newSeed)
      self.runner.horizon.obstacles = []
      requestAnimationFrame(() => self.runner.stop())
    })
    self.socket.on("unpause", async () => {
      self.log("unpause")
      self.paused = false
      await wait(1e3)
      self.runner.play()
    })
    self.socket.on("update", conf => {
      self.log("update", conf)
      self.roomConf = conf
      self.reInit()
    })

    this.offDino()
  },
  mounted() {
    const self = this
    this.init()
    this.generateSeed()
    const pauseKeys = ["b", "a", "d", "e", "q", "ArrowLeft", "ArrowRight"]

    window.document.body.onresize = throttle(() => {
      self.width = window.document.body.offsetWidth
    }, 250)
    window.document.body.onkeydown = e => {
      // self.log(e)
      if (pauseKeys.includes(e.key))
        if (self.running && !self.paused) return self.socket.emit("pause", self.room)

      if (e.key === "u" && self.running) return self.socket.emit("unpause", self.room)
    }
  },
  beforeDestroy() {
    window.document.body.onresize = null
    window.document.body.onkeydown = null
    this.destroy()
    this.socket.close()
  },
  methods: {
    yn: a => {
      if (a === true) return "enabled"
      else if (a === false) return "disabled"
      return a
    },
    reInit() {
      this.destroy()
      this.init()
    },
    init() {
      let SPEED = 13
      if (typeof this.roomConf.highSpeed === "number") SPEED = this.roomConf.highSpeed
      this.onDino()
      this.log("speed", SPEED)
      this.runner = new Runner(this.$refs.wrapper, { SPEED })
      this.running = false
      this.waiting = false
      window.document.documentElement.classList.remove("inverted")
    },
    destroy() {
      this.destroying = true
      this.runner.gameOver(true)
      this.runner.stop()
      this.runner.stopListening()
      this.offDino()
      delete this.runner
      this.$refs.wrapper.querySelector(".runner-container").remove()
    },
    async onCrash() {
      if (this.destroying) return (this.destroying = false)
      this.log("crashed")
      this.running = false
      this.crashed = true
      this.socket.emit("crashed", this.room)
      this.reInit()
    },
    onStart() {
      this.log("onStart")
      const self = this
      return new Promise(res => {
        self.crashed = false
        self.waiting = true
        self.ended = false
        self.socket.emit("ready", self.room)
        self.socket.once("start", seed => {
          self.waiting = false
          self.running = true
          self.generateSeed(seed)
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
      this.log("seeded with", seed)
      self.roomConf.seed = seed
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
  width: 100%
  height: 100%

  .tutorial
    position: absolute
    right: 0
    padding: 4px 8px
    font-size: 0.8em

    p
      margin: 0
      text-align: right
      color: rgba(255, 255, 255, 0.5)

      span.highlight
        color: #fff

  .status
    position: absolute
    top: 50%
    left: 50%
    z-index: 2
    transform: translate(-50%, -50%)
    font-size: 2em

  .roominfo
    padding: 4px 8px
    opacity: 0.5
    position: absolute
    font-size: 0.8em

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
      transition: filter 1s

      @media (prefers-color-scheme: dark)
        filter: invert(1)
</style>