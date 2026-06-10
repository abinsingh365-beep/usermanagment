// // Get tasks from localStorage
// let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// // Add Task (Admin)
// function addTask() {
//     let taskInput = document.getElementById("taskInput");

//     if (taskInput.value.trim() === "") {
//         alert("Enter a task");
//         return;
//     }

//     tasks.push(taskInput.value);
//     localStorage.setItem("tasks", JSON.stringify(tasks));

//     taskInput.value = "";
//     displayTasks();
// }

// // Display Tasks
// function displayTasks() {
//     let adminList = document.getElementById("adminTaskList");
//     let userList = document.getElementById("userTaskList");

//     if (adminList) adminList.innerHTML = "";
//     if (userList) userList.innerHTML = "";

//     tasks.forEach(task => {
//         let li = document.createElement("li");
//         li.textContent = task;

//         if (adminList) adminList.appendChild(li.cloneNode(true));
//         if (userList) userList.appendChild(li.cloneNode(true));
//     });
// }

// displayTasks();