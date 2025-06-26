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

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 15,
  speedX: 0,
  speedY: 0,
  angle: 0,
  rotationSpeed: 0.2,
  img: new Image(),
  reset() {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    const dirX = Math.random() > 0.5 ? 1 : -1;
    const dirY = Math.random() > 0.5 ? 1 : -1;
    const speed = 4 + (score1 + score2) * 0.5;
    this.speedX = speed * dirX;
    this.speedY = speed * dirY;
    this.angle = 0;
  }
};
ball.img.src = 'bola.png';

let score1 = 0;
let score2 = 0;
let keys = {};
let paused = false;

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

  if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
    ball.speedY *= -1;
  }

  const goalTop = canvas.height / 4;
  const goalBottom = canvas.height * 3 / 4;

  if (ball.x - ball.radius <= 0 && ball.y > goalTop && ball.y < goalBottom) {
    score2++;
    if (score2 >= 5) {
      showRestartScreen("Jogador 2 venceu!");
    } else {
      ball.reset();
    }
    return;
  }

  if (ball.x + ball.radius >= canvas.width && ball.y > goalTop && ball.y < goalBottom) {
    score1++;
    if (score1 >= 5) {
      showRestartScreen("Jogador 1 venceu!");
    } else {
      ball.reset();
    }
    return;
  }

  if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
    ball.speedX *= -1;
  }

  if (
    ball.x - ball.radius < player1.x + playerWidth &&
    ball.x > player1.x &&
    ball.y + ball.radius > player1.y &&
    ball.y - ball.radius < player1.y + playerHeight
  ) {
    ball.speedX *= -1;
    ball.x = player1.x + playerWidth + ball.radius;
  }

  if (
    ball.x + ball.radius > player2.x &&
    ball.x < player2.x + playerWidth &&
    ball.y + ball.radius > player2.y &&
    ball.y - ball.radius < player2.y + playerHeight
  ) {
    ball.speedX *= -1;
    ball.x = player2.x - ball.radius;
  }
}

let crowdOffset = 0;
let crowdDirection = 1;

function drawPixelFan(x, y, color1, color2, jumping) {
  const size = 4;
  const jump = jumping ? -2 : 0;

  ctx.fillStyle = color1;
  ctx.fillRect(x, y + jump, size, size);

  ctx.fillStyle = color2;
  ctx.fillRect(x, y + size + jump, size, size * 2);

  ctx.fillStyle = color1;
  ctx.fillRect(x - 1, y + size * 3 + jump, size, size);
  ctx.fillRect(x + 2, y + size * 3 + jump, size, size);

  ctx.fillRect(x - 2, y + size + jump, size, size);
  ctx.fillRect(x + 4, y + size + jump, size, size);
}

function drawCrowd() {
  const spacingX = 14;
  const spacingY = 24;
  const margin = 24;

  const crowdLeftX = -16; // fora do campo à esquerda
  const crowdRightX = canvas.width + 6; // fora do campo à direita
  const crowdTopY = -16; // fora do campo acima
  const crowdBottomY = canvas.height + 6; // fora do campo abaixo

  const colsTop = Math.floor(canvas.width / spacingX);
  for (let c = 0; c < colsTop; c++) {
    const x = c * spacingX + 6;
    const jump = (c + crowdOffset) % 2 === 0;
    drawPixelFan(x, crowdTopY, '#d40000', '#ffffff', jump);
  }

  for (let c = 0; c < colsTop; c++) {
    const x = c * spacingX + 6;
    const jump = (c + crowdOffset) % 2 === 0;
    drawPixelFan(x, crowdBottomY, '#d40000', '#ffffff', jump);
  }

  const rowsSide = Math.floor(canvas.height / spacingY);
  for (let r = 0; r < rowsSide; r++) {
    const y = r * spacingY + 12;
    const jump = (r + crowdOffset) % 2 === 0;
    drawPixelFan(crowdLeftX, y, '#d40000', '#ffffff', jump);
    drawPixelFan(crowdRightX, y, '#d40000', '#ffffff', jump);
  }

  crowdOffset += crowdDirection;
  if (crowdOffset >= 2 || crowdOffset <= 0) crowdDirection *= -1;
}

function drawField() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCrowd();

  ctx.strokeStyle = "white";
  ctx.lineWidth = 6;
  ctx.setLineDash([15, 15]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, 70, 0, Math.PI * 2);
  ctx.stroke();

  drawGoals();

  ctx.fillStyle = "white";
  ctx.font = "36px Arial";
  ctx.fillText(score1, canvas.width / 4, 50);
  ctx.fillText(score2, (canvas.width * 3) / 4, 50);
}

function drawGoals() {
  const goalTop = canvas.height / 4;
  const goalHeight = canvas.height / 2;

  ctx.fillStyle = "white";
  ctx.fillRect(20, goalTop, 10, goalHeight);
  ctx.fillRect(canvas.width - 30, goalTop, 10, goalHeight);

  ctx.strokeStyle = "white";
  ctx.lineWidth = 1;
  for (let i = 0; i <= goalHeight; i += 10) {
    ctx.beginPath();
    ctx.moveTo(0, goalTop + i);
    ctx.lineTo(20, goalTop + i);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvas.width, goalTop + i);
    ctx.lineTo(canvas.width - 20, goalTop + i);
    ctx.stroke();
  }

  for (let i = 0; i <= 20; i += 10) {
    ctx.beginPath();
    ctx.moveTo(i, goalTop);
    ctx.lineTo(i, goalTop + goalHeight);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvas.width - i, goalTop);
    ctx.lineTo(canvas.width - i, goalTop + goalHeight);
    ctx.stroke();
  }
}

function draw() {
  drawField();
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
  document.getElementById("winnerText").textContent = winner;
  document.getElementById("scoreText").textContent = `Placar final: ${score1} x ${score2}`;
  document.getElementById("restartScreen").style.display = "flex";
}

function restartGame() {
  score1 = 0;
  score2 = 0;
  paused = false;
  document.getElementById("restartScreen").style.display = "none";
  ball.reset();
  gameLoop();
}

ball.img.onload = () => {
  ball.reset();
  gameLoop();
};

setInterval(() => {
  if (!paused && (ball.speedX !== 0 || ball.speedY !== 0)) {
    ball.speedX *= 1.05;
    ball.speedY *= 1.05;
  }
}, 2000);
