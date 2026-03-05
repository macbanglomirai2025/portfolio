const boardElement   = document.getElementById("board");
const statusElement  = document.getElementById("status");
const restartButton  = document.getElementById("restart");
const resetScoresBtn = document.getElementById("reset-scores");

const scoreXEl     = document.getElementById("score-x-val");
const scoreOEl     = document.getElementById("score-o-val");
const scoreDrawsEl = document.getElementById("score-draws");
const scoreXBlock  = document.getElementById("score-x");
const scoreOBlock  = document.getElementById("score-o");

let currentPlayer = "X";
let gameBoard     = Array(9).fill(null);
let gameActive    = true;
let scores        = { X: 0, O: 0, draws: 0 };

const winningCombos = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function setStatus(msg, cls = "") {
  statusElement.innerHTML = msg;
  statusElement.className = "status-text " + cls;
}

function highlightActivePlayer() {
  scoreXBlock.classList.toggle("active", currentPlayer === "X");
  scoreOBlock.classList.toggle("active", currentPlayer === "O");
}

function handleClick(event) {
  const cell  = event.currentTarget;
  const index = parseInt(cell.dataset.index);

  if (!gameActive || gameBoard[index]) return;

  gameBoard[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer.toLowerCase(), "taken", "placed");

  const combo = checkWin();
  if (combo) {
    scores[currentPlayer]++;
    updateScoreboard();
    setStatus(`${currentPlayer} wins! 🎉`, "win");
    highlightWinningCells(combo);
    gameActive = false;
    return;
  }

  if (!gameBoard.includes(null)) {
    scores.draws++;
    updateScoreboard();
    setStatus("It's a draw!", "draw");
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  setStatus(`Turn: <strong>${currentPlayer}</strong>`);
  highlightActivePlayer();
}

function checkWin() {
  for (const [a,b,c] of winningCombos) {
    if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
      return [a,b,c];
    }
  }
  return null;
}

function highlightWinningCells(combo) {
  combo.forEach(i => {
    const cell = boardElement.children[i];
    cell.classList.add("win-cell");
    if (currentPlayer === "O") cell.classList.add("o");
  });
}

function updateScoreboard() {
  scoreXEl.textContent     = scores.X;
  scoreOEl.textContent     = scores.O;
  scoreDrawsEl.textContent = scores.draws;
}

function resetGame() {
  gameBoard     = Array(9).fill(null);
  currentPlayer = "X";
  gameActive    = true;
  setStatus(`Turn: <strong>X</strong>`);

  Array.from(boardElement.children).forEach(cell => {
    cell.textContent = "";
    cell.className   = "cell";
  });

  highlightActivePlayer();
}

function resetAll() {
  scores = { X: 0, O: 0, draws: 0 };
  updateScoreboard();
  resetGame();
}

// Build board
for (let i = 0; i < 9; i++) {
  const cell = document.createElement("div");
  cell.classList.add("cell");
  cell.dataset.index = i;
  cell.setAttribute("role", "gridcell");
  cell.addEventListener("click", handleClick);
  boardElement.appendChild(cell);
}

restartButton.addEventListener("click", resetGame);
resetScoresBtn.addEventListener("click", resetAll);

// Init
highlightActivePlayer();
setStatus(`Turn: <strong>X</strong>`);