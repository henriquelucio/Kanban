//Import
import { DataStorage } from "./dataStorage.js";

//Vars
let appState = DataStorage.loadFromLocalStorage();
window.appState = appState;

if(appState.rooms.length === 0){
    appState.rooms.push({
        id: "room-1",
        columns: []
    });
    appState.currentRoomId = "room-1";
}

//Temp vars for drag and drop
let draggedTaskId = null;
let sourceColumnId = null;

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

//Event Drag and Drop
//Start drag
boardEl.addEventListener("dragstart", (event) => {
    const taskItem = event.target.closest(".task-item");
    if(taskItem){  //Allow only task-itens class to be draggable
        draggedTaskId = taskItem.getAttribute("data-task-id");  //Gets task id
        const columnEl = taskItem.closest(".kanban-column");    //Gets column and set on reference
        sourceColumnId = columnEl.getAttribute("data-id") //Gets column id
        taskItem.classList.add("dragging") //Sets class for visual style
        console.log("Dragstart working");
    }
});

//Clear style class from dragged task
boardEl.addEventListener("dragend", (event) => {
    if(event.target.classList.contains("task-itens")){
        event.target.classList.remove("dragging");
        console.log("Dragend working");
    }
});

//Allows drop to happen - browser blocks it by default
boardEl.addEventListener("dragover", (event) => {
    event.preventDefault();
    console.log("Dragover working");
});

//Executes after dropping the task
boardEl.addEventListener("drop", (event) => {
    event.preventDefault();

    //Gets target column and id from user, if target column difer from current column calls function
    const targetColumnEl = event.target.closest(".kanban-column");
    if(targetColumnEl){
        const targetColumnId = targetColumnEl.getAttribute("data-id");
        if(targetColumnId !== sourceColumnId){
            moveTask(draggedTaskId, sourceColumnId, targetColumnId);
        }
    }
    console.log("Drop working");
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
                addNewTask(columnId, taskText);
            } else {
                alert("Empty task!");
            }
        }

        //Complete Task
        if(event.target.classList.contains("done-btn")){
            const parentColumn = event.target.closest(".kanban-column");
            const columnId = parentColumn.getAttribute("data-id");
            const taskId = event.target.getAttribute("data-task-id");
            toggleTask(columnId, taskId);
        }

        //Delete Task
        if(event.target.classList.contains("delete-btn")){
            const parentColumn = event.target.closest(".kanban-column");
            const columnId = parentColumn.getAttribute("data-id");
            const taskId = event.target.getAttribute("data-task-id");
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
        id: Date.now().toString(),
        text: text,
        isCompleted: false,
    };

    const column = appState.rooms[0].columns.find(col => col.id === columnId);
    if(column){
        column.tasks.push(newTask);
        syncState();
    }
}

function renderTasks(){
    //Clear the board
    boardEl.innerHTML = "";

    //Creates HTML elements needed for each column
    appState.rooms[0].columns.forEach(column => {
        const columnContainer = document.createElement("div");
        columnContainer.classList.add("kanban-column");
        columnContainer.setAttribute("data-id", column.id);


        columnContainer.innerHTML = `
        <h2>${column.title}</h2>
        <div class="tasks-container">
            <input type="text" class="new-task-input" placeholder="What should be done?">
            <button class="new-task-btn">+</button>
        </div>
        <ul class="tasks-ulist"></ul>
        `;

        const tasksUlistEl = columnContainer.querySelector(".tasks-ulist");

        column.tasks.forEach(task => {
            const li = document.createElement("li");    //Create li element
            li.setAttribute("draggable", "true");       //Allow drag and drop
            li.classList.add("task-item");              //Class to identify the task
            li.setAttribute("data-task-id", task.id);   //task id with li element
            //Creates the child HTML element of li
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

function moveTask(taskId, fromColumnId, toColumnId){
    const fromColumn = appState.rooms[0].columns.find(col => col.id === fromColumnId);
    const toColumn = appState.rooms[0].columns.find(col => col.id === toColumnId);

    if(fromColumn && toColumn){
        const taskIndex = fromColumn.tasks.findIndex(t => String(t.id) === String(taskId)); //Search for task at origin column
        const [taskToMove] = fromColumn.tasks.splice(taskIndex, 1); //Remove task from origin column
        toColumn.tasks.push(taskToMove);    //Set task in target column

        syncState();
    }
}

function syncState(){
    renderTasks();
    DataStorage.saveToLocalStorage(appState);
}