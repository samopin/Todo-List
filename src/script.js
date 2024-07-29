"use strict";

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

form.addEventListener("submit", function (e) {
  // prevent page reload
  e.preventDefault();
  const title = titleInput.value;
  const description = descriptionInput.value;
  // date value is string
  const dueDate = dateInput.value;

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
  console.log(title, description, dueDate, createdAt, updatedAt, checked);
  postTodo(title, description, dueDate, createdAt, updatedAt, checked);
});
