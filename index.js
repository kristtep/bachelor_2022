var express = require('express');
const app = express();
const server = require("http").createServer(app);
const cors = require("cors");

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("Server is running");
});

io.on("connection", (socket) => {

    socket.on("initial connect", (room) => {
        socket.join(room);
    });

    socket.on('message', (message, room) => {
        socket.to(room).emit('message', message, room);
    });

    socket.on('create or join', (room, client) => {
        var cliInRoom = io.sockets.adapter.rooms.get(room);
        var numCli = cliInRoom ? cliInRoom.size : 0;
        console.log("room " + room + " has " + numCli + " clients.");

        if (numCli === 0) {
            io.sockets.in('PreVis').emit('ready', room, client);
            socket.join(room);
            socket.emit("created", room);
        } else {
            io.sockets.in(room).emit("join", room, client);
            socket.join(room);
            socket.emit("joined", room);
        }
    });

    socket.on("creatorname", (room, client) => {
        socket.to(room).emit("mynameis", client);
    });

    socket.on("bye", () => {
        console.log("Ending...");
    });
});

server.listen(PORT, () => console.log(`server listening on port ${PORT}`));