var tasksArray = [];

//Reference to handle HTML Elements
const addTaskBtnEl = document.getElementById("add-task-btn");
const newTaskInputEl = document.getElementById("new-task-input");
const unorderedListEl = document.getElementById("tasks-list");

//Events
addTaskBtnEl.addEventListener("click", addNewTask);

//Main

loadFromLocalStorage();
renderTasks();

//Functions
function addNewTask(){
    const text = newTaskInputEl.value.trim();
    if(text === "") return alert("Empty task!");

    const newTask = {
        id: Date.now(),
        text: text,
        isCompleted: false
    };

    tasksArray.push(newTask);
    saveToLocalStorage();

    newTaskInputEl.value = "";
    renderTasks();
}

function renderTasks(){
    unorderedListEl.innerHTML = "";

    tasksArray.forEach(task => {
        const li = document.createElement("li");

        li.innerHTML = `<span class="${task.isCompleted ? "completed" : ""}">${task.text}</span>
        <button class="done-btn">O</button>
        <button class="delete-btn">X</button>
        `;

        const doneBtn = li.querySelector(".done-btn");
        const deleteBtn = li.querySelector(".delete-btn");

        doneBtn.addEventListener("click", () => {
            toggleTask(task.id);
        })

        deleteBtn.addEventListener("click", () => {
            deleteTask(task.id);
        })

        unorderedListEl.appendChild(li);
    })
}

function toggleTask(id){
    const task = tasksArray.find(t => t.id === id);
    if(task){
        task.isCompleted = !task.isCompleted;
    }
    renderTasks();
}

function deleteTask(id){
    tasksArray = tasksArray.filter(task => task.id !== id);
    renderTasks();
}

function saveToLocalStorage(){
    localStorage.setItem("myTasks", JSON.stringify(tasksArray));
}

function loadFromLocalStorage(){
    tasksArray = JSON.parse(localStorage.getItem("myTasks")) || [];
}