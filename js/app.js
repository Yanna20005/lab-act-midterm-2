const ui = {
  input: document.getElementById("taskInput"),
  addBtn: document.getElementById("addTaskBtn"),
  loadBtn: document.getElementById("loadSamplesBtn"),
  list: document.getElementById("taskList"),
  message: document.getElementById("taskMessage"),
  total: document.getElementById("totalCount"),
  pending: document.getElementById("pendingCount"),
  completed: document.getElementById("completedCount")
};

let idCount = 0;

function makeId() {
  idCount = idCount + 1;
  return "task-" + idCount;
}

function createTaskElement(taskText, taskId) {
  const item = document.createElement("li");
  item.classList.add("task-item");
  item.setAttribute("data-task-id", taskId);
  item.setAttribute("data-state", "pending");

  const text = document.createElement("span");
  text.classList.add("task-text");
  text.textContent = taskText;
  item.appendChild(text);

  const labels = ["complete-btn", "edit-btn", "remove-btn"];
  const names = ["Complete", "Edit", "Remove"];
  for (let i = 0; i < labels.length; i++) {
    const btn = document.createElement("button");
    btn.classList.add(labels[i]);
    btn.textContent = names[i];
    item.appendChild(btn);
  }

  return item;
}

function addTask(taskText) {
  const clean = taskText.trim();
  if (clean.length === 0) {
    ui.message.textContent = "Task cannot be empty";
    return;
  }

  const item = createTaskElement(clean, makeId());
  ui.list.appendChild(item);
  ui.input.value = "";
  ui.message.textContent = "";
  updateTaskCounts();
}

function toggleTaskComplete(taskItem) {
  const done = taskItem.classList.toggle("completed");
  taskItem.dataset.state = done ? "completed" : "pending";
  updateTaskCounts();
}

function beginTaskEdit(taskItem) {
  const text = taskItem.querySelector(".task-text");
  const edit = taskItem.querySelector(".edit-btn");

  const field = document.createElement("input");
  field.classList.add("edit-input");
  field.value = text.textContent;

  taskItem.replaceChild(field, text);
  edit.textContent = "Save";
}

function saveTaskEdit(taskItem) {
  const field = taskItem.querySelector(".edit-input");
  const edit = taskItem.querySelector(".edit-btn");
  const value = field.value.trim();

  if (value.length === 0) {
    ui.message.textContent = "Task cannot be empty";
    return;
  }

  const text = document.createElement("span");
  text.classList.add("task-text");
  text.textContent = value;

  taskItem.replaceChild(text, field);
  edit.textContent = "Edit";
  ui.message.textContent = "";
}

function removeTask(taskItem) {
  taskItem.remove();
  updateTaskCounts();
}

function updateTaskCounts() {
  const items = ui.list.querySelectorAll(".task-item");
  let done = 0;

  items.forEach(function (item) {
    if (item.dataset.state === "completed") {
      done = done + 1;
    }
  });

  ui.total.textContent = items.length;
  ui.completed.textContent = done;
  ui.pending.textContent = items.length - done;
}

function handleTaskListClick(event) {
  const clicked = event.target;
  const taskItem = clicked.closest(".task-item");
  if (!taskItem) return;

  if (clicked.matches(".complete-btn")) {
    toggleTaskComplete(taskItem);
  }
  if (clicked.matches(".edit-btn")) {
    if (clicked.textContent === "Save") {
      saveTaskEdit(taskItem);
    } else {
      beginTaskEdit(taskItem);
    }
  }
  if (clicked.matches(".remove-btn")) {
    removeTask(taskItem);
  }
}

function loadSampleTasks() {
  const samples = ["Review DOM selectors", "Practice createElement", "Study event delegation"];
  const frag = document.createDocumentFragment();

  samples.forEach(function (sample) {
    frag.appendChild(createTaskElement(sample, makeId()));
  });

  ui.list.appendChild(frag);
  updateTaskCounts();
}

ui.addBtn.addEventListener("click", function () {
  addTask(ui.input.value);
});

ui.loadBtn.addEventListener("click", loadSampleTasks);

ui.list.addEventListener("click", handleTaskListClick);

updateTaskCounts();
