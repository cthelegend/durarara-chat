const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

app.use(cors());
app.use(express.static("public"));

let messageHistory = [];

io.on("connection", (socket) => {
    console.log("Usuário conectado");

    socket.emit("history", messageHistory);

    socket.on("login", (username) => {
        socket.username = username;
    });

    socket.on("message", (msg) => {
        const fullMsg = {
            ...msg,
            user: socket.username || "Anônimo"
        };
        messageHistory.push(fullMsg);
        io.emit("message", fullMsg);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
