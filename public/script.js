const socket = io();
let username = "";

function login() {
    username = document.getElementById("usernameInput").value.trim();
    if (!username) return;
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("chatScreen").style.display = "block";
    socket.emit("login", username);
}

function sendMessage() {
    const input = document.getElementById("messageInput");
    const msg = input.value.trim();
    if (!msg) return;
    socket.emit("message", msg);
    input.value = "";
}

socket.on("message", (msg) => {
    const div = document.createElement("div");
    div.textContent = `[${msg.timestamp}] ${msg.user}: ${msg.text}`;
    document.getElementById("messages").appendChild(div);
});

socket.on("history", (msgs) => {
    msgs.forEach(msg => {
        const div = document.createElement("div");
        div.textContent = `[${msg.timestamp}] ${msg.user}: ${msg.text}`;
        document.getElementById("messages").appendChild(div);
    });
});