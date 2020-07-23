<template>
  <div id="roomselect">
    <div class="inner">
      <h1>select room</h1>
      <div class="random">
        <button @click="goToRoom(random(5))">random</button>
      </div>
      <div class="or">OR</div>
      <form class="by-id">
        <input placeholder="by id" v-model="idInput" type="text" class="id" />
        <button @click="goToRoom(idInput)">go</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "roomselect",
  data: () => ({
    idInput: "",
  }),
  methods: {
    random(length) {
      let result = ""
      const characters = "abcdefghijklmnopqrstuvwxyz"
      for (let i = 0; i < length; i++)
        result += characters.charAt(Math.floor(Math.random() * characters.length))
      return result
    },
    goToRoom(room) {
      this.$router.push(`/game/${room}`)
    },
  },
}
</script>

<style lang="stylus">
#roomselect
  height: 100%
  width: 100%
  position: relative
  display: flex
  justify-content: center
  align-items: center
  flex-direction: column

  .or
    display: flex
    position: relative
    opacity: 0.5
    margin: 8px 0

    &:before, &:after
      content: " "
      flex-grow: 1
      border-bottom: 1px solid #fff
      margin: auto 12px

  h1
    margin: 0
    margin-bottom: 16px

  button
    background: #222
    border: none
    color: #fff
    padding: 6px 12px
    margin: 4px 0
    cursor: pointer

  .by-id
    display: flex

    input
      margin: 4px 0
      border: none
      flex-grow: 1
      text-align: center
      background: #ddd

  .random
    button
      width: 100%
</style>