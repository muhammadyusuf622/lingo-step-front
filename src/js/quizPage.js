import customAxios from "./axios";

document.addEventListener("DOMContentLoaded", async () => {
  const questionWord = document.querySelector(".question-word");
  const questionFileUpload = document.querySelector(".question-img");
  const quizId = localStorage.getItem("quizId");
  const overPage = document.querySelector(".overPage");
  const overScore = document.getElementById("overScore");
  let score = 0;

  async function createQuestionFn(data) {
    const options = document.querySelectorAll(".options");
    questionWord.textContent = data.question_text;
    questionFileUpload.innerHTML = "";

    if (data.img_url) {
      let img = document.createElement("img");
      img.src = data.img_url;
      questionFileUpload.appendChild(img);
    } else if (data.audio_url) {
      let audio = document.createElement("audio");
      audio.src = data.audio_url;
      audio.controls = true;
      questionFileUpload.appendChild(audio);
    } else if (data.video_url) {
      const video = document.createElement("video");
      const source = document.createElement("source");
      video.controls = true;
      video.width = 640;
      video.height = 360;
      source.src = data.video_url;
      video.appendChild(source);
      questionFileUpload.appendChild(video);
    }

    if (data.quizOptions) {
      options[0].textContent = data.quizOptions["A"] || "";
      options[1].textContent = data.quizOptions["B"] || "";
      options[2].textContent = data.quizOptions["C"] || "";
      options[3].textContent = data.quizOptions["D"] || "";
    }

    const arrOptions = Array.from(options);

    arrOptions.forEach((item) => {
      item.style.backgroundColor = "#ff6a00";
    });

    const trueVal = arrOptions.find(
      (item) => item.textContent == data.correct_answer
    );

    options.forEach((item) => {
      item.addEventListener("click", async () => {

        if (item.textContent == data.correct_answer) {
          item.style.backgroundColor = "rgb(26, 200, 26)";
          score += 1;
        } else {
          item.style.backgroundColor = "red";
          trueVal.style.backgroundColor = "rgb(26, 200, 26)";
        }

        arrOptions.forEach((item) => {
          const newItem = item.cloneNode(true);
          item.parentNode.replaceChild(newItem, item);
        });

        setTimeout(async () => {
          await customAxios
            .post(`/quiz-quiestion/nextPage`, {
              quizId: quizId,
              pageOrder: data.page_order,
            })
            .then((res) => {
              if (res.data.message == "over") {
                overPage.style.display = "block";
                overScore.textContent = `10/${score}`;
                questionFileUpload.innerHTML = "";
                return;
              }
              createQuestionFn(res.data.data);
            })
            .catch((err) => console.log(err.response.data.message));
        }, 1500);
      });
    });
  }

  await customAxios
    .post("/quiz-quiestion/getByQuizId", { quizId: quizId })
    .then((res) => {
      createQuestionFn(res.data.data);
    })
    .catch((err) => console.log(err.response.data.message));
});

