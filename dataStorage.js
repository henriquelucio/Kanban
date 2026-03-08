export class DataStorage{
    static saveToLocalStorage(tasks){
        localStorage.setItem("myTasks", JSON.stringify(tasks));
    }

    static loadFromLocalStorage(){
        return JSON.parse(localStorage.getItem("myTasks")) || [];
    }
}