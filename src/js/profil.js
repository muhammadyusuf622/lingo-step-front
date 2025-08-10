import customAxios from "./axios";

const avatarPreview = document.getElementById("avatar-preview");
const username = document.getElementById("username");
const userEmail = document.getElementById("userEmail");
const errorImg = document.querySelector(".errorImg");
const logout = document.getElementById('logout');
const userLevel = document.querySelector('.w1');
const quizLevel = document.querySelector('.w2');
const socreLevel = document.querySelector('.w3');

function userInfo(data, levels) {
  avatarPreview.src = data?.imgUrl;
  username.textContent = data.username;
  userEmail.textContent = data.email;
  userLevel.textContent = `Lesson Level: ${levels.lesson_level}`
  quizLevel.textContent = `Quiz Level: ${levels.quiz_level}`
  socreLevel.textContent = `All Score: ${levels.score}`
}

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
    userInfo(res.data.data, res.data.userProgress);
  })
  .catch((err) => {
    console.log(err);
  });

document.addEventListener("DOMContentLoaded", () => {
  const avatarUpload = document.getElementById("avatar-upload");
  const uploadButton = document.querySelector(".upload-avatar");

  uploadButton.addEventListener("click", () => {
    avatarUpload.click();
  });

  avatarUpload.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      const formData = new FormData();
      formData.append("avatar", file);
      errorImg.textContent = ""
      customAxios
        .post("/auth/changeImg", formData)
        .then((res) => {
          reader.onload = (e) => {
            avatarPreview.src = e.target.result;
          };
          reader.readAsDataURL(file);
          console.log(res.data);
        })
        .catch((err) => {
          errorImg.textContent = err.response.data.message;
        });
    }
  });
});


logout.addEventListener('click', async() => {

  customAxios.get('/auth/locaut')
  .then((res) => {
    if(res.data.message == 'success'){
      return window.location.href = '/pages/login.html'
    }
  })
  cache((err) => console.log(err.response.data.message))
})