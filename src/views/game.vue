<template>
  <div id="game">
    <dino />
    <div id="offline-resources">
      <img
        id="offline-resources-1x"
        src="../assets/default_100_percent/offline/100-offline-sprite.png"
      />
      <img
        id="offline-resources-2x"
        src="../assets/default_200_percent/offline/200-offline-sprite.png"
      />
      <div id="audio-resources">
        <audio id="offline-sound-press" src="../assets/sounds/button-press.mp3"></audio>
        <audio id="offline-sound-hit" src="../assets/sounds/hit.mp3"></audio>
        <audio id="offline-sound-reached" src="../assets/sounds/score-reached.mp3"></audio>
        <audio id="offline-sound-won" src="../assets/sounds/bruh.mp3"></audio>
      </div>
    </div>
  </div>
</template>

<script>
const dino = require("../components/dino").default

export default {
  name: "game",
  components: { dino },
}
</script>

<style lang="stylus">
#game
  height: 100%
  width: 100%

  #offline-resources
    display: none
</style>