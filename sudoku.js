function createFullBoard() {
    const board = Array.from({ length: 9 }, () => Array(9).fill(null));
    fillBoard(board);
    return board;
}

function fillBoard(board) {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === null) {
                shuffleArray(numbers); 
                for (let num of numbers) {
                    if (isSafe(board, row, col, num)) {
                        board[row][col] = num;
                        if (fillBoard(board)) {
                            return true;
                        }
                        board[row][col] = null;
                    }
                }
                return false; 
            }
        }
    }
    return true;
}
function isSafe(board, row, col, num) {
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === num || board[i][col] === num) return false;

        const boxRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);
        const boxCol = 3 * Math.floor(col / 3) + i % 3;
        if (board[boxRow][boxCol] === num) return false;
    }
    return true;
}
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
function generateSudokuBoard(emptyCells = 40) {
    const board = createFullBoard();
    solutionBoard = board.map(row => [...row]); 

    for (let i = 0; i < emptyCells; i++) {
        let row, col;
        do {
            row = Math.floor(Math.random() * 9);
            col = Math.floor(Math.random() * 9);
        } while (board[row][col] === null);

        board[row][col] = null;
    }

    return board;
}

function renderBoard(board) {
    const boardContainer = document.getElementById("sudoku-board");
    boardContainer.innerHTML = "";

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement("input");
            cell.type = "number";
            cell.min = 1;
            cell.max = 9;
            cell.classList.add("cell");

            if (board[i][j] !== null) {
                cell.value = board[i][j];
                cell.setAttribute("data-predefined", "true");
                cell.readOnly = true;
            } else {
                cell.value = "";
                cell.addEventListener("input", (e) => validateCell(e.target, i,j));
            }

            cell.dataset.row = i;
            cell.dataset.col = j;
            boardContainer.appendChild(cell);
        }
    }
}

// Função para verificar a solução do tabuleiro
function checkSolution() {
    const cells = document.querySelectorAll("#sudoku-board .cell");
    let isCorrect = true;

    cells.forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const value = parseInt(cell.value);

        if (cell.getAttribute("data-predefined") !== "true") {
            if (value === solutionBoard[row][col]) {
                cell.style.backgroundColor = "#ccffcc"; // Verde para valor correto
            } else {
                cell.style.backgroundColor = "#ffcccc"; // Vermelho para valor incorreto
                isCorrect = false; // Marca como incorreto
            }
        }
    });

    // Exibe mensagem com base no resultado
    if (isCorrect) {
        alert("Parabéns! Você completou o Sudoku corretamente!");
        resetBoard();
    } else {
        alert("Existem erros no tabuleiro sua anta. Verifique as células em vermelho.");
    }
}

// Função para alterar o nível do jogo
function changeLevel(level) {
    initialBoard = generateSudokuBoard(level);
    renderBoard(initialBoard);
}

// Função para resetar o tabuleiro com nova randomização
function resetBoard() {
    initialBoard = generateSudokuBoard(81);
    renderBoard(initialBoard);
}

// Gera e exibe um tabuleiro inicial randomizado
let solutionBoard = createFullBoard(); // Tabuleiro com solução completa
let initialBoard = generateSudokuBoard(0); // Tabuleiro com células vazias
renderBoard(initialBoard);
