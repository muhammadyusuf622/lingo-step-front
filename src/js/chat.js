import customAxios from "./axios";

const socket = io("https://backend.lingostep.uz");
const chatMessages = document.getElementById("chat-messages");

let userId = "";
let username = "";

function createDefaultMessage(array) {
  array.forEach((data) => {
    const messageElement = document.createElement("div");
    if (data.username == username) {
      messageElement.classList.add("message", "outgoing");
      messageElement.innerHTML = `
                <p class="message-text">${data.message}</p>
                <span class="timestamp">${data.createdAt}</span>`;
      chatMessages.appendChild(messageElement);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    } else {
      messageElement.classList.add("message", "incoming");
      messageElement.innerHTML = `
                <span class="username">${data.username}</span>
                <p class="message-text">${data.message}</p>
                <span class="timestamp">${data.createdAt}</span>`;
      chatMessages.appendChild(messageElement);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const sendButton = document.getElementById("send-message");
  const messageInput = document.getElementById("message-input");

  customAxios
    .get("/auth/getUserById")
    .then((res) => {
      console.log(res)
      username = res.data.data.username;
      userId = res.data.data.id;
      customAxios
        .get("/chat")
        .then((res) => {
          createDefaultMessage(res.data.data);
        })
        .catch((err) => console.log(err.response.data.message));
    })
    .catch((err) => {
      console.log(err);
    });

  sendButton.addEventListener("click", () => {
    const message = messageInput.value.trim();
    if (message) {
      socket.emit("events", { message: message, userId: userId });
      messageInput.value = "";
    }
  });

  // Enter tugmasi bilan yuborish
  messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendButton.click();
    }
  });
});

socket.on("events", (data) => {
  const messageElement = document.createElement("div");
  if (data.userId == userId) {
    messageElement.classList.add("message", "outgoing");
    messageElement.innerHTML = `
                <p class="message-text">${data.message}</p>
                <span class="timestamp">${data.createAt}</span>`;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  } else {
    messageElement.classList.add("message", "incoming");
    messageElement.innerHTML = `
                <span class="username">${data.username}</span>
                <p class="message-text">${data.message}</p>
                <span class="timestamp">${data.createAt}</span>`;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
});
