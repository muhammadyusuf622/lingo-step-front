import customAxios from "./axios";
let timer = 2;

function createConfetti() {
  for (let i = 0; i < 50; i++) {
    let confetti = document.createElement("div");
    confetti.classList.add("confetti");
    document.body.appendChild(confetti);

    let colors = [
      "#ff0000",
      "#ff7f00",
      "#ffff00",
      "#00ff00",
      "#0000ff",
      "#4b0082",
      "#9400d3",
    ];
    confetti.style.background =
      colors[Math.floor(Math.random() * colors.length)];

    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.setProperty("--randX", Math.random());
    confetti.style.animationDuration = 2 + Math.random() * 2 + "s";

    setTimeout(() => {
      confetti.remove();
    }, 3000);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const bookImg = document.getElementById("book-cover");
  const textDisplay = document.getElementById("text-display");
  const typingInput = document.getElementById("typing-input");
  const pageNumber = document.getElementById("page-number");
  const bookName = document.getElementById("book-name");
  const bookId = localStorage.getItem("bookId");
  const pastError = document.getElementById("pastError");
  const addScorWord = document.querySelector('.addScorWord');
  const audioUrl = document.querySelector('.audioUrl');

  function createWords(data, img, bookname, pageId) {
    let currentText = data.page;

    bookImg.src = img;
    pageNumber.textContent = `Page: ${data.page_order}`;
    bookName.textContent = bookname;
    audioUrl.src = data.audio_url

    // Sahifa matnini harflarga bo‘lib ko‘rsatish
    function displayText(text) {
      textDisplay.innerHTML = text
        .split("")
        .map((char) => `<span>${char}</span>`)
        .join("");
    }

    // Yozish jarayonini boshqarish
    typingInput.addEventListener("input", async () => {
      const inputText = typingInput.value;
      const spans = textDisplay.querySelectorAll("span");
      let isCorrect = true;

      spans.forEach((span, index) => {
        span.classList.remove("correct", "incorrect", "current");
        if (index < inputText.length) {
          if (inputText[index] === currentText[index]) {
            span.classList.add("correct");
          } else {
            span.classList.add("incorrect");
            isCorrect = false;
          }
        } else if (index === inputText.length) {
          span.classList.add("current");
        }
      });

      console.log(currentText.length, inputText.length)
      // Agar to‘g‘ri yozilgan bo‘lsa, backendga saqlash
      if (isCorrect && inputText.length === currentText.length) {
        const countdown = setInterval(() => {
          createConfetti();
          timer--;

          if (timer < 0) {
            clearInterval(countdown);
          }
        }, 1000);
        addScorWord.textContent = 'Well done! 100 points have been added to your score'
        addScorWord.style.color = '#28a745'
        setTimeout(() => {
          addScorWord.textContent = 'Receive 100 points upon completing each page'
          addScorWord.style.color = '#ff6a00'
        }, 9000)
        await customAxios
          .post("/pages/getNewPage", { pageId: pageId, bookId: bookId })
          .then((res) => {
            console.log(res.data)
            if (res.data.message.startsWith("The")) {
              alert(res.data.message);
            }
            createWords(
              res.data?.data,
              res.data.bookImg,
              res.data.bookName,
              res.data.data.id
            );
            typingInput.value = "";
          })
          .catch((err) => console.log(err.response.data.message));
      }
    });

    // Dastlabki sahifani ko‘rsatish
    displayText(currentText);
  }

  await customAxios
    .post("/pages/getByPageWithBookId", { bookId: bookId })
    .then((res) => {
      createWords(
        res.data.data,
        res.data.bookImg,
        res.data.bookName,
        res.data.data.id
      );

      if (res.data.admin) {
        typingInput.addEventListener("paste", (e) => {
          e.preventDefault();
          pastError.textContent = "Pasting is forbidden! 🫵 🤓";
          setTimeout(() => {
            pastError.textContent = "";
          }, 9000);
        });
      }
    })
    .catch((err) => console.log(err.response.data.message));
});
