"use strict";

const body = document.querySelector("body");
const content = document.querySelector("#content");
const nav = document.querySelector(".nav");

let form;
let titleInput;
let descriptionInput;
let dateInput;
let todosContainer;
let todosPagination;
let todosPaginationSelectors;

let todos;
const todosPerPage = 3;

let removeFormResultTimeout;
let fadeInFormResultTimeout;

const updateUrl = function (url) {
  window.history.pushState("", "", url);
};

const submitForm = function (e) {
  // avoid page reload
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
  console.log("bbb");
  postTodo(title, description, dueDate, createdAt, updatedAt, checked)
    .then((description) => showFormResult("Successful", description))
    .catch((err) => showFormResult("Unsuccessful", err.message));
  form.reset();
  dateInput.valueAsDate = new Date();
};

const renderHome = function () {
  const homeHtml = `<form class="form">
      <div class="form__sections">
        <div class="form__sections__section">
          <label for="title-input">Title</label>
          <input
            class="form__sections__section__input"
            id="title-input"
            type="text"
            autocomplete="off"
            placeholder="What will you do today?"
          />
        </div>
        <div class="form__sections__section">
          <label for="description-input">Description</label>
          <textarea
            class="form__sections__section__input"
            type="text"
            autocomplete="off"
            id="description-input"
            placeholder="Some information"
          ></textarea>
        </div>
        <div class="form__sections__section">
          <label for="date-input">Due Date</label>
          <input
            class="form__sections__section__input"
            type="date"
            autocomplete="off"
            id="date-input"
          />
        </div>
      </div>
      <div class="form__button-section">
        <input
          class="form__button-section__button"
          type="submit"
          value="Submit"
        />
      </div>
    </form>`;
  content.innerHTML = homeHtml;
  form = document.querySelector(".form");
  form.addEventListener("submit", submitForm);
  titleInput = document.querySelector("#title-input");
  descriptionInput = document.querySelector("#description-input");
  dateInput = document.querySelector("#date-input");
  // show todays date by default
  dateInput.valueAsDate = new Date();
  updateUrl("/home");
};

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
  // remove the previous form result
  if (body.lastElementChild.classList.contains("form-result")) {
    body.lastElementChild.remove();
    clearTimeout(removeFormResultTimeout);
    clearTimeout(fadeInFormResultTimeout);
  }
  let formColor, formBorderColor;
  switch (formStatus) {
    case "Successful":
      formColor = "bg-green-500";
      formBorderColor = "border-green-700";
      break;
    case "Unsuccessful":
      formColor = "bg-red-500";
      formBorderColor = "border-red-700";
      break;
    default:
      formColor = "bg-gray-500";
      formBorderColor = "border-gray-700";
  }
  const formResultHtml = `<div
      id="form-result"
      class="fixed form-result--invisible bottom-2 pl-2 py-0.5 left-2 w-48 h-fit border-2 border-solid ${formBorderColor} ${formColor}"
    >
      <h1 class="text-white font-bold text-sm" id="form-result-status">${formStatus}</h1>
      <p class="text-white text-sm" id="form-result-description">${formDescription}</p>
    </div>`;
  body.insertAdjacentHTML("beforeend", formResultHtml);
  // form result fade in
  fadeInFormResultTimeout = setTimeout(() => {
    body.lastElementChild.classList.replace(
      "form-result--invisible",
      "form-result--visible"
    );
  }, 500);
  // form result fade out
  removeFormResultTimeout = setTimeout(() => {
    body.lastElementChild.classList.replace(
      "form-result--visible",
      "form-result--invisible"
    );
    setTimeout(() => body.lastElementChild.remove(), 1000);
  }, 3000);
};

nav.addEventListener("click", function (e) {
  if (!e.target.classList.contains("nav-link")) return;
  let id = e.target.id;
  switch (id) {
    case "nav__home":
      renderHome();
      break;
    case "nav__todos":
      renderTodos(1);
      break;
  }
});

const renderTodo = function ({ id, title, description, dueDate, checked }) {
  // only the date and not time
  dueDate = dueDate.slice(0, 10);
  const todoHtml = `<div id=todo-${id} class="todo">
          <div class="todo__header">
            <div class="todo__checked ${
              checked ? "todo__checked--true" : ""
            }"></div>
            <div class="todo__title text-lg">${title}</div>
            <div class="todo__dueDate text-lg">${dueDate}</div>
            <div class="todo__change">
              <div class="todo__edit">
                <img
                  class="todo__edit__img"
                  src="../assets/edit-icon.png"
                  alt="Edit"
                />
              </div>
              <div class="" class="todo__delete">
                <img
                  class="todo__delete__img"
                  src="../assets/delete-icon.png"
                  alt="Delete"
                />
              </div>
            </div>
          </div>
          <div class="todo__description">${description}</div>
        </div>`;
  todosContainer.insertAdjacentHTML("beforeend", todoHtml);
};

const renderPaginationSelector = function (value) {
  const paginationSelector = `<div name=pagination-selector-${value} class="todos-pagination__selector">${value}</div>`;
  todosPagination.insertAdjacentHTML("beforeend", paginationSelector);
};

