const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const playerWidth = 60;
const playerHeight = 100;

const player1 = {
  x: 20,
  y: canvas.height / 2 - playerHeight / 2,
  speed: 5,
  img: null
};

const player2 = {
  x: canvas.width - 20 - playerWidth,
  y: canvas.height / 2 - playerHeight / 2,
  speed: 5,
  img: null
};

let score1 = 0;
let score2 = 0;
let keys = {};
let paused = false;

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 15,
  speedX: 0,
  speedY: 0,
  angle: 0,
  rotationSpeed: 0.2,
  img: new Image(),
  maxSpeed: 12,
  reset() {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    const dirX = Math.random() > 0.5 ? 1 : -1;
    const dirY = Math.random() > 0.5 ? 1 : -1;
    const baseSpeed = 2 + (score1 + score2) * 0.2;
    this.speedX = baseSpeed * dirX;
    this.speedY = baseSpeed * dirY;
    this.angle = 0;
  },
  accelerate() {
    // Aumenta a velocidade 5% até o maxSpeed
    if (Math.abs(this.speedX) < this.maxSpeed) {
      this.speedX *= 1.05;
      if (Math.abs(this.speedX) > this.maxSpeed) {
        this.speedX = this.maxSpeed * Math.sign(this.speedX);
      }
    }
    if (Math.abs(this.speedY) < this.maxSpeed) {
      this.speedY *= 1.05;
      if (Math.abs(this.speedY) > this.maxSpeed) {
        this.speedY = this.maxSpeed * Math.sign(this.speedY);
      }
    }
  }
};

const player1Img = new Image();
const player2Img = new Image();
const ballImg = new Image();

let imagesLoaded = 0;
const totalImages = 3;

function checkAllLoaded() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    startGame();
  }
}

player1Img.src = 'jogador (2).png';
player2Img.src = 'jogador2.png';
ballImg.src = 'bola.png';

player1Img.onload = checkAllLoaded;
player2Img.onload = checkAllLoaded;
ballImg.onload = checkAllLoaded;

function startGame() {
  player1.img = player1Img;
  player2.img = player2Img;
  ball.img = ballImg;
  ball.reset();

  setInterval(() => {
    if (!paused) {
      ball.accelerate();
    }
  }, 2000);

  gameLoop();
}

document.addEventListener("keydown", (e) => keys[e.key.toLowerCase()] = true);
document.addEventListener("keyup", (e) => keys[e.key.toLowerCase()] = false);

function movePlayers() {
  if (keys["w"] && player1.y > 0) player1.y -= player1.speed;
  if (keys["s"] && player1.y < canvas.height - playerHeight) player1.y += player1.speed;
  if (keys["arrowup"] && player2.y > 0) player2.y -= player2.speed;
  if (keys["arrowdown"] && player2.y < canvas.height - playerHeight) player2.y += player2.speed;
}

function moveBall() {
  ball.x += ball.speedX;
  ball.y += ball.speedY;
  ball.angle += ball.rotationSpeed;

  // Rebote no teto e chão
  if (ball.y - ball.radius < 0) {
    ball.y = ball.radius;
    ball.speedY *= -1;
  }
  if (ball.y + ball.radius > canvas.height) {
    ball.y = canvas.height - ball.radius;
    ball.speedY *= -1;
  }

  const goalLeft = { x: 0, y: canvas.height / 4, width: 10, height: canvas.height / 2 };
  const goalRight = { x: canvas.width - 10, y: canvas.height / 4, width: 10, height: canvas.height / 2 };

  const isLeftGoal = ball.x - ball.radius <= goalLeft.x + goalLeft.width &&
                     ball.y > goalLeft.y + 10 &&
                     ball.y < goalLeft.y + goalLeft.height - 10;

  const isRightGoal = ball.x + ball.radius >= goalRight.x &&
                      ball.y > goalRight.y + 10 &&
                      ball.y < goalRight.y + goalRight.height - 10;

  if (isLeftGoal) {
    score2++;
    if (score2 >= 5) {
      showRestartScreen("Jogador 2 venceu!");
    } else {
      ball.reset();
    }
    return;
  }

  if (isRightGoal) {
    score1++;
    if (score1 >= 5) {
      showRestartScreen("Jogador 1 venceu!");
    } else {
      ball.reset();
    }
    return;
  }

  // Rebote na lateral do gol (não é gol)
  const bateLateralDoGol =
    (ball.x - ball.radius <= goalLeft.x + goalLeft.width &&
     (ball.y <= goalLeft.y + 10 || ball.y >= goalLeft.y + goalLeft.height - 10)) ||
    (ball.x + ball.radius >= goalRight.x &&
     (ball.y <= goalRight.y + 10 || ball.y >= goalRight.y + goalRight.height - 10));

  if (bateLateralDoGol) {
    ball.speedX *= -1;
  }

  // Colisão com jogadores
  if (ball.x - ball.radius < player1.x + playerWidth &&
      ball.x > player1.x &&
      ball.y + ball.radius > player1.y &&
      ball.y - ball.radius < player1.y + playerHeight) {
    ball.speedX = Math.abs(ball.speedX); // força a bola a ir para a direita
    ball.x = player1.x + playerWidth + ball.radius;
  }

  if (ball.x + ball.radius > player2.x &&
      ball.x < player2.x + playerWidth &&
      ball.y + ball.radius > player2.y &&
      ball.y - ball.radius < player2.y + playerHeight) {
    ball.speedX = -Math.abs(ball.speedX); // força a bola a ir para a esquerda
    ball.x = player2.x - ball.radius;
  }
}

