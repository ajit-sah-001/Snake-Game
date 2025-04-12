// Game constants and variables
let inputDir = { x: 0, y: 0 };
let speed = 5;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };
let gameStarted = false;

// Sounds (optional - add your own sound files)
const foodSound = new Audio('food.wav');
const gameOverSound = new Audio('gameover.mp3');
const moveSound = new Audio('move.mp3');
const musicSound = new Audio('Gamesuound.mp3');

// Main game loop
function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) return;
    lastPaintTime = ctime;
    gameEngine();
}

// Collision detection
function isCollide(snake) {
    // Self-collision
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    // Wall collision
    return (
        snake[0].x >= 18 || snake[0].x <= 0 ||
        snake[0].y >= 18 || snake[0].y <= 0
    );
}

// Main game engine
function gameEngine() {
    if (isCollide(snakeArr)) {
        gameOverSound.play();
        musicSound.pause();
        alert("Game Over! Press Start Game to try again.");
        snakeArr = [{ x: 13, y: 15 }];
        inputDir = { x: 0, y: 0 };
        score = 0;
        gameStarted = false;
        document.getElementById("startBtn").style.display = "inline-block";
        return;
    }

    // When food is eaten
    if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
        foodSound.play();
        score += 1;
        snakeArr.unshift({
            x: snakeArr[0].x + inputDir.x,
            y: snakeArr[0].y + inputDir.y
        });

        // Generate new food
        const a = 2, b = 16;
        food = {
            x: Math.floor(a + Math.random() * (b - a)),
            y: Math.floor(a + Math.random() * (b - a))
        };
    }

    // Move the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Draw snake and food
    const board = document.getElementById("board");
    board.innerHTML = "";

    // Draw snake
    snakeArr.forEach((e, index) => {
        const element = document.createElement("div");
        element.style.gridRowStart = e.y;
        element.style.gridColumnStart = e.x;
        element.classList.add(index === 0 ? "head" : "snake");
        board.appendChild(element);
    });

    // Draw food
    const foodElement = document.createElement("div");
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add("food");
    board.appendChild(foodElement);
}

// Start game button
document.getElementById("startBtn").addEventListener("click", () => {
    if (!gameStarted) {
        inputDir = { x: 0, y: 1 }; // Initial movement
        gameStarted = true;
        musicSound.play();
        document.getElementById("startBtn").style.display = "none";
        window.requestAnimationFrame(main);
    }
});

// Keyboard input
window.addEventListener("keydown", e => {
    if (!gameStarted) return;

    moveSound.play();
    switch (e.key) {
        case "ArrowUp":
            if (inputDir.y !== 1) inputDir = { x: 0, y: -1 };
            break;
        case "ArrowDown":
            if (inputDir.y !== -1) inputDir = { x: 0, y: 1 };
            break;
        case "ArrowLeft":
            if (inputDir.x !== 1) inputDir = { x: -1, y: 0 };
            break;
        case "ArrowRight":
            if (inputDir.x !== -1) inputDir = { x: 1, y: 0 };
            break;
    }
});
