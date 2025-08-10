import customAxios from "./axios";

const fatherBook = document.querySelector(".books");

function createBookFn(arr) {
  arr.forEach((data) => {
    const bookDiv = document.createElement("div");
    bookDiv.setAttribute("data-name", data.id);
    bookDiv.classList.add("book");

    const innerDiv = document.createElement("div");
    const img = document.createElement("img");
    img.src = data.imgUrl;
    img.alt = "this img";
    const h3 = document.createElement("h3");
    h3.textContent = data.title;
    innerDiv.appendChild(img);
    bookDiv.appendChild(innerDiv);
    bookDiv.appendChild(h3);
    fatherBook.appendChild(bookDiv);
  });
}

document.addEventListener("DOMContentLoaded", async() => {
  await customAxios
    .get("/quiz")
    .then((res) => {
      createBookFn(res.data.data);
    })
    .catch((err) => console.log(err.response.data.message));

  const books = document.querySelectorAll(".book");

  books.forEach((item) => {
    item.addEventListener("click", () => {
      localStorage.setItem('quizId', item.dataset.name)
      return window.location.href = '/pages/quizPage.html'
    });
  });
});
