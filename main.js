//Import
import { DataStorage } from "./dataStorage.js";

//Vars
let appState = DataStorage.loadFromLocalStorage();

if(appState.rooms.length === 0){
    appState.rooms.push({
        id: "room-1",
        columns: []
    });
    appState.currentRoomId = "room-1";
}

//Reference to handle HTML Elements
const newColumnBtnEl = document.getElementById("add-new-board");
const newColumnTitleEl = document.getElementById("new-column-title");
const boardEl = document.querySelector(".kanban-board");

//Events
newColumnBtnEl.addEventListener("click", () => {
    const title = newColumnTitleEl.value;
    addColumn(title);
    newColumnTitleEl.value = "";
});

//Event Delegation
boardEl.addEventListener("click", (event) => {
        
        //Add new task
        if(event.target.classList.contains("new-task-btn")){
            const parentColumn = event.target.closest(".kanban-column");
            const columnId = parentColumn.getAttribute("data-id");
            const inputEl = parentColumn.querySelector(".new-task-input");
            const taskText = inputEl.value.trim();

            if(taskText !== ""){
                inputEl.value = "";
            } else {
                alert("Empty task!");
            }
        }

        //Complete Task
        if(event.target.classList.contains("done-btn")){
            const parentColumn = event.target.closest(".kanban-column");
            const columnId = parentColumn.getAttribute("data-id");
            const taskId = parseInt(event.target.getAttribute("data-task-id"));
            toggleTask(columnId, taskId);
        }

        //Delete Task
        if(event.target.classList.contains("delete-btn")){
            const parentColumn = event.target.closest(".kanban-column");
            const columnId = parentColumn.getAttribute("data-id");
            const taskId = parseInt(event.target.getAttribute("data-task-id"));
            deleteTask(columnId, taskId);
        }
    });

//Main
renderTasks();

//Functions
function addColumn(title){
    const newColumn = {
        id: Date.now().toString(),
        title: title,
        tasks: []
    }

    appState.rooms[0].columns.push(newColumn);

    syncState();
} 

function addNewTask(columnId, text){
    const newTask = {
        id: Date.now(),
        text: text,
        isCompleted: false,
    };

    const column = appState.rooms[0].columns.find(col => col.id === columnId);
    if(column){
        column.tasks.push(newTask);
    }

    syncState();
}

function renderTasks(){
    //Clear the board
    boardEl.innerHTML = "";

    //Creates HTML elements needed for each column
    appState.rooms[0].columns.forEach(column => {
        const columnContainer = document.createElement("div");
        columnContainer.classList.add("kanban-board");
        columnContainer.setAttribute("data-id", column.id);


        columnContainer.innerHTML = `<h2>${column.title}</h2>
        <div class="tasks-container">
            <input type="text" ckass="new-task-input" placeholder="What should be done?">
            <button class="new-task-btn">+</button>
        </div>
        <ul class="tasks-ulist"></ul>
        `;

        const tasksUlistEl = columnContainer.querySelector(".tasks-ulist");

        column.tasks.forEach(task => () => {
            const li = document.createElement("li");
            li.innerHTML = `
                <span class="${task.isCompleted ? "completed" : ""}">${task.text}</span>
                <button class="done-btn" data-task-id="${task.id}">O</button>
                <button class="delete-btn" data-task-id="${task.id}">X</button>
            `;
            tasksUlistEl.appendChild(li);
        })

        boardEl.appendChild(columnContainer);
    })
}

function toggleTask(columnId, taskId){
    const column = appState.rooms[0].columns.find(col => col.id === columnId);
    if(column){
        const task = column.tasks.find(task => task.id === taskId)
        if(task){
            task.isCompleted = !task.isCompleted;
        }
    }
    syncState();
}

function deleteTask(columnId, taskId){
    const column = appState.rooms[0].columns.find(col => col.id === columnId);
    if(column){
        column.tasks = column.tasks.filter(task => task.id !== taskId)
    }
    syncState();
}

function syncState(){
    renderTasks();
    DataStorage.saveToLocalStorage(appState);
}