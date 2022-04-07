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

const users = [];

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("Server is running");
});

io.on("connection", (socket) => {
    socket.emit("id", socket.id);

    socket.on('join server', (username) => {
        const user = {
            username,
            id: socket.id,
        };
        users.push(user);
        io.emit('new user', users);
    });

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

    socket.emit("id", socket.id);

    io.sockets.emit('allUsers', users);

    socket.on("disconnect", () => {
        delete users[socket.io];
        //socket.broadcast.emit("callEnded");
    });

    socket.on('join-room', (room, callback) => {
        socket.join(room);
        console.log(room);
        callback(messages[room]);
        socket.emit('joined', messages[room]);
    });

    socket.on('callHospital', (data) => {

        socket.to(data.room).emit('callHospital', { signal: data.signalData, from: data.from });
    });

    socket.on('answer', (data) => {
        socket.to(data.room).emit('callAccepted', data.signal);
    });


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