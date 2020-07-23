const io = require("socket.io")()

const random = length => {
  let result = ""
  const characters = "abcdefghijklmnopqrstuvwxyz"
  for (let i = 0; i < length; i++)
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  return result
}

const getRoomConf = room => {
  const { config, length, seed, isReady } = io.sockets.adapter.rooms[room]
  return { ...config, length, seed, isReady }
}

io.on("connection", client => {
  client.on("join", (room, reply = () => {}) => {
    client.join(room)

    const r = io.sockets.adapter.rooms[room]
    if (!r.config)
      r.config = {
        highSpeed: false,
      }
    if (!r.seed) r.seed = "none"
    if (typeof r.isReady !== "number") r.isReady = 0

    reply(getRoomConf(room))
    io.to(room).emit("update", getRoomConf(room))
  })
  client.on("getroom", (room, reply = () => {}) => {
    reply(getRoomConf(room))
  })
  client.on("ready", async (room, reply = () => {}) => {
    const r = io.sockets.adapter.rooms[room]
    console.log("ready", client.id, r)

    r.isReady++

    if (r.isReady >= r.length) {
      r.seed = random(10)
      r.running = r.length
      r.isReady = 0
      io.to(room).emit("start", r.seed)
    }
  })
  client.on("crashed", room => {
    const r = io.sockets.adapter.rooms[room]
    console.log("crashed", client.id, r)
    r.running--
    if (r.running <= 1) {
      io.to(room).emit("end")
      r.running = 0
    }
  })
  client.on("pause", room => {
    console.log("pause", client.id)
    const r = io.sockets.adapter.rooms[room]
    r.seed = random(10)

    io.to(room).emit("pause", r.seed)
  })
  client.on("unpause", room => {
    console.log("unpause", client.id)
    io.to(room).emit("unpause")
  })
  client.on("changeRoomConfig", ({ room, conf }) => {
    const r = io.sockets.adapter.rooms[room]
    r.config = { ...r.config, ...conf }
    io.to(room).emit("update", getRoomConf(room))
  })
})

io.listen(7934)
console.log("listening on port 7934")
