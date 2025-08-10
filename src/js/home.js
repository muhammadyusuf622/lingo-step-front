import customAxios from "./axios";

const languageSelect = document.getElementById("language-select");
const profilImg = document.getElementById("profilImg");
const chatDiv = document.getElementById("chat_click");
const books_click = document.getElementById("books_click");
const quiz_click = document.getElementById("quiz_click");
const cardVideo = document.getElementById('cardVideo');
let userImgUrl;

function checkToken() {
  customAxios
    .get("/auth/checkToken")
    .then((res) => {
      if (res.data.message == "ok") {
      }
    })
    .catch((err) => {
      if (err.response.data.message == "token_not_found") {
        return (window.location.href = "/index.html");
      }
    });
}
checkToken();

customAxios
  .get("/auth/getUserById")
  .then((res) => {
    userImgUrl = res.data.data.imgUrl;
    profilImg.src = userImgUrl;
  })
  .catch((err) => {
    console.log(err);
  });

let slideIndex = 0;
const slides = document.querySelectorAll(".slide");

function showSlides() {
  slides.forEach((slide, index) => {
    slide.style.display = index === slideIndex ? "block" : "none";
  });
  slideIndex = (slideIndex + 1) % slides.length;
  setTimeout(showSlides, 3000);
}
showSlides();

const languages = {
  uz: {
    profile: "Profil",
    contact: "Admin",
    "hero-title": "Ingliz tilini oson va qiziqarli o'rganing!",
    "hero-description":
      "LingoStep bilan o'z darajangizni tanlang va bugundan boshlang.",
    "level-beginner": "Boshlang'ich",
    "level-intermediate": "O'rta",
    "level-advanced": "Yuqori",
    start: "Boshlash",
    "feature-lessons": "📚 Interaktiv Darslar",
    "feature-lessons-desc": "Flashcardlar, videolar va AI yordamida o'rganing.",
    "feature-tests": "🏆 Viktorina",
    "feature-tests-desc": "Darajangizni aniqlash va bilimlaringizni sinash.",
    "feature-gamification": "✍️ Kitob Yoz",
    "feature-gamification-desc":
      "🎧 Sevimli kitobingni audio tarzda tingla, ✍️ Har bir so'zini o'zing yozib, muallif kabi his et!",
    "feature-chat": "💬 Ommaviy Chat",
    "feature-chat-desc":
      "Boshqa o'quvchilar bilan suhbatlashing va tajriba almashing.",
    "feature-ai": "🤖 AI Tutor",
    "feature-ai-desc":
      "Savollaringizga javob oling va matnlaringizni tuzating.",
    "feature-language": "🎥 Video orqali o'rganish",
    "feature-language-desc": "O'zbek, rus va ingliz tillarida o'rganing.",
    "footer-copyright": "© 2025 LingoStep. Barcha huquqlar himoyalangan.",
    "footer-telegram": "Telegram Botga ulanish",
    "feature-video": "🎥 Video Chat Bepul",
    "feature-vodeo-desc": "Do'stlaringiz bilan yuzma-yuz gaplashing, reklamasiz va mutlaqo bepul!"
  },
  ru: {
    profile: "Профиль",
    contact: "администратором",
    "hero-title": "Учите английский легко и увлекательно!",
    "hero-description": "Выберите свой уровень c LingoStep и начните сегодня.",
    "level-beginner": "Начинающий",
    "level-intermediate": "Средний",
    "level-advanced": "Продвинутый",
    start: "Начать",
    "feature-lessons": "📚 Интерактивные уроки",
    "feature-lessons-desc": "Учитесь c помощью карточек, видео и ИИ.",
    "feature-tests": "🏆 Контрольный опрос",
    "feature-tests-desc": "Определите свой уровень и проверьте знания.",
    "feature-gamification": "✍️ Написать книгу",
    "feature-gamification-desc":
      "🎧 Слушай любимую книгу, ✍️ Печатай каждое слово — почувствуй себя автором!",
    "feature-chat": "💬 Общий чат",
    "feature-chat-desc":
      "Общайтесь c другими учениками и обменивайтесь опытом.",
    "feature-ai": "🤖 ИИ-репетитор",
    "feature-ai-desc": "Получайте ответы на вопросы и исправляйте тексты.",
    "feature-language": "🎥 Обучение через видео",
    "feature-language-desc": "Учитесь на узбекском, русском или английском.",
    "footer-copyright": "© 2025 LingoStep. Bce права защищены.",
    "footer-telegram": "Подключиться к Telegram-боту",
    "feature-video": "🎥 Бесплатный Видеочат",
    "feature-vodeo-desc": "Общайтесь c друзьями лицом к лицу — без рекламы, без регистрации и совершенно бесплатно!"
  },
  en: {
    profile: "Profile",
    contact: "Admin",
    "hero-title": "Learn English Easily and Enjoyably!",
    "hero-description": "Choose your level with LingoStep and start today.",
    "level-beginner": "Beginner",
    "level-intermediate": "Intermediate",
    "level-advanced": "Advanced",
    start: "Start",
    "feature-lessons": "📚 Interactive Lessons",
    "feature-lessons-desc": "Learn with flashcards, videos, and AI assistance.",
    "feature-tests": "🏆 Quiz",
    "feature-tests-desc": "Determine your level and test your knowledge.",
    "feature-gamification": "✍️ Write a book",
    "feature-gamification-desc":
      "🎧 Listen to your favorite book, ✍️ Type each word and feel like the author!",
    "feature-chat": "💬 Community Chat",
    "feature-chat-desc": "Chat with other learners and share experiences.",
    "feature-ai": "🤖 AI Tutor",
    "feature-ai-desc": "Get answers to your questions and improve your texts.",
    "feature-language": "🎥 Learning through video",
    "feature-language-desc": "Learn in Uzbek, Russian, or English.",
    "footer-copyright": "© 2025 LingoStep. All rights reserved.",
    "footer-telegram": "Connect to Telegram Bot",
    "feature-video": "🎥 Free Video Chat",
    "feature-vodeo-desc": "Chat face-to-face with your friends — no ads, no registration, absolutely free!",
  },
};

