<template>
  <div id="roomselect">
    <h1>select room</h1>
    <div class="random">
      <button @click="goToRoom(random(5))">random</button>
    </div>
    <div class="by-id">
      <input v-model="idInput" type="text" class="id" />
      <button @click="goToRoom(idInput)">go</button>
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