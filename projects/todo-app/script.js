const taskInput     = document.getElementById("task");
const addBtn        = document.getElementById("add-btn");
const todoList      = document.getElementById("list");
const emptyState    = document.getElementById("empty-state");
const clearCompBtn  = document.getElementById("clear-completed");
const countTotal    = document.getElementById("count-total");
const countActive   = document.getElementById("count-active");
const countDone     = document.getElementById("count-done");
const filterTabs    = document.querySelectorAll(".tab");

let currentFilter = "all";

// ── Helpers ──────────────────────────────────────────────

function saveTasks() {
  const tasks = Array.from(todoList.querySelectorAll(".todo-item")).map(li => ({
    text:      li.querySelector(".todo-text").textContent,
    completed: li.classList.contains("completed")
  }));
  localStorage.setItem("todos-v2", JSON.stringify(tasks));
  updateStats();
  applyFilter();
}

function updateStats() {
  const items     = todoList.querySelectorAll(".todo-item");
  const done      = todoList.querySelectorAll(".todo-item.completed").length;
  const total     = items.length;
  const active    = total - done;

  countTotal.textContent  = total;
  countActive.textContent = active;
  countDone.textContent   = done;

  emptyState.style.display = total === 0 ? "flex" : "none";
}

function applyFilter() {
  const items = todoList.querySelectorAll(".todo-item");
  items.forEach(li => {
    const isDone = li.classList.contains("completed");
    let show = true;
    if (currentFilter === "active"    &&  isDone) show = false;
    if (currentFilter === "completed" && !isDone) show = false;
    li.classList.toggle("hidden", !show);
  });
}

// ── Create item ──────────────────────────────────────────

function createTodoItem(text, completed = false) {
  const li = document.createElement("li");
  li.classList.add("todo-item");
  if (completed) li.classList.add("completed");

  // Checkbox
  const checkBtn = document.createElement("button");
  checkBtn.className = "todo-check" + (completed ? " checked" : "");
  checkBtn.setAttribute("aria-label", "Toggle complete");
  checkBtn.innerHTML = `<svg viewBox="0 0 12 10" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="1.5,5 4.5,8 10.5,2"/></svg>`;

  // Text
  const span = document.createElement("span");
  span.classList.add("todo-text");
  span.textContent = text;

  // Delete
  const delBtn = document.createElement("button");
  delBtn.classList.add("todo-delete");
  delBtn.setAttribute("aria-label", "Delete task");
  delBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>`;

  // Toggle
  checkBtn.addEventListener("click", () => {
    li.classList.toggle("completed");
    checkBtn.classList.toggle("checked");
    saveTasks();
  });

  // Delete
  delBtn.addEventListener("click", () => {
    li.style.opacity = "0";
    li.style.transform = "translateX(20px)";
    li.style.transition = "opacity 0.2s, transform 0.2s";
    setTimeout(() => { li.remove(); saveTasks(); }, 200);
  });

  li.append(checkBtn, span, delBtn);
  todoList.appendChild(li);
}

// ── Add task ─────────────────────────────────────────────

function addTask() {
  const text = taskInput.value.trim();
  if (!text) {
    taskInput.classList.add("shake");
    taskInput.addEventListener("animationend", () => taskInput.classList.remove("shake"), { once: true });
    return;
  }
  createTodoItem(text);
  taskInput.value = "";
  taskInput.focus();
  saveTasks();
}

// ── Load from storage ────────────────────────────────────

function loadTasks() {
  const saved = JSON.parse(localStorage.getItem("todos-v2")) || [];
  saved.forEach(t => createTodoItem(t.text, t.completed));
  updateStats();
}

// ── Filter tabs ──────────────────────────────────────────

filterTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    filterTabs.forEach(t => { t.classList.remove("active"); t.setAttribute("aria-selected","false"); });
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    currentFilter = tab.dataset.filter;
    applyFilter();
  });
});

// ── Clear completed ──────────────────────────────────────

clearCompBtn.addEventListener("click", () => {
  const done = todoList.querySelectorAll(".todo-item.completed");
  done.forEach(li => li.remove());
  saveTasks();
});

// ── Events ───────────────────────────────────────────────

addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keydown", e => { if (e.key === "Enter") addTask(); });

// ── Init ─────────────────────────────────────────────────
loadTasks();