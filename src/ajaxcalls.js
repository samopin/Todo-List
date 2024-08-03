const getTodos = async function () {
  const response = await fetch(
    "https://60b77f8f17d1dc0017b8a2c4.mockapi.io/todos"
  );
  const data = await response.json();
  return data;
};

const getTodo = async function (todoId) {
  const response = await fetch(
    `https://60b77f8f17d1dc0017b8a2c4.mockapi.io/todos/${todoId}`
  );
  const data = await response.json();
  return data;
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
  return Promise.reject("Todo did not submit");
};

const putTodo = async function (todo) {
  let response = await fetch(
    `https://60b77f8f17d1dc0017b8a2c4.mockapi.io/todos/${todo.id}`,
    {
      method: "PUT",
      body: JSON.stringify(todo),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }
  );
  console.log(response);
  let data = await response.json();
  console.log(data);
  if (response.ok) {
    return "The todo successfully edited";
  }
  return Promise.reject("Todo did not edit");
};
