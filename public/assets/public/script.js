
document.addEventListener("DOMContentLoaded", () => {
  const messagesContainer = document.getElementById("messages");
  const messageInput = document.getElementById("messageInput");
  const sendButton = document.getElementById("sendButton");

  const addMessage = (text, fromMe = false) => {
    const msg = document.createElement("div");
    msg.classList.add("message", fromMe ? "me" : "other");
    msg.innerHTML = \`
      \${!fromMe ? '<i class="lucide lucide-corner-down-left reply-icon"></i>' : ''}
      \${fromMe ? '<i class="lucide lucide-corner-down-left reply-icon"></i>' : ''}
      \${text}
    \`;
    messagesContainer.appendChild(msg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  };

  sendButton.addEventListener("click", () => {
    const text = messageInput.value.trim();
    if (text !== "") {
      addMessage(text, true);
      messageInput.value = "";
    }
  });

  messageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      sendButton.click();
    }
  });

  // Simulate incoming message (for test)
  setTimeout(() => addMessage("Mensagem de teste recebida", false), 1000);
});