const renderPagination = function (currentPage, totalPages) {
  todosPaginationSelectors = todosPagination.children;
  // at most 7 pagination selector
  let selectorAmount = Math.min(7, totalPages);
  if (selectorAmount < 7) {
    for (let i = 1; i <= selectorAmount; i++) {
      renderPaginationSelector(i);
    }
  }
  if (selectorAmount >= 7) {
    // one of the first pages
    if (currentPage <= 4) {
      for (let i = 1; i <= 5; i++) {
        renderPaginationSelector(i);
      }
      renderPaginationSelector("...");
      renderPaginationSelector(totalPages);
    }
    // one of the last pages
    else if (totalPages - currentPage <= 4) {
      renderPaginationSelector(1);
      renderPaginationSelector("...");
      for (let i = totalPages - 4; i <= totalPages; i++) {
        renderPaginationSelector(i);
      }
    }
    // one of the middle pages
    else {
      renderPaginationSelector(1);
      renderPaginationSelector("...");
      renderPaginationSelector(currentPage - 1);
      renderPaginationSelector(currentPage);
      renderPaginationSelector(currentPage + 1);
      renderPaginationSelector("....");
      renderPaginationSelector(totalPages);
    }
  }
  // add listener for pagination
  todosPagination.addEventListener("click", (e) => {
    // not a selector
    if (!e.target.classList.contains("todos-pagination__selector")) return;
    let pageNumber = Number(e.target.innerHTML);
    if (!Number.isNaN()) renderTodos(pageNumber);
  });
};

const renderPageNotFound = function () {
  todosContainer.innerHTML = "Page not Found";
};

const renderPage = function (currentPage, todosPerPage) {
  let totalTodos = todos.length;
  let totalPages = Math.ceil(totalTodos / todosPerPage);
  // currentPage doesn't exist
  if (currentPage < 1 || currentPage > totalPages) {
    todosPagination.remove();
    renderPageNotFound();
    return;
  }
  let pageTodos = todos.slice(
    todosPerPage * (currentPage - 1),
    todosPerPage * currentPage
  );
  console.log(pageTodos);

  let pageUrl = `/todos#page=${currentPage}`;
  updateUrl(pageUrl);

  pageTodos.forEach((todoObject) => {
    renderTodo(todoObject);
  });
  renderPagination(currentPage, totalPages);

  //mark current page selector as active
  let currentPageSelector = todosPagination.querySelector(
    `[name=pagination-selector-${currentPage}]`
  );
  currentPageSelector.classList.add("todos-pagination__selector--active");

  //add listener for todo changing
  todosContainer.addEventListener("click", (e) => {
    let clickedElement = e.target;
    let todo = clickedElement.closest(".todo");
    let todoId = Number(todo.id.slice("todo-".length));
    if (clickedElement.classList.contains("todo__edit__img")) {
      //TODO open edit page
    }
    if (clickedElement.classList.contains("todo__delete__img")) {
      //TODO open delete modal
    }
    if (clickedElement.classList.contains("todo__checked")) {
      let checked = clickedElement.classList.contains("todo__checked--true");
      putTodo(todoId, !checked)
        .then((description) => {
          console.log(description);
          showFormResult("Successful", description);
          clickedElement.classList.toggle("todo__checked--true");
        })
        .catch((message) => showFormResult("Unsuccessful", message));
    }
  });
};

const renderTodos = function (currentPage) {
  const todosHtml = `<div class="todos-container">
      </div>
      <div class="todos-pagination"></div>`;

  getTodos().then((data) => {
    todos = data.sort((todo1, todo2) =>
      todo2.updatedAt.localeCompare(todo1.updatedAt)
    );
    content.innerHTML = todosHtml;
    todosContainer = document.querySelector(".todos-container");
    todosPagination = document.querySelector(".todos-pagination");
    renderPage(currentPage, todosPerPage);
  });
};

const parseEndpoints = function (endPointsString) {
  let endpoints = endPointsString.split("/");

  // remove fake endpoints created with / at start or end
  endpoints.at(-1) == "" && (endpoints = endpoints.slice(0, -1));
  endpoints.at(0) == "" && (endpoints = endpoints.slice(1));

  endpoints = endpoints.map((endpointString) => {
    let [endpoint, ...queryParameters] = endpointString.split("#");
    queryParameters = queryParameters.map((queryParameterString) => {
      let queryPairParts = queryParameterString.split("=");
      return {
        key: queryPairParts[0],
        value: Number(queryPairParts[1]),
      };
    });
    return { endpoint, queryParameters };
  });
  return endpoints;
};

const updateContent = function (e) {
  e.preventDefault();
  let currentUrl = window.location.pathname;
  let endPointsString = currentUrl.slice("http://127.0.0.1:5500/".length);
  let endpoints = parseEndpoints(endPointsString);

  for (let { endpoint, queryParameters } of endpoints) {
    switch (endpoint) {
      case "todos":
        queryParameters.forEach((queryParameter) => {
          switch (queryParameter.key) {
            case "page":
              renderTodos(queryParameter.value);
              break;
          }
        });
      default:
        break;
    }
  }
};

// listen for history changes
window.addEventListener("hashchange", updateContent);

// renderHome();
renderTodos(1);