function drawField() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Fundo verde já pelo CSS

  ctx.strokeStyle = "white";
  ctx.lineWidth = 4;

  // Linha do meio
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();

  // Círculo central
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, 60, 0, Math.PI * 2);
  ctx.stroke();

  // Áreas grandes
  ctx.strokeRect(0, 100, 100, 300);
  ctx.strokeRect(canvas.width - 100, 100, 100, 300);

  // Áreas pequenas
  ctx.strokeRect(0, 175, 50, 150);
  ctx.strokeRect(canvas.width - 50, 175, 50, 150);

  // Pontos do pênalti
  ctx.beginPath();
  ctx.arc(70, canvas.height / 2, 4, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(canvas.width - 70, canvas.height / 2, 4, 0, Math.PI * 2);
  ctx.fill();

  // Escanteios (arcos)
  const radius = 10;
  const corners = [
    [0, 0, 0],                         // topo-esquerdo
    [canvas.width, 0, Math.PI / 2],    // topo-direito
    [0, canvas.height, -Math.PI / 2],  // baixo-esquerdo
    [canvas.width, canvas.height, Math.PI] // baixo-direito
  ];

  ctx.strokeStyle = "white";
  corners.forEach(([x, y, start]) => {
    ctx.beginPath();
    ctx.arc(x, y, radius, start, start + Math.PI / 2);
    ctx.stroke();
  });

  // Placar
  ctx.fillStyle = "white";
  ctx.font = "36px Arial";
  ctx.fillText(score1, canvas.width / 4, 50);
  ctx.fillText(score2, (canvas.width * 3) / 4, 50);
}

function drawGoals() {
  const goalTop = canvas.height / 4;
  const goalHeight = canvas.height / 2;
  ctx.strokeStyle = "white";
  ctx.lineWidth = 6;

  // Contorno das metas
  ctx.strokeRect(20, goalTop, 10, goalHeight);
  ctx.strokeRect(canvas.width - 30, goalTop, 10, goalHeight);

  // Linhas horizontais da rede
  ctx.lineWidth = 1;
  for (let i = 0; i <= goalHeight; i += 10) {
    ctx.beginPath();
    ctx.moveTo(20, goalTop + i);
    ctx.lineTo(30, goalTop + i);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvas.width - 30, goalTop + i);
    ctx.lineTo(canvas.width - 20, goalTop + i);
    ctx.stroke();
  }

  // Linhas verticais da rede
  for (let i = 0; i <= 10; i += 5) {
    ctx.beginPath();
    ctx.moveTo(20 + i, goalTop);
    ctx.lineTo(20 + i, goalTop + goalHeight);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvas.width - 30 + i, goalTop);
    ctx.lineTo(canvas.width - 30 + i, goalTop + goalHeight);
    ctx.stroke();
  }
}

function draw() {
  drawField();
  drawGoals();

  ctx.drawImage(player1.img, player1.x, player1.y, playerWidth, playerHeight);
  ctx.drawImage(player2.img, player2.x, player2.y, playerWidth, playerHeight);

  ctx.save();
  ctx.translate(ball.x, ball.y);
  ctx.rotate(ball.angle);
  ctx.drawImage(ball.img, -ball.radius, -ball.radius, ball.radius * 2, ball.radius * 2);
  ctx.restore();
}

function gameLoop() {
  if (!paused) {
    movePlayers();
    moveBall();
    draw();
    requestAnimationFrame(gameLoop);
  }
}

function showRestartScreen(winner) {
  paused = true;
  alert(`${winner}\nPlacar final: ${score1} x ${score2}`);
  restartGame();
}

function restartGame() {
  score1 = 0;
  score2 = 0;
  paused = false;
  ball.reset();
  gameLoop();
}
