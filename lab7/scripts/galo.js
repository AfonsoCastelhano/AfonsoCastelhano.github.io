let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const cells = document.querySelectorAll('.cell');
const messageDisplay = document.getElementById('message');

function restartGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    messageDisplay.textContent = '';
    
    cells.forEach(cell => cell.textContent = '');

    messageDisplay.removeEventListener('mouseover', showHoverMessage);
    messageDisplay.removeEventListener('mouseout', hideHoverMessage);
}

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (board[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    board[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;

    checkResult();
}

function checkResult() {
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] === '' || board[b] === '' || board[c] === '') {
            continue;
        }
        if (board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        messageDisplay.textContent = `Jogador ${currentPlayer} ganhou!`;
        gameActive = false;

        messageDisplay.addEventListener('mouseover', showHoverMessage);
        messageDisplay.addEventListener('mouseout', hideHoverMessage);
        return;
    }

    if (!board.includes('')) {
        messageDisplay.textContent = 'Empate!';
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function showHoverMessage() {
    messageDisplay.textContent = "Será??";
}

function hideHoverMessage() {
    messageDisplay.textContent = "MENTIRINHA!";
}

function mudaCorFundo() {
    const corRandom = '#' + Math.floor(Math.random() * 16777215).toString(16);
    document.body.style.backgroundColor = corRandom;
}

document.getElementById("CorRand").addEventListener('click', mudaCorFundo);

function mudaCorDoInput() {
    const valorInput = document.getElementById("VerdeRed").value.toLowerCase();

    if (valorInput === "cruz") {
        document.body.style.backgroundColor = 'green';
    } else if (valorInput === "circulo") {
        document.body.style.backgroundColor = 'red';
    }
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));

document.getElementById("restartButton").addEventListener('click', restartGame);