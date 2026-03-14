// ============================================================
//  Todo App — script.js
//  Features: add, complete, delete, filter, clear completed,
//            localStorage persistence, stats bar, shake on empty
// ============================================================

// ── DOM references ───────────────────────────────────────────
const taskInput    = document.getElementById("task");
const addBtn       = document.getElementById("add-btn");
const todoList     = document.getElementById("list");
const emptyState   = document.getElementById("empty-state");
const clearCompBtn = document.getElementById("clear-completed");
const countTotal   = document.getElementById("count-total");
const countActive  = document.getElementById("count-active");
const countDone    = document.getElementById("count-done");
const filterTabs   = document.querySelectorAll(".tab");

let currentFilter = "all";

// ── Save to localStorage ─────────────────────────────────────
// Reads current DOM state and writes to storage.
// Does NOT trigger a re-render — call updateStats/applyFilter
// separately after bulk operations to avoid redundant writes.
function saveTasks() {
  const tasks = Array.from(todoList.querySelectorAll(".todo-item")).map(li => ({
    text:      li.querySelector(".todo-text").textContent,
    completed: li.classList.contains("completed")
  }));
  localStorage.setItem("todos-v2", JSON.stringify(tasks));
}

// ── Update stats bar ─────────────────────────────────────────
function updateStats() {
  const items  = todoList.querySelectorAll(".todo-item");
  const done   = todoList.querySelectorAll(".todo-item.completed").length;
  const total  = items.length;
  const active = total - done;

  countTotal.textContent  = total;
  countActive.textContent = active;
  countDone.textContent   = done;

  // Show/hide empty state
  emptyState.style.display    = total === 0 ? "flex" : "none";
  emptyState.setAttribute("aria-hidden", total === 0 ? "false" : "true");
}

// ── Apply current filter (show/hide items) ───────────────────
function applyFilter() {
  todoList.querySelectorAll(".todo-item").forEach(li => {
    const isDone = li.classList.contains("completed");
    let visible = true;
    if (currentFilter === "active"    &&  isDone) visible = false;
    if (currentFilter === "completed" && !isDone) visible = false;
    li.classList.toggle("hidden", !visible);
  });
}

// ── Create a single todo list item ───────────────────────────
function createTodoItem(text, completed = false, skipSave = false) {
  const li = document.createElement("li");
  li.classList.add("todo-item");
  if (completed) li.classList.add("completed");

  // ── Checkbox button
  const checkBtn = document.createElement("button");
  checkBtn.className = "todo-check" + (completed ? " checked" : "");
  checkBtn.setAttribute("aria-label", completed ? "Mark incomplete" : "Mark complete");
  checkBtn.innerHTML = `
    <svg viewBox="0 0 12 10" fill="none" stroke="currentColor"
         stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="1.5,5 4.5,8 10.5,2"/>
    </svg>`;

  // ── Task text
  const span = document.createElement("span");
  span.classList.add("todo-text");
  span.textContent = text;

  // ── Delete button
  const delBtn = document.createElement("button");
  delBtn.classList.add("todo-delete");
  delBtn.setAttribute("aria-label", "Delete task: " + text);
  delBtn.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <path d="M18 6L6 18M6 6l12 12"/>
    </svg>`;

  // ── Toggle complete
  checkBtn.addEventListener("click", () => {
    const nowDone = li.classList.toggle("completed");
    checkBtn.classList.toggle("checked", nowDone);
    checkBtn.setAttribute("aria-label", nowDone ? "Mark incomplete" : "Mark complete");
    saveTasks();
    updateStats();
    applyFilter();
  });

  // ── Delete with fade-out animation
  delBtn.addEventListener("click", () => {
    li.classList.add("removing");
    li.addEventListener("animationend", () => {
      li.remove();
      saveTasks();
      updateStats();
      applyFilter();
    }, { once: true });
  });

  li.append(checkBtn, span, delBtn);
  todoList.appendChild(li);

  // skipSave = true when loading from storage (bulk load)
  // to avoid writing localStorage once per item
  if (!skipSave) {
    saveTasks();
    updateStats();
    applyFilter();
  }

  return li;
}

// ── Add a new task ───────────────────────────────────────────
function addTask() {
  const text = taskInput.value.trim();

  if (!text) {
    // Fix: shake animation is defined in CSS and triggered here
    taskInput.classList.remove("shake"); // reset if already shaking
    void taskInput.offsetWidth;          // force reflow so animation retriggers
    taskInput.classList.add("shake");
    taskInput.addEventListener(
      "animationend",
      () => taskInput.classList.remove("shake"),
      { once: true }
    );
    taskInput.focus();
    return;
  }

  createTodoItem(text);
  taskInput.value = "";
  taskInput.focus();
}

// ── Load tasks from localStorage ─────────────────────────────
// Fix: uses skipSave=true so we don't write localStorage
// once per item during load — we do one write at the end.
function loadTasks() {
  const saved = JSON.parse(localStorage.getItem("todos-v2")) || [];
  saved.forEach(t => createTodoItem(t.text, t.completed, true));
  // One save + stats update after full load
  saveTasks();
  updateStats();
  applyFilter();
}

// ── Filter tabs ──────────────────────────────────────────────
filterTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    filterTabs.forEach(t => {
      t.classList.remove("active");
      t.setAttribute("aria-selected", "false");
    });
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    currentFilter = tab.dataset.filter;
    applyFilter();
  });
});

// ── Clear all completed tasks ────────────────────────────────
clearCompBtn.addEventListener("click", () => {
  const done = todoList.querySelectorAll(".todo-item.completed");
  if (done.length === 0) return; // nothing to do

  done.forEach(li => li.remove());
  saveTasks();
  updateStats();
  applyFilter();
});

// ── Add button + Enter key ───────────────────────────────────
addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keydown", e => {
  if (e.key === "Enter") addTask();
});

// ── Initialise ───────────────────────────────────────────────
loadTasks();