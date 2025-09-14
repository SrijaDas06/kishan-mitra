// let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// function saveTasks() {
//   localStorage.setItem("tasks", JSON.stringify(tasks));
// }

// function renderTasks() {
//   const taskList = document.getElementById("taskList");
//   taskList.innerHTML = "";

//   tasks.forEach((task, index) => {
//     const li = document.createElement("li");
//     li.innerHTML = `
//       <span>${task}</span>
//       <button class="done-btn" onclick="markDone(${index})">Done</button>
//       <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
//     `;
//     taskList.appendChild(li);
//   });
// }

// function addTask() {
//   const input = document.getElementById("taskInput");
//   const taskText = input.value.trim();

//   if (taskText === "") {
//     alert("Write something, don't leave your brain on idle");
//     return;
//   }

//   tasks.push(taskText);
//   input.value = "";
//   saveTasks();
//   renderTasks();
// }

// function deleteTask(index) {
//   tasks.splice(index, 1);
//   saveTasks();
//   renderTasks();
// }

// function markDone(index) {
//   tasks.splice(index, 1); 
//   saveTasks();
//   renderTasks();
// }

// renderTasks();

// Load from localStorage or initialize
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <span style="text-decoration: ${task.completed ? 'line-through' : 'none'};">
        ${task.text}
      </span>
      <div>
        <button class="done-btn" onclick="toggleDone(${index})">
          ${task.completed ? 'Undo' : 'Done'}
        </button>
        <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
      </div>
    `;

    taskList.appendChild(li);
  });
}

function addTask() {
  const input = document.getElementById("taskInput");
  const taskText = input.value.trim();

  if (taskText === "") {
    alert("Write something, don't leave your brain on idle");
    return;
  }

  tasks.push({ text: taskText, completed: false });
  input.value = "";
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function toggleDone(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

// Initial render
renderTasks();