let avatarURL = "";

document.getElementById("avatarInput").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      avatarURL = event.target.result;
      const preview = document.getElementById("avatarPreview");
      preview.src = avatarURL;
      preview.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  }
});

function enterChat() {
  if (!avatarURL) return alert("Selecione uma imagem para continuar.");
  document.getElementById("login-screen").classList.add("hidden");
  document.getElementById("chat-screen").classList.remove("hidden");
  document.getElementById("chat-screen").classList.add("show");
}

function sendMessage() {
  const input = document.getElementById("messageInput");
  const text = input.value.trim();
  if (text === "") return;
  const msgDiv = document.createElement("div");
  msgDiv.className = "message from-user";
  msgDiv.textContent = text;
  document.getElementById("messages").appendChild(msgDiv);
  input.value = "";
}

document.getElementById("sendButton").addEventListener("click", sendMessage);
document.getElementById("messageInput").addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});

function startRecording() {
  alert("Função de áudio ainda em desenvolvimento!");
}

document.getElementById("imageInput").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (event) {
    const img = document.createElement("img");
    img.src = event.target.result;
    img.style.maxWidth = "200px";
    img.style.borderRadius = "12px";
    const msgDiv = document.createElement("div");
    msgDiv.className = "message from-user";
    msgDiv.appendChild(img);
    document.getElementById("messages").appendChild(msgDiv);
    scrollToBottom();
  };
  reader.readAsDataURL(file);
});

function scrollToBottom() {
  const messages = document.getElementById("messages");
  messages.scrollTop = messages.scrollHeight;
}

let mediaRecorder;
let audioChunks = [];

function startRecording() {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];

      mediaRecorder.ondataavailable = e => {
        audioChunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunks, { type: 'audio/mp3' });
        const audioURL = URL.createObjectURL(blob);
        const audio = document.createElement("audio");
        audio.controls = true;
        audio.src = audioURL;

        const msgDiv = document.createElement("div");
        msgDiv.className = "message from-user";
        msgDiv.appendChild(audio);
        document.getElementById("messages").appendChild(msgDiv);
        scrollToBottom();
      };

      mediaRecorder.start();

      setTimeout(() => {
        mediaRecorder.stop();
      }, 4000); // Grava até 4s
    })
    .catch(err => alert("Permissão de áudio negada."));
}