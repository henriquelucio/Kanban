export class DataStorage{
    static saveToLocalStorage(state){
        localStorage.setItem("kanbanState", JSON.stringify(state));
    }

    static loadFromLocalStorage(){
        const saved = localStorage.getItem("kanbanState");
        if (saved){
            return JSON.parse(saved);
        } else {
            return {
                currentRoomId: null,
                rooms: []
            };
        }
    }
}