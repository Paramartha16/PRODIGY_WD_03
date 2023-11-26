let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let isAgainstAI = false;

const cells = document.querySelectorAll('.cell');
const messageElement = document.getElementById('message');

cells.forEach(cell => cell.addEventListener('click', handleCellClick));

function handleCellClick(event) {
    const index = event.target.dataset.index;

    if (gameBoard[index] === '' && gameActive) {
        makeMove(index);
        checkGameStatus();
        if (isAgainstAI && gameActive) {
            makeAIMove();
            checkGameStatus();
        }
    }
}

function makeMove(index) {
    gameBoard[index] = currentPlayer;
    cells[index].textContent = currentPlayer;
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    highlightCurrentPlayer();
}

function makeAIMove() {
    const bestMove = getBestMove();
    makeMove(bestMove);
}

function getBestMove() {
    let bestScore = -Infinity;
    let bestMove;

    for (let i = 0; i < gameBoard.length; i++) {
        if (gameBoard[i] === '') {
            gameBoard[i] = 'O';
            const score = minimax(gameBoard, 0, false);
            gameBoard[i] = '';
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    return bestMove;
}

function minimax(board, depth, isMaximizing) {
    const scores = {
        X: -1,
        O: 1,
        tie: 0
    };

    const winner = checkWinner();
    if (winner) {
        return scores[winner];
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                const score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                const score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkGameStatus() {
    const winner = checkWinner();
    if (winner) {
        messageElement.textContent = `${winner} wins!`;
        gameActive = false;
    } else if (!gameBoard.includes('')) {
        messageElement.textContent = 'It\'s a draw!';
        gameActive = false;
    } else {
        highlightCurrentPlayer();
    }
}

function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (gameBoard[a] !== '' && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            highlightWinningCells(pattern);
            return gameBoard[a];
        }
    }

    return null;
}

function highlightCurrentPlayer() {
    messageElement.textContent = `Player ${currentPlayer}'s turn`;
}

function highlightWinningCells(cellsToHighlight) {
    cellsToHighlight.forEach(index => cells[index].classList.add('win'));
}

document.getElementById('replayBtn').addEventListener('click', resetGame);

function resetGame() {
    gameBoard.fill('');
    currentPlayer = 'X';
    gameActive = true;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('win');
    });
    highlightCurrentPlayer();
}

document.getElementById('playAgainstAI').addEventListener('click', () => {
    isAgainstAI = true;
    resetGame();
});

document.getElementById('playAgainstPlayer').addEventListener('click', () => {
    isAgainstAI = false;
    resetGame();
});
