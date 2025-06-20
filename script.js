// script.js

document.addEventListener("DOMContentLoaded", () => {
  const quoteEl = document.getElementById("quote");
  const quotes = [
    "Believe you can and you're halfway there.",
    "Do something today that your future self will thank you for.",
    "Success is the sum of small efforts, repeated day in and day out.",
    "Your limitation—it's only your imagination."
  ];
  quoteEl.innerText = quotes[Math.floor(Math.random() * quotes.length)];

  loadTasks();
});

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const category = document.getElementById("taskCategory").value;
  const taskText = taskInput.value.trim();

  if (!taskText) return;

  const li = document.createElement("li");
  li.innerHTML = `
    <span class="task-icon">✅</span>
    <span class="task-text">${taskText}</span>
    <button onclick="toggleDone(this)">✔️</button>
    <button onclick="deleteTask(this)">❌</button>
  `;

  document.getElementById(`${category}List`).appendChild(li);
  saveTasks();
  showNotification(`Task added to ${category}`);
  taskInput.value = "";
}

function deleteTask(button) {
  const li = button.parentElement;
  li.remove();
  saveTasks();
  showNotification("Task deleted");
}

function toggleDone(button) {
  button.parentElement.classList.toggle("done");
  saveTasks();
}

function toggleTheme() {
  document.body.classList.toggle("dark");
}

function saveTasks() {
  const categories = ["daily", "weekly", "monthly"];
  const allTasks = {};
  categories.forEach(category => {
    const tasks = [];
    document.querySelectorAll(`#${category}List li`).forEach(li => {
      tasks.push({
        text: li.querySelector(".task-text").innerText,
        done: li.classList.contains("done")
      });
    });
    allTasks[category] = tasks;
  });
  localStorage.setItem("tasks", JSON.stringify(allTasks));
}

function loadTasks() {
  const saved = JSON.parse(localStorage.getItem("tasks"));
  if (!saved) return;
  Object.keys(saved).forEach(category => {
    const list = document.getElementById(`${category}List`);
    saved[category].forEach(task => {
      const li = document.createElement("li");
      li.className = task.done ? "done" : "";
      li.innerHTML = `
        <span class="task-icon">✅</span>
        <span class="task-text">${task.text}</span>
        <button onclick="toggleDone(this)">✔️</button>
        <button onclick="deleteTask(this)">❌</button>
      `;
      list.appendChild(li);
    });
  });
}

function showNotification(message) {
  if (!("Notification" in window)) return;
  if (Notification.permission === "granted") {
    new Notification("To-Do Reminder", { body: message });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification("To-Do Reminder", { body: message });
      }
    });
  }
}

// Ensure functions are accessible globally
window.addTask = addTask;
window.deleteTask = deleteTask;
window.toggleDone = toggleDone;
window.toggleTheme = toggleTheme;
// Register service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("service-worker.js").then(function (registration) {
      console.log("ServiceWorker registered:", registration);
    }).catch(function (error) {
      console.log("ServiceWorker registration failed:", error);
    });
  });
}
