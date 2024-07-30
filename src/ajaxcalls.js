const getTodos = async function () {
  const response = await fetch(
    "https://60b77f8f17d1dc0017b8a2c4.mockapi.io/todos"
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
  return new Error("Todo did not submit");
};
