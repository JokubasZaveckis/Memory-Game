const numbers = ["1", "1", "2", "2", "3", "3", "4", "4", "5", "5", "6", "6", "7", "7", "8", "8"];
let shuf_numbers = numbers.sort(() => Math.random() - 0.5);
const gameBoard = document.querySelector('.game');
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let timerStarted = false;
let score = 0;
let highScore = 0;
let timerInterval;
let playerName = '';

document.addEventListener('DOMContentLoaded', () => {
    playerName = sessionStorage.getItem('playerName');
    highScore = sessionStorage.getItem('highScore') || 0;

    document.getElementById('highScore').textContent = highScore; // Display the high score when the page loads
    if (playerName) {
        document.getElementById('displayName').textContent = playerName;
        document.getElementById('nameInputOverlay').style.display = 'none';
        enableGame();
    } else {
        document.getElementById('nameInputOverlay').style.display = 'flex';
    }
});

function startGame() {
    playerName = document.getElementById('playerName').value.trim();
    if (!playerName) {
        alert('Prašome įvesti savo vardą.');
        return;
    }
    sessionStorage.setItem('playerName', playerName);
    document.getElementById('displayName').textContent = playerName;
    document.getElementById('nameInputOverlay').style.display = 'none';
    enableGame();
}

function enableGame() {
    initializeGame();
    let cards = document.querySelectorAll('.item');
    cards.forEach(card => {
        card.classList.remove('disabled');
        card.addEventListener('click', flipCard);
    });
}

function initializeGame() {
    gameBoard.innerHTML = '';
    shuf_numbers = [...numbers].sort(() => Math.random() - 0.5); // Reshuffle the numbers
    for (let i = 0; i < shuf_numbers.length; i++) {
        let box = document.createElement('div');
        box.className = 'item';
        box.innerHTML = shuf_numbers[i];
        gameBoard.appendChild(box);
    }
}

function flipCard() {
    // Check if the player's name has been entered
    if (!playerName) {
        alert('Prašome įvesti vardą prieš žaidžiant.');
        return;
    }

    // Start the timer when the first card is flipped
    if (!timerStarted) {
        startTimer();
        timerStarted = true;
    }

    // Check if the board is locked or if the clicked card is the same as the first card
    if (lockBoard || this === firstCard) return;

    this.classList.add('boxOpen');

    if (!hasFlippedCard) {
        // First card is flipped
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    // Second card is flipped
    secondCard = this;
    lockBoard = true; // Lock the board as two cards are flipped
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.innerHTML === secondCard.innerHTML;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    setTimeout(() => {
        firstCard.style.visibility = 'hidden';
        secondCard.style.visibility = 'hidden';
        resetBoard();
        checkGameOver();
    }, 500);
}

function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('boxOpen');
        secondCard.classList.remove('boxOpen');
        resetBoard();
    }, 500);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function checkGameOver() {
    const allCardsHidden = Array.from(document.querySelectorAll('.item')).every(card => card.style.visibility === 'hidden');
    if (allCardsHidden) {
        clearInterval(timerInterval);
        score += timeLeft;
        updateHighScore(score);
        showGameOverMessage();
    }
}

function showGameOverMessage() {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    const gameOverMessage = document.createElement('div');
    gameOverMessage.className = 'gameOverMessage';
    gameOverMessage.innerHTML = `<h2>Sveikiname perėjus lygį!</h2><p>Rezultatas: ${score}</p><button class="startAgain" onclick="window.location.reload();">Žaisti dar kartą</button>`;
    overlay.appendChild(gameOverMessage);
    document.body.appendChild(overlay);
}

let timeLeft = 30;

function startTimer() {
    timerInterval = setInterval(function() {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            gameOver();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const timerDisplay = document.getElementById('timer');
    timerDisplay.textContent = `Liko laiko: ${timeLeft}s`;
}

function gameOver() {
    alert("Laikas baigėsi, bandykite iš naujo.");
    window.location.reload();
}

function updateHighScore(newScore) {
    if (newScore > highScore) {
        highScore = newScore;
        sessionStorage.setItem('highScore', highScore);
        document.getElementById('highScore').textContent = highScore;
    }
}
