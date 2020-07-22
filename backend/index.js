const io = require("socket.io")()

const random = length => {
  let result = ""
  const characters = "abcdefghijklmnopqrstuvwxyz"
  for (let i = 0; i < length; i++)
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  return result
}

const getRoomConf = room => {
  const { config, length } = io.sockets.adapter.rooms[room]
  return { ...config, length }
}

io.on("connection", client => {
  client.on("join", (room, reply = () => {}) => {
    client.join(room)

    const r = io.sockets.adapter.rooms[room]
    if (!r.config)
      r.config = {
        highSpeed: false,
      }
    reply(getRoomConf(room))
    io.to(room).emit("update", getRoomConf(room))
  })
  client.on("getroom", (room, reply = () => {}) => {
    reply(getRoomConf(room))
  })
  client.on("ready", async (room, reply = () => {}) => {
    const r = io.sockets.adapter.rooms[room]
    console.log("ready", client.id, r)
    if (!r.seed) r.seed = random(10)
    if (!r.isReady) r.isReady = 1
    else r.isReady++
    if (r.isReady >= r.length) {
      io.to(room).emit("start")
      r.running = r.length
      delete r.isReady
    }
    reply(r.seed)
  })
  client.on("crashed", room => {
    const r = io.sockets.adapter.rooms[room]
    console.log("crashed", client.id, r)
    r.running--
    if (r.running <= 1) {
      io.to(room).emit("end")
      delete r.running
      delete r.seed
    }
  })
  client.on("pause", room => {
    console.log("pause", client.id)
    io.to(room).emit("pause")
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
