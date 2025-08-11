import customAxios from "./axios";

const registerForm = document.getElementById("register-form");
const google = document.getElementById('google');
const facebook = document.getElementById('facebook');
const github = document.getElementById('github');
const errorP = document.querySelector('.errorP');


function checkToken(){
  customAxios.get('/auth/checkToken')
  .then((res) => {
    if(res.data.message == 'ok'){
      return window.location.href = '/pages/homePage.html'
    }
  })
  .catch((err) => console.log(err.response.data.message))
}

checkToken()

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = registerForm.querySelectorAll("input");

  const userData = {};

  data.forEach((item) => {
    userData[item.name] = item.value;
  });

  customAxios.post('/auth/login', userData)
  .then((response) => {
    if(response.data.message == 'success') {
      return window.location.href = '/pages/homePage.html'
    } else {
      errorP.textContent = response.data.message;
    }
  })
  .catch((err) => console.log(err))
});

google.addEventListener('click', (e) => {
  return (window.location.href = 'https://backend.lingostep.uz/api/auth/google/callback');
})

facebook.addEventListener('click', (e) => {
  return (window.location.href = 'https://backend.lingostep.uz/api/auth/facebook/callback');
})

github.addEventListener('click', (e) => {
  return (window.location.href = 'https://backend.lingostep.uz/api/auth/github/callback');
})
