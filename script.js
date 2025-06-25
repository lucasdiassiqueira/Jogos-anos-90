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
player1.img.src = 'jogador (2).png';

const player2 = {
  x: canvas.width - 20 - playerWidth,
  y: canvas.height / 2 - playerHeight / 2,
  speed: 5,
  img: new Image()
};
player2.img.src = 'jogador2.png';

let initialSpeed = 4;      
let speedIncrease = 0.5;    

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 15,               
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
ball.img.src = 'bola.png';

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

  const goalTop = canvas.height / 4;
  const goalBottom = (canvas.height * 3) / 4;

  // Gol jogador 2 (esquerda)
  if (ball.x - ball.radius <= 0 && ball.y > goalTop && ball.y < goalBottom) {
    score2++;
    ball.reset();
    return;
  }

  // Gol jogador 1 (direita)
  if (ball.x + ball.radius >= canvas.width && ball.y > goalTop && ball.y < goalBottom) {
    score1++;
    ball.reset();
    return;
  }

  // Rebote nas paredes atrás do gol (evita marcar gol)
  if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
    ball.speedX *= -1;
    return;
  }

  // Colisão com jogador 1
  if (
    ball.x - ball.radius < player1.x + playerWidth &&
    ball.x - ball.radius > player1.x &&
    ball.y + ball.radius > player1.y &&
    ball.y - ball.radius < player1.y + playerHeight
  ) {
    ball.x = player1.x + playerWidth + ball.radius;
    ball.speedX *= -1;
  }

  // Colisão com jogador 2
  if (
    ball.x + ball.radius > player2.x &&
    ball.x + ball.radius < player2.x + playerWidth &&
    ball.y + ball.radius > player2.y &&
    ball.y - ball.radius < player2.y + playerHeight
  ) {
    ball.x = player2.x - ball.radius;
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
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.fillRect(0, canvas.height / 4, 10, canvas.height / 2);
  ctx.fillRect(canvas.width - 10, canvas.height / 4, 10, canvas.height / 2);

  const goalTop = canvas.height / 4;
  const goalHeight = canvas.height / 2;

  // Gols
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.fillRect(0, goalTop, 10, goalHeight); // Gol esquerdo
  ctx.fillRect(canvas.width - 10, goalTop, 10, goalHeight); // Gol direito

  // Redes (linhas horizontais)
  ctx.strokeStyle = "white";
  ctx.lineWidth = 1;
  for (let i = 0; i <= goalHeight; i += 10) {
    ctx.beginPath();
    ctx.moveTo(10, goalTop + i);
    ctx.lineTo(30, goalTop + i); // rede esquerda
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvas.width - 10, goalTop + i);
    ctx.lineTo(canvas.width - 30, goalTop + i); // rede direita
    ctx.stroke();
  }

  // Redes (linhas verticais)
  for (let i = 10; i <= 30; i += 10) {
    ctx.beginPath();
    ctx.moveTo(i, goalTop);
    ctx.lineTo(i, goalTop + goalHeight); // rede esquerda
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvas.width - i, goalTop);
    ctx.lineTo(canvas.width - i, goalTop + goalHeight); // rede direita
    ctx.stroke();
  }
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
