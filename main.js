//Reference to handle HTML Elements
const addTaskBtnEl = document.getElementById("add-task-btn");
const newTaskInputEl = document.getElementById("new-task-input");
const unorderedListEl = document.getElementById("tasks-list");

//Events
addTaskBtnEl.addEventListener("click", addNewTask);

//Functions
function addNewTask(){
    if(newTaskInputEl.value.trim() !== ""){
    const newTaskItem = document.createElement("li");
    newTaskItem.textContent = newTaskInputEl.value;
    unorderedListEl.appendChild(newTaskItem);
    newTaskInputEl.value = "";
    }else{
        alert("Type the task in input field!");
    }
}