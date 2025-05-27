const socket = io();
let username = "";

// Função para formatar a data/hora no formato BR
function formatTimestamp() {
    const now = new Date();
    const dia = String(now.getDate()).padStart(2, '0');
    const mes = String(now.getMonth() + 1).padStart(2, '0');
    const ano = now.getFullYear();
    const horas = String(now.getHours()).padStart(2, '0');
    const minutos = String(now.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${ano} - ${horas}:${minutos}`;
}

// Converte códigos como :smile: para emojis
function parseEmojis(text) {
    const emojiMap = {
        ":smile:": "😄",
        ":heart:": "❤️",
        ":thumbsup:": "👍",
        ":fire:": "🔥",
        ":clap:": "👏",
        ":cry:": "😢",
        ":laugh:": "😂",
        ":poop:": "💩"
    };

    return text.replace(/:\w+:/g, match => emojiMap[match] || match);
}

// Verifica se é um link de imagem (png, jpg, gif)
function isImageURL(text) {
    return text.match(/\.(jpeg|jpg|gif|png)$/i);
}

function login() {
    username = document.getElementById("usernameInput").value.trim();
    if (!username) return;
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("chatScreen").style.display = "block";
    socket.emit("login", username);
}

function sendMessage() {
    const input = document.getElementById("messageInput");
    let msg = input.value.trim();
    if (!msg) return;

    const timestamp = formatTimestamp();
    const parsed = parseEmojis(msg);

    const payload = {
        text: parsed,
        timestamp,
        user: username
    };

    socket.emit("message", payload);
    input.value = "";
}

function scrollToBottom() {
    const messagesContainer = document.getElementById("messages");
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

socket.on("message", (msg) => {
    const div = document.createElement("div");

    if (isImageURL(msg.text)) {
        const img = document.createElement("img");
        img.src = msg.text;
        img.style.maxWidth = "200px";
        img.style.borderRadius = "8px";
        div.innerHTML = `[${msg.timestamp}] ${msg.user}:<br>`;
        div.appendChild(img);
    } else {
        div.textContent = `[${msg.timestamp}] ${msg.user}: ${msg.text}`;
    }

    document.getElementById("messages").appendChild(div);
    scrollToBottom();
});

socket.on("history", (msgs) => {
    msgs.forEach(msg => {
        const div = document.createElement("div");

        if (isImageURL(msg.text)) {
            const img = document.createElement("img");
            img.src = msg.text;
            img.style.maxWidth = "200px";
            img.style.borderRadius = "8px";
            div.innerHTML = `[${msg.timestamp}] ${msg.user}:<br>`;
            div.appendChild(img);
        } else {
            div.textContent = `[${msg.timestamp}] ${msg.user}: ${msg.text}`;
        }

        document.getElementById("messages").appendChild(div);
    });
    scrollToBottom();
});

// Pressionar Enter para enviar
document.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        const input = document.getElementById("messageInput");
        if (document.activeElement === input) {
            sendMessage();
        }
    }
});

// Função para inserir emoji no input
function insertEmoji(emoji) {
    const input = document.getElementById("messageInput");
    input.value += emoji;
    input.focus();
}
