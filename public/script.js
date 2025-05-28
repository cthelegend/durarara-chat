const socket = io();

const chat = document.getElementById("chat");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

sendBtn.onclick = () => {
  const text = input.value.trim();
  if (text) {
    socket.emit("message", { text, time: new Date().toLocaleString() });
    input.value = "";
  }
};

socket.on("message", (msg) => {
  appendMessage(msg);
});

socket.on("history", (messages) => {
  messages.forEach(appendMessage);
});

function appendMessage(msg) {
  const div = document.createElement("div");
  div.innerHTML = `
    <p><strong>${msg.user || "Anônimo"}</strong> • ${msg.time}<br>${msg.text}</p>
  `;
  div.style.background = "#333";
  div.style.borderRadius = "10px";
  div.style.padding = "0.5rem";
  div.style.marginBottom = "0.5rem";
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}
