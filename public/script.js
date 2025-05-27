const socket = io();
let username = "";

// Formatar timestamp BR (sem segundos)
function formatTimestamp() {
    const now = new Date();
    const dia = String(now.getDate()).padStart(2, "0");
    const mes = String(now.getMonth() + 1).padStart(2, "0");
    const ano = now.getFullYear();
    const horas = String(now.getHours()).padStart(2, "0");
    const minutos = String(now.getMinutes()).padStart(2, "0");
    return `${dia}/${mes}/${ano} - ${horas}:${minutos}`;
}

// Emoji map com código => emoji
const emojiMap = {
    ":smile:": "😄",
    ":heart:": "❤️",
    ":thumbsup:": "👍",
    ":fire:": "🔥",
    ":clap:": "👏",
    ":cry:": "😢",
    ":laugh:": "😂",
    ":poop:": "💩",
    ":grin:": "😁",
    ":wink:": "😉",
    ":sunglasses:": "😎",
    ":thinking:": "🤔",
    ":party:": "🥳",
    ":star:": "⭐",
    ":rocket:": "🚀",
    ":moon:": "🌙",
    ":sun:": "☀️",
    ":coffee:": "☕",
};

// Parse emojis no texto
function parseEmojis(text) {
    return text.replace(/:\w+:/g, (match) => emojiMap[match] || match);
}

// Verifica se texto é URL de imagem (com possíveis query params)
function isImageURL(text) {
    return /\.(jpeg|jpg|gif|png)(\?.*)?$/i.test(text);
}

function login() {
    username = document.getElementById("usernameInput").value.trim();
    if (!username) return alert("Digite um username válido!");
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("chatScreen").style.display = "flex";
    socket.emit("login", username);
}

function sendMessage() {
    const input = document.getElementById("messageInput");
    let msg = input.value.trim();
    if (!msg) return;

    const timestamp = formatTimestamp();
    const parsedText = parseEmojis(msg);

    const payload = {
        text: parsedText,
        timestamp,
        user: username,
    };

    socket.emit("message", payload);
    input.value = "";
    hideEmojiPicker();
}

function scrollToBottom() {
    const messagesContainer = document.getElementById("messages");
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function createMessageDiv(msg) {
    const div = document.createElement("div");
    div.classList.add("message");
    div.classList.add(msg.user === username ? "self" : "other");

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
        // Mensagem texto com emojis
        const textSpan = document.createElement("span");
        textSpan.innerHTML = parseEmojis(msg.text);
        div.appendChild(textSpan);
    }

    return div;
}

socket.on("message", (msg) => {
    const div = createMessageDiv(msg);
    document.getElementById("messages").appendChild(div);
    scrollToBottom();
});

socket.on("history", (msgs) => {
    const container = document.getElementById("messages");
    container.innerHTML = "";
    msgs.forEach((msg) => {
        const div = createMessageDiv(msg);
        container.appendChild(div);
    });
    scrollToBottom();
});

// ENTER para enviar
document.getElementById("messageInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        sendMessage();
    }
});

// BOTÕES EMOJI
const emojiBtn = document.getElementById("emojiBtn");
const emojiPicker = document.getElementById("emojiPicker");

const emojis = Object.entries(emojiMap).map(
    ([code, emoji]) => ({ code, emoji })
);

function showEmojiPicker() {
    emojiPicker.classList.remove("hidden");
}

function hideEmojiPicker() {
    emojiPicker.classList.add("hidden");
}

function toggleEmojiPicker() {
    emojiPicker.classList.toggle("hidden");
}

// Montar emoji picker
function buildEmojiPicker() {
    emojiPicker.innerHTML = "";
    emojis.forEach(({ code, emoji }) => {
        const span = document.createElement("span");
        span.textContent = emoji;
        span.title = code;
        span.onclick = () => {
            insertAtCursor(document.getElementById("messageInput"), code + " ");
            hideEmojiPicker();
        };
        emojiPicker.appendChild(span);
    });
}

// Inserir texto no cursor da input
function insertAtCursor(input, textToInsert) {
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const text = input.value;
    input.value = text.slice(0, start) + textToInsert + text.slice(end);
    input.selectionStart = input.selectionEnd = start + textToInsert.length;
    input.focus();
}

emojiBtn.addEventListener("click", () => {
    toggleEmojiPicker();
});

// Fechar emoji picker se clicar fora
document.addEventListener("click", (e) => {
    if (
        !emojiPicker.contains(e.target) &&
        e.target !== emojiBtn
    ) {
        hideEmojiPicker();
    }
});

window.onload = () => {
    buildEmojiPicker();
};
