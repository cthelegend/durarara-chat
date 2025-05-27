const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

let messageHistory = [];

app.use(express.static("public")); // pasta com HTML/CSS/JS

io.on("connection", (socket) => {
    console.log("Novo usuário conectado");

    // Envia histórico ao novo usuário
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

server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
