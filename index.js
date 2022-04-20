var os = require('os');
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

var check = 0;

io.on("connection", (socket) => {

    socket.on('message', (message, room) => {

        socket.to(room).emit('message', message, room);
    });

    socket.on('create or join', (room, client) => {
        var cliInRoom = io.sockets.adapter.rooms.get(room);
        var numCli = cliInRoom ? cliInRoom.size : 0;
        console.log("room " + room + " has " + numCli + " clients.");

        if (numCli === 0){
            socket.join(room);
            check++;
            console.log(check);
            socket.emit("created", room, socket.id, check);
        } else {
            io.sockets.in(room).emit("join", room, client);
            socket.join(room);
            socket.emit("joined", room, socket.id);
            //usikker på hvor den mottakeren til denne er, sender "ready" til socket rommet men har ikke noe mottaker for det i socket.js fila
            io.sockets.in(room).emit("ready");
        }
    });

    socket.on("creatorname", (room, client) => {
        socket.to(room).emit("mynameis", client);
    })
    socket.on('ipaddr', () => {
        var ifaces = os.networkInterfaces();
        for (var dev in ifaces) {
            ifaces[dev].forEach((details) => {
                if(details.family === "IPv4" && details.address !== "127.0.0.1") {
                    socket.emit("ipaddr", details.address);
                }
            });
        }
    });

    socket.on("bye", () => {
        console.log("Ending...");
    })

    /* socket.on("callHospital", ({ room, hospitalId, signalData, from, name }) => {
        console.log("socket callHospital: " + Date.now()/1000);
        io.to(hospitalId).emit("callHospital", { signal: signalData, from, name });
    }); */

    /* socket.on("answer", (data) => {
        console.log("socket answer: " + Date.now()/1000);
        io.to(data.to).emit("callAccepted", data.signal);
    }); */
});

server.listen(PORT, () => console.log(`server listening on port ${PORT}`));