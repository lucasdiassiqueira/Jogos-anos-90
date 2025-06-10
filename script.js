const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const fishSize = 10; // Tamanho do peixe (cabeça da cobra)
let fish = [{ x: 150, y: 150 }];
let direction = "RIGHT";
let food = { x: 100, y: 100 };
let score = 0;
let speed = 100; // Velocidade inicial

// Função para desenhar o peixe (cobra)
function drawFish() {
    fish.forEach((segment, index) => {
        ctx.beginPath();
        ctx.arc(segment.x + fishSize / 2, segment.y + fishSize / 2, fishSize / 2, 0, Math.PI * 2);
        ctx.fillStyle = "#FF4500"; // Cor do peixe
        ctx.fill();
        ctx.closePath();
    });
}

// Função para desenhar a comida
function drawFood() {
    ctx.beginPath();
    ctx.arc(food.x + fishSize / 2, food.y + fishSize / 2, fishSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = "#FFD700"; // Cor dos pontos amarelos
    ctx.fill();
    ctx.closePath();
}

// Função para movimentar o peixe (cobrinha)
function moveFish() {
    const head = { ...fish[0] };

    if (direction === "LEFT") head.x -= fishSize;
    if (direction === "RIGHT") head.x += fishSize;
    if (direction === "UP") head.y -= fishSize;
    if (direction === "DOWN") head.y += fishSize;

    fish.unshift(head);

    // Verifica se o peixe comeu a comida
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        food = generateFood();
        // Aumenta a velocidade após cada comida
        if (speed > 50) speed -= 5; // Não deixa a velocidade ficar muito rápida
    } else {
        fish.pop();
    }
}

// Função para gerar comida em posições aleatórias
function generateFood() {
    const x = Math.floor(Math.random() * (canvas.width / fishSize)) * fishSize;
    const y = Math.floor(Math.random() * (canvas.height / fishSize)) * fishSize;
    return { x, y };
}

// Função para desenhar o estado do jogo
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
    drawFish();
    drawFood();
    moveFish();
    document.getElementById("score").innerText = `Pontuação: ${score}`;
}

// Função para alterar a direção da cobrinha
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

// Função para verificar se houve colisão com as bordas ou com o próprio corpo
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

// Configura o intervalo para atualizar o jogo
const gameInterval = setInterval(() => {
    draw();
    gameOver();
}, speed); // Usa a variável 'speed' para definir a velocidade do jogo
