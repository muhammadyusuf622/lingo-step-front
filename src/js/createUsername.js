import customAxios from "./axios";


const usernameForm = document.getElementById('username-form');
const errorP = document.querySelector('.errorP');

usernameForm.addEventListener('submit', async (e) => {
  e.preventDefault()

  let user = {}

  const input = usernameForm.querySelector('input')

  if(input.value.trim().length < 4) return errorP.textContent = 'Please enter at least 4 characters'

  user[input.name] = input.value

  customAxios.post('/auth/updateUsername', user)
  .then((res) => {
    if(res.data.message != 'success'){
      errorP.textContent = res.data.message;
    } else {
      return window.location.href = '/pages/homePage.html'
    }
  })
  .catch((error) => console.log(error))
})