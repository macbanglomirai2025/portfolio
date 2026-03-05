
function addTask(){

let task = document.getElementById("task").value

let li = document.createElement("li")

li.textContent = task

document.getElementById("list").appendChild(li)

}
