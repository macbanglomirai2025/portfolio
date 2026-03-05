const board = document.getElementById("board")

let current = "X"

for(let i=0;i<9;i++){

let cell = document.createElement("div")

cell.classList.add("cell")

cell.onclick = () => {

if(cell.textContent==""){

cell.textContent=current

current = current==="X" ? "O":"X"

}

}

board.appendChild(cell)

}
