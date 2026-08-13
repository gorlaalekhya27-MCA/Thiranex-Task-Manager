let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
    const taskInput = document.getElementById("taskInput");
    const priority = document.getElementById("priority");

    const title = taskInput.value.trim();

    if (title === "") {
        alert("Please enter a task!");
        return;
    }

    const task = {
        id: Date.now(),
        title: title,
        priority: priority.value,
        completed: false,
        date: new Date().toLocaleDateString()
    };

    tasks.push(task);

    saveTasks();

    taskInput.value = "";

    displayTasks();
}

function displayTasks() {

    const taskList = document.getElementById("taskList");
    const searchText =
        document.getElementById("searchInput").value.toLowerCase();

    const filter =
        document.getElementById("filter").value;

    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(task => {

        const matchesSearch =
            task.title.toLowerCase().includes(searchText);

        const matchesFilter =
            filter === "all" ||
            (filter === "pending" && !task.completed) ||
            (filter === "completed" && task.completed);

        return matchesSearch && matchesFilter;
    });

    document.getElementById("emptyMessage").style.display =
        filteredTasks.length === 0 ? "block" : "none";

    filteredTasks.forEach(task => {

        const taskElement = document.createElement("div");

        taskElement.className =
            `task ${task.completed ? "completed" : ""}`;

        taskElement.innerHTML = `
            <div class="task-info">

                <div class="task-title">
                    ${escapeHTML(task.title)}
                </div>

                <div class="task-date">
                    Created: ${task.date}
                </div>

                <span class="priority ${task.priority}">
                    ${task.priority} Priority
                </span>

            </div>

            <div class="actions">

                <button
                    class="complete-btn"
                    onclick="toggleTask(${task.id})">
                    ${task.completed ? "Undo" : "Done"}
                </button>

                <button
                    class="edit-btn"
                    onclick="editTask(${task.id})">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteTask(${task.id})">
                    Delete
                </button>

            </div>
        `;

        taskList.appendChild(taskElement);
    });

    updateStats();
}

function toggleTask(id) {

    const task = tasks.find(task => task.id === id);

    if (task) {
        task.completed = !task.completed;
    }

    saveTasks();
    displayTasks();
}

function editTask(id) {

    const task = tasks.find(task => task.id === id);

    if (!task) return;

    const newTitle = prompt("Edit your task:", task.title);

    if (newTitle === null) {
        return;
    }

    if (newTitle.trim() === "") {
        alert("Task cannot be empty!");
        return;
    }

    task.title = newTitle.trim();

    saveTasks();
    displayTasks();
}

function deleteTask(id) {

    const confirmation =
        confirm("Are you sure you want to delete this task?");

    if (!confirmation) {
        return;
    }

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    displayTasks();
}

function updateStats() {

    const total = tasks.length;

    const completed =
        tasks.filter(task => task.completed).length;

    const pending = total - completed;

    document.getElementById("totalTasks").textContent = total;

    document.getElementById("pendingTasks").textContent = pending;

    document.getElementById("completedTasks").textContent = completed;
}

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}

// Allow Enter key to add task
document.getElementById("taskInput").addEventListener("keypress", function(event) {

    if (event.key === "Enter") {
        addTask();
    }

});

// Display tasks when page loads
displayTasks();