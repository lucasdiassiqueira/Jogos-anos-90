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

let initialSpeed = 2;       // velocidade inicial da bola
let speedIncrease = 0.1;    // aumento mais suave

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 15,               // aumentei um pouco pra colisão ficar melhor
  speedX: 0,
  speedY: 0,
  img: new Image(),
  reset: function () {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    const directionX = Math.random() > 0.5 ? 1 : -1;
    const directionY = Math.random() > 0.5 ? 1 : -1;
    const speed = initialSpeed + (score1 + score2) * speedIncrease;
    this.speedX = speed * directionX;
    this.speedY = speed * directionY;
  }
};
ball.img.src = 'bola.jpg';

let score1 = 0;
let score2 = 0;

let keys = {};

document.addEventListener("keydown", (e) => {
  keys[e.key.toLowerCase()] = true;
});
document.addEventListener("keyup", (e) => {
  keys[e.key.toLowerCase()] = false;
});

function movePlayers() {
  if (keys["w"] && player1.y > 0) player1.y -= player1.speed;
  if (keys["s"] && player1.y < canvas.height - playerHeight) player1.y += player1.speed;
  if (keys["arrowup"] && player2.y > 0) player2.y -= player2.speed;
  if (keys["arrowdown"] && player2.y < canvas.height - playerHeight) player2.y += player2.speed;
}

function moveBall() {
  ball.x += ball.speedX;
  ball.y += ball.speedY;

  // Rebote vertical (superior e inferior)
  if (ball.y - ball.radius < 0) {
    ball.y = ball.radius;
    ball.speedY *= -1;
  } else if (ball.y + ball.radius > canvas.height) {
    ball.y = canvas.height - ball.radius;
    ball.speedY *= -1;
  }

  // Verifica gol jogador 2 (lado esquerdo)
  if (
    ball.x - ball.radius < 10 &&
    ball.y > canvas.height / 4 &&
    ball.y < (canvas.height * 3) / 4
  ) {
    score2++;
    ball.reset();
    return;
  }

  // Verifica gol jogador 1 (lado direito)
  if (
    ball.x + ball.radius > canvas.width - 10 &&
    ball.y > canvas.height / 4 &&
    ball.y < (canvas.height * 3) / 4
  ) {
    score1++;
    ball.reset();
    return;
  }

  // Colisão com jogador 1
  if (
    ball.x - ball.radius < player1.x + playerWidth &&
    ball.x - ball.radius > player1.x &&  // Ajuste: bola precisa estar na frente do jogador
    ball.y + ball.radius > player1.y &&
    ball.y - ball.radius < player1.y + playerHeight
  ) {
    ball.x = player1.x + playerWidth + ball.radius; // evita que fique dentro do jogador
    ball.speedX *= -1;
  }

  // Colisão com jogador 2
  if (
    ball.x + ball.radius > player2.x &&
    ball.x + ball.radius < player2.x + playerWidth && // Ajuste análogo
    ball.y + ball.radius > player2.y &&
    ball.y - ball.radius < player2.y + playerHeight
  ) {
    ball.x = player2.x - ball.radius; // evita que fique dentro do jogador
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
  ctx.fillRect(0, canvas.height / 4, 10, canvas.height / 2);
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
  ball.reset(); // posiciona bola com velocidade inicial
  gameLoop();
};
