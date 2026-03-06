//Reference to handle HTML Elements
const addTaskBtnEl = document.getElementById("add-task-btn");
const newTaskInputEl = document.getElementById("new-task-input");
const unorderedListEl = document.getElementById("tasks-list");

//Events
addTaskBtnEl.addEventListener("click", addNewTask);

//Functions
function addNewTask(){
    if(newTaskInputEl.value.trim() !== ""){
    const newTaskLi = document.createElement("li");
    newTaskLi.innerHTML = newTaskInputEl.value + ' <button class="done-btn">O</button> <button class="delete-btn">X</button>';
    const deleteBtn = newTaskLi.querySelector(".delete-btn");
    const doneBtn = newTaskLi.querySelector(".done-btn");
    deleteBtn.addEventListener("click", () =>{
        newTaskLi.remove();
    });
    doneBtn.addEventListener("click", () =>{
        newTaskLi.classList.toggle("completed");
    });
    unorderedListEl.prepend(newTaskLi);
    newTaskInputEl.value = "";
    }else{
        alert("Type the task in input field!");
    }
}