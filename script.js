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

const player1Img = new Image();
const player2Img = new Image();
const ballImg = new Image();
const torcedor1Img = new Image();
const torcedor2Img = new Image();

torcedor1Img.src = 'New Piskel.png';
torcedor2Img.src = 'torcedor2.png';

let imagesLoaded = 0;
const totalImages = 5;

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
torcedor1Img.onload = checkAllLoaded;
torcedor2Img.onload = checkAllLoaded;

function startGame() {
  player1.img = player1Img;
  player2.img = player2Img;
  ball.img = ballImg;
  ball.reset();
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

  if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
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
    score2 >= 5 ? showRestartScreen("Jogador 2 venceu!") : ball.reset();
    return;
  }

  if (isRightGoal) {
    score1++;
    score1 >= 5 ? showRestartScreen("Jogador 1 venceu!") : ball.reset();
    return;
  }

  const bateLateralDoGol =
    (ball.x - ball.radius <= goalLeft.x + goalLeft.width &&
     (ball.y <= goalLeft.y + 10 || ball.y >= goalLeft.y + goalLeft.height - 10)) ||
    (ball.x + ball.radius >= goalRight.x &&
     (ball.y <= goalRight.y + 10 || ball.y >= goalRight.y + goalRight.height - 10));

  if (bateLateralDoGol) {
    ball.speedX *= -1;
  }

  if (ball.x - ball.radius < player1.x + playerWidth &&
      ball.x > player1.x &&
      ball.y + ball.radius > player1.y &&
      ball.y - ball.radius < player1.y + playerHeight) {
    ball.speedX *= -1;
    ball.x = player1.x + playerWidth + ball.radius;
  }

  if (ball.x + ball.radius > player2.x &&
      ball.x < player2.x + playerWidth &&
      ball.y + ball.radius > player2.y &&
      ball.y - ball.radius < player2.y + playerHeight) {
    ball.speedX *= -1;
    ball.x = player2.x - ball.radius;
  }
}

function drawField() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Torcedores em volta (parte visual fixa)
  drawFans();

  ctx.strokeStyle = "white";
  ctx.lineWidth = 10;
  ctx.setLineDash([20, 20]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.beginPath();
  ctx.lineWidth = 10;
  ctx.arc(canvas.width / 2, canvas.height / 2, 80, 0, Math.PI * 2);
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

function drawFans() {
  const spacing = 35;
  let toggle = true;
  const fanSize = 30;

  // Topo (fora do campo)
  for (let x = -60; x < canvas.width + 60; x += spacing) {
    ctx.drawImage(toggle ? torcedor1Img : torcedor2Img, x, -70, fanSize, fanSize);
    toggle = !toggle;
  }

  // Baixo (fora do campo)
  for (let x = -60; x < canvas.width + 60; x += spacing) {
    ctx.drawImage(toggle ? torcedor1Img : torcedor2Img, x, canvas.height + 40, fanSize, fanSize);
    toggle = !toggle;
  }

  // Esquerda (fora do campo)
  for (let y = -60; y < canvas.height + 60; y += spacing) {
    ctx.drawImage(toggle ? torcedor1Img : torcedor2Img, -70, y, fanSize, fanSize);
    toggle = !toggle;
  }

  // Direita (fora do campo)
  for (let y = -60; y < canvas.height + 60; y += spacing) {
    ctx.drawImage(toggle ? torcedor1Img : torcedor2Img, canvas.width + 40, y, fanSize, fanSize);
    toggle = !toggle;
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

setInterval(() => {
  if (!paused && (ball.speedX !== 0 || ball.speedY !== 0)) {
    ball.speedX *= 1.05;
    ball.speedY *= 1.05;
  }
}, 2000);
