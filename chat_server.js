const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const cors = require("cors");

app.use(cors());
app.use(express.static(__dirname + "/public"));

let messages = [];

io.on("connection", (socket) => {
    let username = "";

    socket.on("login", (name) => {
        username = name;
        socket.emit("history", messages);
    });

    socket.on("message", (msg) => {
        const now = new Date();
        const time = now.toLocaleTimeString();
        const date = now.toLocaleDateString();
        const formattedMsg = {
            user: username,
            text: msg,
            timestamp: `${date} ${time}`
        };
        messages.push(formattedMsg);
        io.emit("message", formattedMsg);
    });
});

http.listen(3000, () => {
    console.log("Server running on port 3000");
});