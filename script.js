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
  speedX: 3,
  speedY: 3,
  angle: 0,
  rotationSpeed: 0.2,
  img: new Image(),
  maxSpeed: 12,
  reset() {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    const dirX = Math.random() > 0.5 ? 1 : -1;
    const dirY = Math.random() > 0.5 ? 1 : -1;
    this.speedX = 3 * dirX;
    this.speedY = 3 * dirY;
    this.angle = 0;
  },
  accelerate() {
    if (Math.abs(this.speedX) < this.maxSpeed) this.speedX *= 1.05;
    if (Math.abs(this.speedY) < this.maxSpeed) this.speedY *= 1.05;
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
    if (!paused) ball.accelerate();
  }, 2000);

  gameLoop();
}

document.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
document.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

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
    ball.speedX = Math.abs(ball.speedX);
    ball.x = player1.x + playerWidth + ball.radius;
  }

  if (ball.x + ball.radius > player2.x &&
      ball.x < player2.x + playerWidth &&
      ball.y + ball.radius > player2.y &&
      ball.y - ball.radius < player2.y + playerHeight) {
    ball.speedX = -Math.abs(ball.speedX);
    ball.x = player2.x - ball.radius;
  }
}

function drawField() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "white";
  ctx.lineWidth = 4;

  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, 60, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeRect(0, 100, 100, 300);
  ctx.strokeRect(canvas.width - 100, 100, 100, 300);

  ctx.strokeRect(0, 175, 50, 150);
  ctx.strokeRect(canvas.width - 50, 175, 50, 150);

  ctx.beginPath();
  ctx.arc(70, canvas.height / 2, 4, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(canvas.width - 70, canvas.height / 2, 4, 0, Math.PI * 2);
  ctx.fill();

  const radius = 10;
  const corners = [
    [0, 0, 0],
    [canvas.width, 0, Math.PI / 2],
    [0, canvas.height, -Math.PI / 2],
    [canvas.width, canvas.height, Math.PI]
  ];

  ctx.strokeStyle = "white";
  corners.forEach(([x, y, start]) => {
    ctx.beginPath();
    ctx.arc(x, y, radius, start, start + Math.PI / 2);
    ctx.stroke();
  });

  ctx.fillStyle = "white";
  ctx.font = "36px Arial";
  ctx.fillText(score1, canvas.width / 4, 50);
  ctx.fillText(score2, (canvas.width * 3) / 4, 50);
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
