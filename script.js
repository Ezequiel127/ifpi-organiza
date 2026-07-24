const screens = document.querySelectorAll(".screen");
const nav = document.querySelector(".bottom-nav");
const navButtons = document.querySelectorAll(".nav-button");
const actionButtons = document.querySelectorAll("[data-screen]");
const taskForm = document.querySelector("#task-form");
const taskList = document.querySelector("#tasks-list");
const recentTasks = document.querySelector("#recent-tasks");
const deadlineList = document.querySelector("#deadline-list");
const pendingCount = document.querySelector("#pending-count");
const doneCount = document.querySelector("#done-count");
const nextTaskTitle = document.querySelector("#next-task-title");
const nextTaskInfo = document.querySelector("#next-task-info");
const filterButtons = document.querySelectorAll(".filter-button");

let activeFilter = "all";

let tasks = [
  {
    id: 1,
    title: "Ezequil lindo",
    subject: "Programação para Dispositivos Móveis",
    date: "2026-07-01",
    type: "Trabalho",
    done: false
  },
  {
    id: 2,
    title: "te amo Ezequiel",
    subject: "Projeto de MVP Mobile",
    date: "2026-07-01",
    type: "Documentação",
    done: false
  },
  {
    id: 3,
    title: "Revisar protótipo das telas",
    subject: "Projeto de MVP Mobile",
    date: "2026-07-03",
    type: "Revisão",
    done: false
  },
  {
    id: 4,
    title: "Estudar para prova de Engenharia de Software",
    subject: "Engenharia de Software",
    date: "2026-07-08",
    type: "Prova",
    done: false
  }
];

function showScreen(screenId) {
  screens.forEach((screen) => {
    screen.classList.toggle("active", screen.id === screenId);
  });

  const isLogin = screenId === "login-screen";
  nav.classList.toggle("visible", !isLogin);

  navButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.screen === screenId);
  });
}

function formatDate(dateValue) {
  const [year, month, day] = dateValue.split("-");
  return `${day}/${month}/${year}`;
}

function getSortedTasks() {
  return [...tasks].sort((a, b) => new Date(a.date) - new Date(b.date));
}

function getFilteredTasks() {
  if (activeFilter === "pending") {
    return getSortedTasks().filter((task) => !task.done);
  }

  if (activeFilter === "done") {
    return getSortedTasks().filter((task) => task.done);
  }

  return getSortedTasks();
}

function createTaskCard(task) {
  const card = document.createElement("article");
  card.className = `task-card ${task.done ? "done" : ""}`;

  const checkButton = document.createElement("button");
  checkButton.className = "task-check";
  checkButton.type = "button";
  checkButton.setAttribute("aria-label", `Alterar status da tarefa ${task.title}`);
  checkButton.addEventListener("click", () => toggleTask(task.id));

  const content = document.createElement("div");

  const title = document.createElement("h4");
  title.textContent = task.title;

  const meta = document.createElement("p");
  meta.className = "task-meta";
  meta.textContent = `${task.subject} • ${task.type} • ${formatDate(task.date)}`;

  content.append(title, meta);
  card.append(checkButton, content);

  return card;
}

function renderTasks() {
  const filteredTasks = getFilteredTasks();
  taskList.innerHTML = "";

  if (filteredTasks.length === 0) {
    taskList.innerHTML = '<p class="empty-state">Nenhuma tarefa encontrada.</p>';
    return;
  }

  filteredTasks.forEach((task) => {
    taskList.appendChild(createTaskCard(task));
  });
}

function renderRecentTasks() {
  recentTasks.innerHTML = "";

  getSortedTasks().slice(0, 3).forEach((task) => {
    recentTasks.appendChild(createTaskCard(task));
  });
}

function renderDeadlines() {
  deadlineList.innerHTML = "";

  getSortedTasks()
    .filter((task) => !task.done)
    .slice(0, 4)
    .forEach((task) => {
      const item = document.createElement("article");
      item.className = "deadline-item";
      item.innerHTML = `<strong>${formatDate(task.date)}</strong><p>${task.title} - ${task.subject}</p>`;
      deadlineList.appendChild(item);
    });

  if (deadlineList.children.length === 0) {
    deadlineList.innerHTML = '<p class="empty-state">Sem prazos pendentes.</p>';
  }
}

function renderSummary() {
  const pending = tasks.filter((task) => !task.done);
  const done = tasks.filter((task) => task.done);
  const nextTask = getSortedTasks().find((task) => !task.done);

  pendingCount.textContent = pending.length;
  doneCount.textContent = done.length;

  if (nextTask) {
    nextTaskTitle.textContent = nextTask.title;
    nextTaskInfo.textContent = `${nextTask.subject} vence em ${formatDate(nextTask.date)}.`;
  } else {
    nextTaskTitle.textContent = "Nenhuma tarefa pendente";
    nextTaskInfo.textContent = "Todas as atividades cadastradas foram concluídas.";
  }
}

function renderApp() {
  renderSummary();
  renderTasks();
  renderRecentTasks();
  renderDeadlines();
}

function toggleTask(taskId) {
  tasks = tasks.map((task) => {
    if (task.id === taskId) {
      return { ...task, done: !task.done };
    }

    return task;
  });

  renderApp();
}

actionButtons.forEach((button) => {
  button.addEventListener("click", () => showScreen(button.dataset.screen));
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderTasks();
  });
});

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = document.querySelector("#task-title").value.trim();
  const subject = document.querySelector("#task-subject").value.trim();
  const date = document.querySelector("#task-date").value;
  const type = document.querySelector("#task-type").value;

  if (!title || !subject || !date) {
    return;
  }

  tasks.push({
    id: Date.now(),
    title,
    subject,
    date,
    type,
    done: false
  });

  taskForm.reset();
  activeFilter = "all";
  filterButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === "all");
  });

  renderApp();
  showScreen("tasks-screen");
});

renderApp();
showScreen("login-screen");
