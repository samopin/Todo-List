"use strict";

const body = document.querySelector("body");
const form = document.querySelector(".form");
const titleInput = document.querySelector("#title-input");
const descriptionInput = document.querySelector("#description-input");
const dateInput = document.querySelector("#date-input");

class task {}

const currentStringDate = function () {
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1; // Months start at 0!
  let dd = today.getDate();

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;

  return yyyy + "/" + mm + "/" + dd;
};

const showFormResult = function (formStatus, formDescription) {
  let formColor, formBorderColor;
  switch (formStatus) {
    case "Successful":
      formColor = "bg-green-500";
      formBorderColor = "bg-green-700";
      break;
    case "Unsuccessful":
      formColor = "bg-red-500";
      formBorderColor = "bg-red-700";
      break;
    default:
      formColor = "bg-gray-500";
      formBorderColor = "bg-gray-700";
  }
  const formResultHtml = `<div
      id="form-result"
      class="fixed form-result--invisible bottom-2 pl-2 py-0.5 left-2 w-48 h-fit border-2 border-solid ${formBorderColor} ${formColor}"
    >
      <h1 class="text-white text-sm" id="form-result-status">${formStatus}</h1>
      <p class="text-white text-sm" id="form-result-description">${formDescription}</p>
    </div>`;
  body.insertAdjacentHTML("beforeend", formResultHtml);
  setTimeout(() => {
    body.lastElementChild.classList.replace(
      "form-result--invisible",
      "form-result--visible"
    );
  }, 1);
  setTimeout(() => {
    body.lastElementChild.classList.replace(
      "form-result--visible",
      "form-result--invisible"
    );
  }, 5000);
};

const postTodo = async function (
  title,
  description,
  dueDate,
  createdAt,
  updatedAt,
  checked
) {
  let response = await fetch(
    "https://60b77f8f17d1dc0017b8a2c4.mockapi.io/todos",
    {
      method: "POST",
      body: JSON.stringify({
        title,
        description,
        dueDate,
        createdAt,
        updatedAt,
        checked,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }
  );
  let data = await response.json();
  if (response.ok) {
    return "The todo successfully submitted";
  }
  return new Error("Todo did not submit");
};

form.addEventListener("submit", function (e) {
  // prevent page reload
  e.preventDefault();
  const title = titleInput.value;
  const description = descriptionInput.value;
  // date value is string
  const dueDate = dateInput.value;
  console.log(dueDate);

  // check for empty fields
  const changeSectionInvalid = function (element, action) {
    element
      .closest(".form__sections__section")
      .classList[action]("form__sections__section--invalid");
    return true;
  };
  // if invalid add section invalid class else remove it
  (!title && changeSectionInvalid(titleInput, "add")) ||
    changeSectionInvalid(titleInput, "remove");
  (!dueDate && changeSectionInvalid(dateInput, "add")) ||
    changeSectionInvalid(dateInput, "remove");
  // if any invalid return
  if (!title || !dueDate) return;

  //post the todo
  const createdAt = currentStringDate();
  const updatedAt = createdAt;
  const checked = false;
  postTodo(title, description, dueDate, createdAt, updatedAt, checked)
    .then((description) => showFormResult("Successful", description))
    .catch((err) => showFormResult("Unsuccessful", err.message));
  form.reset();
});

console.log(currentStringDate());
// show todays date by default
dateInput.valueAsDate = new Date();
