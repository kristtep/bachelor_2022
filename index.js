const app = require("express")();
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
    socket.emit("id", socket.id);

    socket.on("disconnect", () => {
        socket.broadcast.emit("callEnded");
    });

    socket.on("callHospital", ({ hospitalId, signalData, from }) => {
        console.log("socket callHospital: " + Date.now()/1000);
        io.to(hospitalId).emit("callHospital", { signal: signalData, from });
    });

    socket.on("answer", (data) => {
        console.log("socket answer: " + Date.now()/1000);
        io.to(data.to).emit("callAccepted", data.signal);
    });
});

server.listen(PORT, () => console.log(`server listening on port ${PORT}`));