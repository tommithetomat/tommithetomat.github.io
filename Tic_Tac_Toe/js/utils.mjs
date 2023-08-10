/**
 * Проверяет наличие победителя на игровой доске.
 * @param {string[]} board - Массив с состоянием клеток доски.
 * @returns {string|null} - 'X' если выиграли крестики, 'O' если выиграли нолики, null если нет победителя.
 */
export function checkWinner(board) {
    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8], // горизонтали
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8], // вертикали
        [0, 4, 8],
        [2, 4, 6], // диагонали
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }

    return null;
}
