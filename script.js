const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const fishSize = 10; // Tamanho do peixe
let fish = [{ x: 150, y: 150 }];
let direction = "RIGHT";
let food = { x: 100, y: 100 };
let score = 0;

function drawFish() {
    fish.forEach((segment, index) => {
        ctx.fillStyle = "#FF4500"; // Cor do peixe (laranja)
        ctx.fillRect(segment.x, segment.y, fishSize, fishSize);
    });
}

function drawFood() {
    ctx.fillStyle = "#FFD700"; // Cor dos "pontinhos" (amarelo)
    ctx.fillRect(food.x, food.y, fishSize, fishSize);
}

function moveFish() {
    const head = { ...fish[0] };

    if (direction === "LEFT") head.x -= fishSize;
    if (direction === "RIGHT") head.x += fishSize;
    if (direction === "UP") head.y -= fishSize;
    if (direction === "DOWN") head.y += fishSize;

    fish.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        food = generateFood();
    } else {
        fish.pop();
    }
}

function generateFood() {
    const x = Math.floor(Math.random() * (canvas.width / fishSize)) * fishSize;
    const y = Math.floor(Math.random() * (canvas.height / fishSize)) * fishSize;
    return { x, y };
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFish();
    drawFood();
    moveFish();
    document.getElementById("score").innerText = `Pontuação: ${score}`;
}

function changeDirection(event) {
    if (event.key === "ArrowUp" && direction !== "DOWN") {
        direction = "UP";
    }
    if (event.key === "ArrowDown" && direction !== "UP") {
        direction = "DOWN";
    }
    if (event.key === "ArrowLeft" && direction !== "RIGHT") {
        direction = "LEFT";
    }
    if (event.key === "ArrowRight" && direction !== "LEFT") {
        direction = "RIGHT";
    }
}

function gameOver() {
    const head = fish[0];
    if (
        head.x < 0 ||
        head.x >= canvas.width ||
        head.y < 0 ||
        head.y >= canvas.height ||
        fish.slice(1).some((segment) => segment.x === head.x && segment.y === head.y)
    ) {
        clearInterval(gameInterval);
        alert(`Game Over! Sua pontuação foi: ${score}`);
        window.location.reload();
    }
}

document.addEventListener("keydown", changeDirection);

const gameInterval = setInterval(() => {
    draw();
    gameOver();
}, 100);
