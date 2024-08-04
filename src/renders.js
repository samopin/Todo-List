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
          <button
            class="form__button-section__button"
            type="submit"
          >Submit</button>
        </div>
      </form>`;
  content.innerHTML = homeHtml;
  form = document.querySelector(".form");
  form.addEventListener("submit", submitForm);
  titleInput = document.querySelector("#title-input");
  titleInput.focus();
  descriptionInput = document.querySelector("#description-input");
  dateInput = document.querySelector("#date-input");
  // show todays date by default
  dateInput.valueAsDate = new Date();
  updateUrl("/#/home");
};

const renderEdit = function ({ id, title, description, dueDate }) {
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
              value="${title}"
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
            >${description}</textarea>
          </div>
          <div class="form__sections__section">
            <label for="date-input">Due Date</label>
            <input
              class="form__sections__section__input"
              type="date"
              autocomplete="off"
              id="date-input"
              value="${dueDate}"
            />
          </div>
        </div>
        <div class="form__button-section">
          <button
            class="form__button-section__button"
            type="submit"
          >Save</button>
        </div>
      </form>`;
  content.innerHTML = homeHtml;
  form = document.querySelector(".form");
  form.addEventListener("submit", saveForm);
  titleInput = document.querySelector("#title-input");
  titleInput.focus();
  descriptionInput = document.querySelector("#description-input");
  dateInput = document.querySelector("#date-input");
  updateUrl(`/#/edit?id=${id}`);
};

const renderTodo = function ({ id, title, description, dueDate, checked }) {
  // only the date and not time
  dueDate = dueDate.slice(0, 10);
  const todoHtml = `<div id=todo-${id} class="todo">
            <div class="todo__header">
              <button class="todo__checked ${
                checked ? "todo__checked--true" : ""
              }"></button>
              <div class="todo__title text-lg">${title}</div>
              <div class="todo__dueDate text-lg">${dueDate}</div>
              <div class="todo__change">
                <button class="todo__edit">
                  <img
                    class="todo__edit__img"
                    src="assets/edit-icon.png"
                    alt="Edit"
                  />
                </button>
                <button class="todo__delete">
                  <img
                    class="todo__delete__img"
                    src="assets/delete-icon.png"
                    alt="Delete"
                  />
                </button>
              </div>
            </div>
            <div class="todo__description">${description}</div>
          </div>`;
  todosContainer.insertAdjacentHTML("beforeend", todoHtml);
};

const renderDelete = function (
  { id, title, description, dueDate, checked },
  currentPage
) {
  const deleteModalHtml = `<div class="modal-container">
          <div class="modal-mask"></div>
          <div id="todo-${id}" class="todo modal">
            <div class="todo__header">
              <div class="todo__checked"></div>
              <!-- <div class="todo__checked ${
                checked ? "todo__checked--true" : ""
              }"></div> -->
              <div class="todo__title text-lg">${title}</div>
              <div class="todo__dueDate text-lg">${dueDate}</div>
              <div class="todo__change">
                <b>Delete Todo</b>
                <button class="todo__cancel-delete">
                  <img
                    class="todo__cancel__img"
                    src="../assets/cancel-icon.png"
                    alt="Cancel"
                  />
                </button>
                <button class="todo__confirm-delete">
                  <img
                    class="todo__delete__img"
                    src="../assets/delete-icon.png"
                    alt="Delete"
                  />
                </button>
              </div>
            </div>
            <div class="todo__description">${description}</div>
          </div>
        </div>`;
  body.insertAdjacentHTML("beforeend", deleteModalHtml);
  deleteModal = body.lastElementChild;
  deleteModal.querySelector(".modal").focus();
  deleteModalConfirmButton = deleteModal.querySelector(".todo__delete__img");
  deleteModalCancelButton = deleteModal.querySelector(".todo__cancel__img");
  deleteModalConfirmButton.addEventListener("click", () =>
    removeTodo(id, currentPage)
  );
  deleteModalCancelButton.addEventListener("click", closeModal);
};

const renderPaginationSelector = function (value) {
  const paginationSelector = `<button name=pagination-selector-${value} class="todos-pagination__selector">${value}</button>`;
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
    else if (totalPages - currentPage <= 3) {
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
    if (!Number.isNaN(pageNumber)) renderTodos(pageNumber);
  });
};

const renderPageNotFound = function () {
  content.innerHTML = "Page not Found";
  updateUrl("/#/not-found");
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

  let pageUrl = `/#/todos?page=${currentPage}`;
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
      getTodo(todoId)
        .then((todo) => renderEdit(todo))
        .catch((message) => renderFormResult("Unsuccessful", message));
    }
    if (clickedElement.classList.contains("todo__delete__img")) {
      getTodo(todoId)
        .then((todo) => renderDelete(todo, currentPage))
        .catch((message) => renderFormResult("Unsuccessful", message));
    }
    if (clickedElement.classList.contains("todo__checked")) {
      let checked = clickedElement.classList.contains("todo__checked--true");
      putTodo({ id: todoId, checked: !checked })
        .then((description) => {
          console.log(description);
          renderFormResult("Successful", description);
          clickedElement.classList.toggle("todo__checked--true");
        })
        .catch((message) => renderFormResult("Unsuccessful", message));
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

const renderFormResult = function (formStatus, formDescription) {
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
