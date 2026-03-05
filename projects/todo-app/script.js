const taskInput = document.getElementById("task");
const addButton = document.querySelector("button");
const todoList = document.getElementById("list");

// Load tasks from localStorage on page load
function loadTasks() {
  const savedTasks = JSON.parse(localStorage.getItem("todos")) || [];
  savedTasks.forEach(task => createTodoItem(task.text, task.completed));
}

// Save current tasks to localStorage
function saveTasks() {
  const tasks = Array.from(todoList.children).map(li => ({
    text: li.querySelector("span").textContent,
    completed: li.classList.contains("completed")
  }));
  localStorage.setItem("todos", JSON.stringify(tasks));
}

// Create a todo item element
function createTodoItem(text, completed = false) {
  const li = document.createElement("li");

  const span = document.createElement("span");
  span.textContent = text;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.style.marginLeft = "15px";
  deleteBtn.style.background = "#ef4444";

  // Toggle complete on click (except delete button)
  li.addEventListener("click", (e) => {
    if (e.target.tagName !== "BUTTON") {
      li.classList.toggle("completed");
      saveTasks();
    }
  });

  // Delete task
  deleteBtn.addEventListener("click", () => {
    li.remove();
    saveTasks();
  });

  if (completed) li.classList.add("completed");

  li.appendChild(span);
  li.appendChild(deleteBtn);
  todoList.appendChild(li);
}

// Add new task
function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  createTodoItem(text);
  taskInput.value = "";
  saveTasks();
}

// Enter key support
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

// Click support for add button
addButton.addEventListener("click", addTask);

// Initialize
loadTasks();