import { checkWinner } from "./utils.mjs";

const board = document.getElementById("board");
const status = document.getElementById("status");
const score = document.getElementById("score");
const startButton = document.getElementById("startButton");
const playerXInput = document.getElementById("playerX");
const playerOInput = document.getElementById("playerO");
const startingPlayerSelect = document.getElementById("startingPlayer");

let currentPlayer = "X";
let gameBoard = ["", "", "", "", "", "", "", "", ""];
let playerX = "";
let playerO = "";
let gameActive = false;
let movesCounter = 0;
let scoreX = 0;
let scoreO = 0;
let scoreDraw = 0;

function updateStartingPlayerOptions() {
    startingPlayerSelect.innerHTML = `
	  <option value="X">${playerX}</option>
	  <option value="O">${playerO}</option>
	`;
}

function handlePlayerInputChange() {
    playerX = playerXInput.value || "Игрок X";
    playerO = playerOInput.value || "Игрок O";
    updateStartingPlayerOptions(); // Обновляем опции списка
}

/**
 * Функция для создания игровой доски.
 * @param {string[]} gameBoard - Массив с состоянием клеток доски.
 * @param {function} handleCellClick - Функция обработки клика по клетке.
 */

function renderBoard() {
    board.innerHTML = "";
    gameBoard.forEach((cell, index) => {
        const cellElement = document.createElement("div");
        cellElement.classList.add("cell");
        cellElement.textContent = cell;
        cellElement.addEventListener("click", () => handleCellClick(index));
        board.appendChild(cellElement);
    });
}
/**
 * Обрабатывает клик по клетке доски.
 * @param {number} index - Индекс клетки в массиве доски.
 */
function handleCellClick(index) {
    if (!gameActive || gameBoard[index] !== "") return;

    gameBoard[index] = currentPlayer;
    movesCounter++;

    renderBoard();

    const winner = checkWinner(gameBoard);

    if (winner) {
        endGame(winner);
    } else if (movesCounter === 9) {
        endGame("draw");
    } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        currentPlayer === "X"
            ? (status.textContent = `Ходит игрок ${playerX} - ${currentPlayer}`)
            : (status.textContent = `Ходит игрок ${playerO} - ${currentPlayer}`);
    }
}

/**
 * Завершает игру и выводит сообщение о победителе или ничье.
 * @param {string|null} winner - Победитель: 'X', 'O' или null в случае ничьей.
 */
function endGame(winner) {
    gameActive = false;
    if (winner === "draw") {
        status.textContent = "Ничья!";
        scoreDraw++;
    } else {
        winner === "X"
            ? (status.textContent = `Победил игрок ${playerX}`)
            : (status.textContent = `Победил игрок ${playerO}`);
        winner === "X" ? scoreX++ : scoreO++;
    }
    score.textContent = `Счет: ${playerX} (${scoreX}) - ${playerO} (${scoreO}) - Ничьи (${scoreDraw})`;
}

/**
 * Начинает новую игру и инициализирует игровую доску.
 */
function startGame() {
    playerX = playerXInput.value || "Игрок X";
    playerO = playerOInput.value || "Игрок O";
    currentPlayer = startingPlayerSelect.value;

    playerXInput.disabled = true;
    playerOInput.disabled = true;
    startingPlayerSelect.disabled = true;

    gameBoard = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    movesCounter = 0;
    currentPlayer === "X"
        ? (status.textContent = `Ходит игрок ${playerX} - ${currentPlayer}`)
        : (status.textContent = `Ходит игрок ${playerO} - ${currentPlayer}`);
    renderBoard();
}

playerXInput.addEventListener("input", handlePlayerInputChange);
playerOInput.addEventListener("input", handlePlayerInputChange);
startButton.addEventListener("click", startGame);
