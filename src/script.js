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
let deleteModal;
let deleteModalConfirmButton;
let deleteModalCancelButton;

let todos;
const todosPerPage = 3;

let removeFormResultTimeout;
let fadeInFormResultTimeout;

const updateUrl = function (url) {
  window.history.pushState("", "", url);
};

const checkForm = function () {
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
  if (!title || !dueDate) return false;

  return {
    title,
    description,
    dueDate,
  };
};

const saveForm = function (e) {
  // avoid page reload
  e.preventDefault();
  let todo = checkForm();
  if (!todo) return;
  //TODO get todoId and pass to putTodo
  let currentUrl = window.location.href;
  let endPointsString = currentUrl.slice("http://127.0.0.1:5500/".length);
  let endpoints = parseEndpoints(endPointsString);
  let todoId = endpoints
    .filter((entry) => entry.endpoint == "edit")[0]
    .queryParameters.filter(
      (queryParameter) => queryParameter.key == "id"
    )[0].value;

  const updatedAt = currentStringDate();
  putTodo({
    id: todoId,
    title: todo.title,
    description: todo.description,
    dueDate: todo.dueDate,
    updatedAt,
  })
    .then((description) => {
      renderFormResult("Successful", description);
      renderHome();
    })
    .catch((err) => renderFormResult("Unsuccessful", err.message));
};

const submitForm = function (e) {
  // avoid page reload
  e.preventDefault();
  let todo = checkForm();
  if (!todo) return;
  const createdAt = currentStringDate();
  const updatedAt = createdAt;
  const checked = false;
  //post the todo
  postTodo(
    todo.title,
    todo.description,
    todo.dueDate,
    createdAt,
    updatedAt,
    checked
  )
    .then((description) => renderFormResult("Successful", description))
    .catch((err) => renderFormResult("Unsuccessful", err.message));
  form.reset();
  dateInput.valueAsDate = new Date();
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

const closeModal = function () {
  deleteModal.remove();
};

const removeTodo = function (id, currentPage) {
  deleteTodo(id)
    .then((description) => {
      renderFormResult("Successful", "Todo deleted successfully");
      renderTodos(currentPage);
      closeModal();
    })
    .catch((err) => {
      closeModal();
      renderFormResult("Unsuccessful", err.message);
    });
};

const parseEndpoints = function (endPointsString) {
  let endpoints = endPointsString.split("/");
  // remove fake endpoints created with / at start or end
  endpoints.at(-1) == "" && (endpoints = endpoints.slice(0, -1));
  endpoints.at(0) == "" && (endpoints = endpoints.slice(1));

  endpoints = endpoints.map((endpointString) => {
    let [endpoint, ...queryParameters] = endpointString.split("?");
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
  let currentUrl = window.location.href;
  let endPointsString = currentUrl.slice("http://127.0.0.1:5500/".length);
  let endpoints = parseEndpoints(endPointsString);
  console.log(endpoints);

  for (let { endpoint, queryParameters } of endpoints) {
    switch (endpoint) {
      case "home":
        renderHome();
        break;
      case "todos":
        queryParameters.forEach((queryParameter) => {
          switch (queryParameter.key) {
            case "page":
              renderTodos(queryParameter.value);
          }
        });
        break;
      case "edit":
        queryParameters.forEach((queryParameter) => {
          switch (queryParameter.key) {
            case "id":
              getTodo(queryParameter.value)
                .then((todo) => renderEdit(todo))
                .catch((message) => {
                  renderHome();
                });
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
