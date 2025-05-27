
// script.js (versão finalizada com reply, avatar e emojis)
const socket = io();
let username = localStorage.getItem("username") || "Anônimo";
let avatar = localStorage.getItem("avatar") || "avatar.png";
let replyTo = null;

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
        user: username,
        avatar: avatar,
        replyTo: replyTo || null
    };

    socket.emit("message", payload);
    input.value = "";
    replyTo = null;
    hideReplyUI();
    hideEmojiPicker();
}

function createMessageDiv(msg) {
    const div = document.createElement("div");
    div.classList.add("message", msg.user === username ? "self" : "other");

    const avatarImg = document.createElement("img");
    avatarImg.src = msg.avatar || "avatar.png";
    avatarImg.className = "avatar";
    div.appendChild(avatarImg);

    const content = document.createElement("div");
    content.className = "bubble";

    if (msg.replyTo) {
        const replyBlock = document.createElement("div");
        replyBlock.className = "reply-block";
        replyBlock.textContent = `${msg.replyTo.user}: ${msg.replyTo.text}`.slice(0, 100);
        content.appendChild(replyBlock);
    }

    const meta = document.createElement("div");
    meta.classList.add("message-meta");
    meta.textContent = `${msg.user} • ${msg.timestamp}`;
    content.appendChild(meta);

    const span = document.createElement("span");
    span.innerHTML = msg.text;
    content.appendChild(span);

    const hoverBtn = document.createElement("div");
    hoverBtn.className = "reply-hover-btn";
    hoverBtn.textContent = "↩️";
    hoverBtn.onclick = () => showReplyUI(msg);
    content.appendChild(hoverBtn);

    let startX = 0;
    div.addEventListener("touchstart", e => startX = e.touches[0].clientX);
    div.addEventListener("touchend", e => {
        const endX = e.changedTouches[0].clientX;
        if (endX - startX > 50) showReplyUI(msg);
    });

    div.appendChild(content);
    return div;
}

function showReplyUI(msg) {
    replyTo = {
        user: msg.user,
        text: msg.text
    };
    const replyInfo = document.getElementById("replyInfo");
    replyInfo.innerHTML = `<strong>Respondendo a:</strong> ${msg.user}: ${msg.text.slice(0, 60)} <span style='float:right; cursor:pointer' onclick='hideReplyUI()'>❌</span>`;
    replyInfo.style.display = "block";
}

function hideReplyUI() {
    const replyInfo = document.getElementById("replyInfo");
    replyInfo.style.display = "none";
    replyInfo.innerHTML = "";
    replyTo = null;
}

function hideEmojiPicker() {
    document.getElementById("emojiPicker").classList.add("hidden");
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

// Emoji Picker funcional com ícones (exemplo básico)
const emojiList = ["😄", "❤️", "👍", "🔥", "👏", "😢", "😂", "💩", "😁", "😉", "😎", "🤔", "🥳", "⭐", "🚀", "🌙", "☀️", "☕"];
const picker = document.getElementById("emojiPicker");
const emojiBtn = document.getElementById("emojiBtn");
const input = document.getElementById("messageInput");

emojiBtn.addEventListener("click", () => picker.classList.toggle("hidden"));

picker.innerHTML = "";
emojiList.forEach(e => {
    const el = document.createElement("span");
    el.textContent = e;
    el.addEventListener("click", () => {
        input.value += e;
        input.focus();
        hideEmojiPicker();
    });
    picker.appendChild(el);
});
