const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const playerWidth = 60;
const playerHeight = 100;

const player1 = {
  x: 20,
  y: canvas.height / 2 - playerHeight / 2,
  speed: 5,
  img: new Image()
};
player1.img.src = 'jogador.png';

const player2 = {
  x: canvas.width - 20 - playerWidth,
  y: canvas.height / 2 - playerHeight / 2,
  speed: 5,
  img: new Image()
};
player2.img.src = 'jogador2.png';

let initialSpeed = 2;       // velocidade inicial
let speedIncrease = 0.2;    // quanto a velocidade aumenta a cada ponto

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 12,
  speedX: initialSpeed * (Math.random() > 0.5 ? 1 : -1),
  speedY: initialSpeed * (Math.random() > 0.5 ? 1 : -1),
  img: new Image(),
  reset: function () {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    const directionX = Math.random() > 0.5 ? 1 : -1;
    const directionY = Math.random() > 0.5 ? 1 : -1;
    this.speedX = (initialSpeed + (score1 + score2) * speedIncrease) * directionX;
    this.speedY = (initialSpeed + (score1 + score2) * speedIncrease) * directionY;
  }
};
ball.img.src = 'bola.jpg';

let score1 = 0;
let score2 = 0;

let keys = {};

document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});
document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

function movePlayers() {
  if (keys["w"] && player1.y > 0) player1.y -= player1.speed;
  if (keys["s"] && player1.y < canvas.height - playerHeight) player1.y += player1.speed;
  if (keys["ArrowUp"] && player2.y > 0) player2.y -= player2.speed;
  if (keys["ArrowDown"] && player2.y < canvas.height - playerHeight) player2.y += player2.speed;
}

function moveBall() {
  ball.x += ball.speedX;
  ball.y += ball.speedY;

  // rebote vertical
  if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height)
    ball.speedY *= -1;

  // gol jogador 2 (esquerda)
  if (ball.x - ball.radius < 10 && ball.y > canvas.height / 4 && ball.y < canvas.height * 3 / 4) {
    score2++;
    ball.reset();
    return;
  }

  // gol jogador 1 (direita)
  if (ball.x + ball.radius > canvas.width - 10 && ball.y > canvas.height / 4 && ball.y < canvas.height * 3 / 4) {
    score1++;
    ball.reset();
    return;
  }

  // colisão com jogador 1
  if (
    ball.x - ball.radius < player1.x + playerWidth &&
    ball.y > player1.y &&
    ball.y < player1.y + playerHeight
  ) {
    ball.speedX *= -1;
  }

  // colisão com jogador 2
  if (
    ball.x + ball.radius > player2.x &&
    ball.y > player2.y &&
    ball.y < player2.y + playerHeight
  ) {
    ball.speedX *= -1;
  }
}

function drawMidField() {
  ctx.strokeStyle = "white";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.setLineDash([15, 15]);
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, 70, 0, Math.PI * 2);
  ctx.stroke();
}

function drawGoals() {
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.fillRect(0, canvas.height / 4, 10, canvas.height / 2); // gol maior
  ctx.fillRect(canvas.width - 10, canvas.height / 4, 10, canvas.height / 2);
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "36px Arial";
  ctx.fillText(score1, canvas.width / 4, 50);
  ctx.fillText(score2, (canvas.width * 3) / 4, 50);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawMidField();
  drawGoals();
  drawScore();

  ctx.drawImage(player1.img, player1.x, player1.y, playerWidth, playerHeight);
  ctx.drawImage(player2.img, player2.x, player2.y, playerWidth, playerHeight);

  ctx.drawImage(ball.img, ball.x - ball.radius, ball.y - ball.radius, ball.radius * 2, ball.radius * 2);
}

function gameLoop() {
  movePlayers();
  moveBall();
  draw();
  requestAnimationFrame(gameLoop);
}

ball.img.onload = () => {
  gameLoop();
};
