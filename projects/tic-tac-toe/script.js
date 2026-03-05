const boardElement = document.getElementById("board");
const statusElement = document.getElementById("status");
const restartButton = document.getElementById("restart");

let currentPlayer = "X";
let gameBoard = Array(9).fill(null);
let gameActive = true;

const winningCombos = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6]             // diagonals
];

function handleClick(event) {
  const cell = event.target;
  const index = cell.dataset.index;

  if (!gameActive || cell.textContent !== "" || gameBoard[index]) return;

  cell.textContent = currentPlayer;
  gameBoard[index] = currentPlayer;

  if (checkWin()) {
    statusElement.textContent = `${currentPlayer} wins! 🎉`;
    gameActive = false;
    highlightWinningCells(checkWin());
    return;
  }

  if (!gameBoard.includes(null)) {
    statusElement.textContent = "It's a draw!";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusElement.textContent = `Turn: ${currentPlayer}`;
}

function checkWin() {
  for (let combo of winningCombos) {
    const [a, b, c] = combo;
    if (
      gameBoard[a] &&
      gameBoard[a] === gameBoard[b] &&
      gameBoard[a] === gameBoard[c]
    ) {
      return combo;
    }
  }
  return null;
}

function highlightWinningCells(combo) {
  if (!combo) return;
  combo.forEach(index => {
    const cell = boardElement.children[index];
    cell.style.backgroundColor = "#38bdf8";
    cell.style.color = "#0f172a";
    cell.style.fontWeight = "bold";
  });
}

function resetGame() {
  gameBoard = Array(9).fill(null);
  currentPlayer = "X";
  gameActive = true;
  statusElement.textContent = `Turn: ${currentPlayer}`;
  Array.from(boardElement.children).forEach(cell => {
    cell.textContent = "";
    cell.style.backgroundColor = "#1e293b";
    cell.style.color = "white";
    cell.style.fontWeight = "normal";
  });
}

// Create board
for (let i = 0; i < 9; i++) {
  const cell = document.createElement("div");
  cell.classList.add("cell");
  cell.dataset.index = i;
  cell.addEventListener("click", handleClick);
  boardElement.appendChild(cell);
}

// Event listeners
restartButton.addEventListener("click", resetGame);

// Initial status
statusElement.textContent = `Turn: ${currentPlayer}`;