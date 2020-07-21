const io = require("socket.io")()

const random = length => {
  let result = ""
  const characters = "abcdefghijklmnopqrstuvwxyz"
  for (let i = 0; i < length; i++)
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  return result
}

io.on("connection", client => {
  client.on("join", room => {
    // console.log("joinroom", room, client.id)
    client.join(room)
  })
  client.on("getroom", (room, reply = () => {}) => {
    reply(io.sockets.adapter.rooms[room].length)
  })
  client.on("ready", (room, reply = () => {}) => {
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
})

io.listen(7934)
console.log("listening on port 7934")
