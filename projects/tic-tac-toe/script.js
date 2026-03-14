// ============================================================
//  Tic Tac Toe — script.js
//  Features: 3x3 board, score tracking (persisted),
//            win/draw detection, keyboard navigation,
//            accessible ARIA labels on every cell
// ============================================================

// ── DOM references ───────────────────────────────────────────
const boardEl      = document.getElementById("board");
const statusEl     = document.getElementById("status");
const restartBtn   = document.getElementById("restart");
const resetScrsBtn = document.getElementById("reset-scores");
const scoreXEl     = document.getElementById("score-x-val");
const scoreOEl     = document.getElementById("score-o-val");
const scoreDrawsEl = document.getElementById("score-draws");
const scoreXBlock  = document.getElementById("score-x");
const scoreOBlock  = document.getElementById("score-o");

// ── Game state ───────────────────────────────────────────────
let board        = Array(9).fill(null);
let currentPlayer= "X";
let gameActive   = true;
let focusedIndex = 0;   // currently keyboard-focused cell index

// ── Scores — load from localStorage so they persist ─────────
let scores = loadScores();

const WIN_COMBOS = [
  [0,1,2],[3,4,5],[6,7,8],   // rows
  [0,3,6],[1,4,7],[2,5,8],   // cols
  [0,4,8],[2,4,6]            // diagonals
];

// ── Cell position labels for ARIA ────────────────────────────
const CELL_LABELS = [
  "Row 1, Column 1",
  "Row 1, Column 2",
  "Row 1, Column 3",
  "Row 2, Column 1",
  "Row 2, Column 2",
  "Row 2, Column 3",
  "Row 3, Column 1",
  "Row 3, Column 2",
  "Row 3, Column 3",
];

// ── Build the 3×3 board ──────────────────────────────────────
function buildBoard() {
  boardEl.innerHTML = "";

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;

    // Accessibility: role, tabindex, descriptive label
    cell.setAttribute("role", "gridcell");
    cell.setAttribute("tabindex", i === 0 ? "0" : "-1");
    cell.setAttribute("aria-label", `${CELL_LABELS[i]}, empty`);

    // Mouse click
    cell.addEventListener("click", () => handleMove(i));

    // Keyboard: Enter / Space to place, arrow keys to navigate
    cell.addEventListener("keydown", handleKeyboard);

    boardEl.appendChild(cell);
  }
}

// ── Handle keyboard navigation on the board ─────────────────
function handleKeyboard(e) {
  const index = parseInt(e.currentTarget.dataset.index);

  const moves = {
    ArrowRight: index + 1,
    ArrowLeft:  index - 1,
    ArrowDown:  index + 3,
    ArrowUp:    index - 3,
  };

  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    handleMove(index);
    return;
  }

  if (moves[e.key] !== undefined) {
    e.preventDefault();
    const next = moves[e.key];
    // Stay within 0–8 and same row for left/right
    if (e.key === "ArrowRight" && index % 3 === 2) return;
    if (e.key === "ArrowLeft"  && index % 3 === 0) return;
    if (next < 0 || next > 8) return;
    moveFocus(next);
  }
}

// ── Move keyboard focus to a cell ────────────────────────────
function moveFocus(index) {
  const cells = getCells();
  cells[focusedIndex].setAttribute("tabindex", "-1");
  cells[index].setAttribute("tabindex", "0");
  cells[index].focus();
  focusedIndex = index;
}

// ── Process a move at index ──────────────────────────────────
function handleMove(index) {
  if (!gameActive || board[index]) return;

  const cells = getCells();
  const cell  = cells[index];

  // Update data
  board[index] = currentPlayer;

  // Update UI
  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer.toLowerCase(), "taken", "placed");
  cell.setAttribute("aria-label",
    `${CELL_LABELS[index]}, ${currentPlayer}`
  );

  // Remove placed animation class after it finishes
  cell.addEventListener("animationend", () => {
    cell.classList.remove("placed");
  }, { once: true });

  // Check win
  const winCombo = checkWin();
  if (winCombo) {
    scores[currentPlayer]++;
    saveScores();
    updateScoreboard();
    // Update status without innerHTML to avoid XSS
    setStatus(`Player ${currentPlayer} wins! 🎉`, "win");
    highlightWin(winCombo);
    gameActive = false;
    return;
  }

  // Check draw
  if (!board.includes(null)) {
    scores.draws++;
    saveScores();
    updateScoreboard();
    setStatus("It's a draw!", "draw");
    gameActive = false;
    return;
  }

  // Switch player
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  setStatus(`Turn: ${currentPlayer}`);
  highlightActivePlayer();
}

// ── Set status text (plain text, no innerHTML) ───────────────
// Fix: use textContent instead of innerHTML — prevents any
// potential XSS if player names were ever dynamic.
// We use a <strong> wrapper only for the "turn" display.
function setStatus(msg, cls = "") {
  statusEl.textContent = msg;
  statusEl.className   = "status-text " + cls.trim();
}

// ── Check all win combinations ───────────────────────────────
function checkWin() {
  for (const [a, b, c] of WIN_COMBOS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return [a, b, c];
    }
  }
  return null;
}

// ── Highlight winning cells ──────────────────────────────────
function highlightWin(combo) {
  const cells = getCells();
  combo.forEach(i => {
    cells[i].classList.add("win-cell");
    // Fix: aria-label update to announce win
    cells[i].setAttribute("aria-label",
      `${CELL_LABELS[i]}, ${currentPlayer}, winning cell`
    );
  });
}

// ── Highlight active player in scoreboard ────────────────────
function highlightActivePlayer() {
  scoreXBlock.classList.toggle("active", currentPlayer === "X");
  scoreOBlock.classList.toggle("active", currentPlayer === "O");
}

// ── Update score display ─────────────────────────────────────
function updateScoreboard() {
  scoreXEl.textContent     = scores.X;
  scoreOEl.textContent     = scores.O;
  scoreDrawsEl.textContent = scores.draws;
}

// ── Start a new round (keep scores) ─────────────────────────
function resetGame() {
  board         = Array(9).fill(null);
  currentPlayer = "X";
  gameActive    = true;
  focusedIndex  = 0;

  setStatus("Turn: X");
  highlightActivePlayer();

  // Reset all cells
  getCells().forEach((cell, i) => {
    cell.textContent = "";
    cell.className   = "cell";                    // wipes all state classes
    cell.setAttribute("tabindex", i === 0 ? "0" : "-1");
    cell.setAttribute("aria-label", `${CELL_LABELS[i]}, empty`);
  });

  // Return focus to first cell
  getCells()[0].focus();
}

// ── Reset scores and start fresh ────────────────────────────
function resetAll() {
  scores = { X: 0, O: 0, draws: 0 };
  saveScores();
  updateScoreboard();
  resetGame();
}

// ── localStorage helpers ────────────────────────────────────
function saveScores() {
  localStorage.setItem("ttt-scores", JSON.stringify(scores));
}

function loadScores() {
  try {
    const saved = JSON.parse(localStorage.getItem("ttt-scores"));
    if (saved && typeof saved.X === "number") return saved;
  } catch (_) {}
  return { X: 0, O: 0, draws: 0 };
}

// ── Utility: get all cell elements ──────────────────────────
function getCells() {
  return Array.from(boardEl.querySelectorAll(".cell"));
}

// ── Initialise ───────────────────────────────────────────────
buildBoard();
updateScoreboard();
highlightActivePlayer();
setStatus("Turn: X");

// Wire up buttons
restartBtn.addEventListener("click",   resetGame);
resetScrsBtn.addEventListener("click", resetAll);