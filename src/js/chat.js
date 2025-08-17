import customAxios from "./axios";

const socket = io("https://backend.lingostep.uz");
const chatMessages = document.getElementById("chat-messages");

let userId = "";
let username = "";

// Xavfsiz matn qo'shish funksiyasi
function createMessageElement(data, isOutgoing = false) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", isOutgoing ? "outgoing" : "incoming");

  if (isOutgoing) {
    const messageText = document.createElement("p");
    messageText.classList.add("message-text");
    messageText.textContent = data.message; // ⚠️ innerHTML o'rniga textContent
    const timestamp = document.createElement("span");
    timestamp.classList.add("timestamp");
    timestamp.textContent = data.createdAt;

    messageElement.appendChild(messageText);
    messageElement.appendChild(timestamp);
  } else {
    const usernameEl = document.createElement("span");
    usernameEl.classList.add("username");
    usernameEl.textContent = data.username;

    const messageText = document.createElement("p");
    messageText.classList.add("message-text");
    messageText.textContent = data.message; // ⚠️ xavfsiz

    const timestamp = document.createElement("span");
    timestamp.classList.add("timestamp");
    timestamp.textContent = data.createdAt;

    messageElement.appendChild(usernameEl);
    messageElement.appendChild(messageText);
    messageElement.appendChild(timestamp);
  }

  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Avvalgi xabarlarni chiqarish
function createDefaultMessage(array) {
  array.forEach((data) => {
    createMessageElement(data, data.username === username);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const sendButton = document.getElementById("send-message");
  const messageInput = document.getElementById("message-input");

  customAxios
    .get("/auth/getUserById")
    .then((res) => {
      username = res.data.data.username;
      userId = res.data.data.id;

      customAxios
        .get("/chat")
        .then((res) => {
          createDefaultMessage(res.data.data);
        })
        .catch((err) => console.log(err.response.data.message));
    })
    .catch((err) => console.log(err));

  sendButton.addEventListener("click", () => {
    const message = messageInput.value.trim();
    if (message) {
      socket.emit("events", { message: message, userId: userId, username: username });
      messageInput.value = "";
    }
  });

  messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendButton.click();
    }
  });
});

socket.on("events", (data) => {
  createMessageElement(data, data.userId === userId);
});
