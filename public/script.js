
const socket = io();
let username = localStorage.getItem("username") || "Anônimo";

socket.emit("login", username);

function formatTimestamp() {
    const now = new Date();
    return now.toLocaleString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
}

function parseEmojis(text) {
    const emojiMap = {
        ":smile:": "😄", ":heart:": "❤️", ":thumbsup:": "👍", ":fire:": "🔥",
        ":clap:": "👏", ":cry:": "😢", ":laugh:": "😂", ":poop:": "💩",
        ":grin:": "😁", ":wink:": "😉", ":sunglasses:": "😎", ":thinking:": "🤔",
        ":party:": "🥳", ":star:": "⭐", ":rocket:": "🚀", ":moon:": "🌙", ":sun:": "☀️", ":coffee:": "☕",
    };
    return text.replace(/:\w+:/g, match => emojiMap[match] || match);
}

function isImageURL(text) {
    return /\.(jpeg|jpg|gif|png)(\?.*)?$/i.test(text);
}

function sendMessage() {
    const input = document.getElementById("messageInput");
    let msg = input.value.trim();
    if (!msg) return;
    const payload = {
        text: msg,
        timestamp: formatTimestamp(),
        user: username
    };
    socket.emit("message", payload);
    input.value = "";
    hideEmojiPicker();
}

function createMessageDiv(msg) {
    const div = document.createElement("div");
    div.classList.add("message", msg.user === username ? "self" : "other");

    const meta = document.createElement("div");
    meta.classList.add("message-meta");
    meta.textContent = `${msg.user} • ${msg.timestamp}`;
    div.appendChild(meta);

    if (isImageURL(msg.text)) {
        const img = document.createElement("img");
        img.src = msg.text;
        img.alt = "imagem enviada";
        div.appendChild(img);
    } else {
        const span = document.createElement("span");
        span.innerHTML = parseEmojis(msg.text);
        div.appendChild(span);
    }

    const replyBtn = document.createElement("div");
    replyBtn.className = "reply-btn";
    replyBtn.textContent = "↩️";
    replyBtn.onclick = () => {
        const input = document.getElementById("messageInput");
        input.value = `@${msg.user} `;
        input.focus();
    };
    div.appendChild(replyBtn);

    let startX = 0;
    div.addEventListener("touchstart", e => startX = e.touches[0].clientX);
    div.addEventListener("touchend", e => {
        const endX = e.changedTouches[0].clientX;
        if (endX - startX > 50) {
            document.getElementById("messageInput").value = `@${msg.user} `;
        }
    });

    return div;
}

function scrollToBottom() {
    const messagesContainer = document.getElementById("messages");
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

socket.on("message", msg => {
    const div = createMessageDiv(msg);
    document.getElementById("messages").appendChild(div);
    scrollToBottom();
});

socket.on("history", msgs => {
    const container = document.getElementById("messages");
    container.innerHTML = "";
    msgs.forEach(msg => container.appendChild(createMessageDiv(msg)));
    scrollToBottom();
});

document.getElementById("messageInput").addEventListener("keydown", e => {
    if (e.key === "Enter") sendMessage();
});

document.getElementById("sendBtn").addEventListener("click", sendMessage);
