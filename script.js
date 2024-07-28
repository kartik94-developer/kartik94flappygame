const bird = document.getElementById('bird');
const gameContainer = document.getElementById('game-container');
const scoreDisplay = document.getElementById('score');
const finalScoreValue = document.getElementById('final-score-value');
const gameOverScreen = document.getElementById('game-over');
const restartButton = document.getElementById('restart-button');
const flyButton = document.getElementById('fly-button');

let birdTop = gameContainer.clientHeight / 2 - bird.clientHeight / 2;
let gravity = 0.4;
let velocity = 0;
let score = 0;
let pipes = [];
let gameOver = false;
let gameInterval;
let pipeInterval;

function startGame() {
    birdTop = gameContainer.clientHeight / 2 - bird.clientHeight / 2; // Place the bird in the middle
    bird.style.top = birdTop + 'px'; // Reset bird's position
    velocity = 0; // Reset bird's velocity
    document.addEventListener('keydown', fly);
    flyButton.addEventListener('click', fly);
    flyButton.addEventListener('touchstart', fly);
    gameInterval = setInterval(gameLoop, 20);
    pipeInterval = setInterval(createPipe, 3000);
}

function fly() {
    if (!gameOver) {
        velocity = -8;
    }
}

function gameLoop() {
    if (gameOver) return;
    velocity += gravity;
    birdTop += velocity;
    bird.style.top = birdTop + 'px';

    pipes.forEach(pipe => {
        pipe.left -= 2;
        pipe.element.style.left = pipe.left + 'px';

        if (pipe.left + pipe.width < 0) {
            pipe.element.remove();
            pipes.shift();
            score++;
            scoreDisplay.textContent = score;
        }

        if (checkCollision(bird, pipe.element)) {
            endGame();
        }
    });

    if (birdTop + bird.clientHeight > gameContainer.clientHeight || birdTop < 0) {
        endGame();
    }
}

function createPipe() {
    const pipeHeight = Math.floor(Math.random() * 200) + 50;
    const gap = 120;

    const pipeTop = document.createElement('div');
    pipeTop.classList.add('pipe', 'top');
    pipeTop.style.height = pipeHeight + 'px';
    pipeTop.style.left = gameContainer.clientWidth + 'px';

    const pipeBottom = document.createElement('div');
    pipeBottom.classList.add('pipe');
    pipeBottom.style.height = gameContainer.clientHeight - pipeHeight - gap + 'px';
    pipeBottom.style.left = gameContainer.clientWidth + 'px';

    gameContainer.appendChild(pipeTop);
    gameContainer.appendChild(pipeBottom);

    pipes.push({
        element: pipeTop,
        left: gameContainer.clientWidth,
        width: 60,
        top: 0,
        bottom: pipeHeight
    });

    pipes.push({
        element: pipeBottom,
        left: gameContainer.clientWidth,
        width: 60,
        top: pipeHeight + gap,
        bottom: gameContainer.clientHeight
    });
}

function checkCollision(bird, pipe) {
    const birdRect = bird.getBoundingClientRect();
    const pipeRect = pipe.getBoundingClientRect();

    return !(
        birdRect.top > pipeRect.bottom ||
        birdRect.bottom < pipeRect.top ||
        birdRect.right < pipeRect.left ||
        birdRect.left > pipeRect.right
    );
}

function endGame() {
    gameOver = true;
    finalScoreValue.textContent = score;
    gameOverScreen.classList.remove('hidden');
    clearInterval(gameInterval);
    clearInterval(pipeInterval);
    flyButton.removeEventListener('click', fly);
    flyButton.removeEventListener('touchstart', fly);
}

function resetGame() {
    gameOver = false;
    birdTop = gameContainer.clientHeight / 2 - bird.clientHeight / 2;
    bird.style.top = birdTop + 'px';
    velocity = 0; // Reset bird's velocity
    pipes.forEach(pipe => pipe.element.remove());
    pipes = [];
    score = 0;
    scoreDisplay.textContent = score;
    gameOverScreen.classList.add('hidden');
    startGame();
}

restartButton.addEventListener('click', resetGame);

// Start the game immediately
startGame();