function changeLanguage() {
  const lang = document.getElementById("language-select").value;
  const elements = document.querySelectorAll("[data-lang-key]");
  elements.forEach((element) => {
    const key = element.getAttribute("data-lang-key");
    if (languages[lang][key]) {
      element.textContent = languages[lang][key];
    }
  });
  localStorage.setItem("selectedLanguage", lang);
}

languageSelect.addEventListener("change", () => {
  changeLanguage();
});

document.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("selectedLanguage") || "uz";
  document.getElementById("language-select").value = savedLang;
  changeLanguage();
});

cardVideo.addEventListener('click', () => {
  return  (window.location.href = "/pages/videoChat.html");
});

chatDiv.addEventListener("click", () => {
  return (window.location.href = "/pages/chat.html");
});

books_click.addEventListener("click", () => {
  return (window.location.href = "/pages/book.html");
});

quiz_click.addEventListener("click", () => {
  return (window.location.href = "/pages/quiz.html");
});

document.addEventListener("DOMContentLoaded", async () => {
  const contact_admin = document.querySelector(".contact_admin");
  const report_box = document.querySelector(".report-box");
  const textarea = document.querySelector("textarea");
  const fontasmClick = document.querySelector(".fontasmClick");
  const reportBox = document.querySelector(".report-box");

  function createReportMessageFn(arr, userImg) {

    arr.forEach((data) => {
      const div = document.createElement("div");
      div.classList.add("user-box");
      const divImg = document.createElement("div");
      const img = document.createElement("img");
      img.src = userImg;
      const p = document.createElement("p");
      p.textContent = data.message;
      const span = document.createElement("span");
      span.classList.add("user-panding");

      if(data.status == 'resolved'){
        span.style.backgroundColor = 'rgb(13, 205, 13)'
      } else if(data.status == 'rejected'){
        span.style.backgroundColor = 'rgb(216, 8, 8)'
      }
      span.textContent = data.status;
      divImg.appendChild(img);
      div.appendChild(divImg);
      div.appendChild(p);
      div.appendChild(span);
      reportBox.appendChild(div);

      if (data.adminMessage) {
        const div = document.createElement("div");
        div.classList.add("admin-box");
        const img = document.createElement("img");
        img.src =
          "https://png.pngtree.com/png-vector/20220624/ourmid/pngtree-dispatcher-male-communication-personnel-avatar-png-image_5327042.png";
        const p = document.createElement("p");
        p.textContent = data.adminMessage;
        div.appendChild(img);
        div.appendChild(p);
        reportBox.appendChild(div);
      }
    });
  }

  await customAxios
    .get("/admin-message/getAllUserId")
    .then((res) => {
      createReportMessageFn(res.data.data, res.data.userImg)
    })
    .catch((err) => console.log(err.response.data.message));

  textarea.addEventListener("input", () => {
    if (textarea.value.trim().length > 10) {
      fontasmClick.style.display = "block";
    } else {
      fontasmClick.style.display = "none";
    }
  });

  fontasmClick.addEventListener("click", async () => {
    const message = textarea.value;
    textarea.value = "";
    fontasmClick.style.display = "none";

    const div = document.createElement("div");
    div.classList.add("user-box");
    const divImg = document.createElement("div");
    const img = document.createElement("img");
    img.src = userImgUrl;
    const p = document.createElement("p");
    p.textContent = message;
    const span = document.createElement("span");
    span.classList.add("user-panding");
    span.textContent = "pending";
    divImg.appendChild(img);
    div.appendChild(divImg);
    div.appendChild(p);
    div.appendChild(span);
    reportBox.appendChild(div);

    await customAxios
      .post("/admin-message", { message: message })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => console.log(err.response.data.message));
  });

  contact_admin.addEventListener("click", () => {
    if (
      report_box.style.display === "none" ||
      report_box.style.display === ""
    ) {
      report_box.style.display = "block";
    } else {
      report_box.style.display = "none";
    }
  });
});

