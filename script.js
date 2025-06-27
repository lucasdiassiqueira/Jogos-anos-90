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

  const goalTop = canvas.height / 4;
  const goalBottom = goalTop + canvas.height / 2;
  const goalLeftX = 20;
  const goalRightX = canvas.width - 30;

  const isInsideLeftGoal = (
    ball.x - ball.radius <= goalLeftX &&
    ball.y > goalTop + 10 &&
    ball.y < goalBottom - 10
  );

  const isInsideRightGoal = (
    ball.x + ball.radius >= goalRightX + 10 &&
    ball.y > goalTop + 10 &&
    ball.y < goalBottom - 10
  );

  if (isInsideLeftGoal) {
    score2++;
    score2 >= 5 ? showRestartScreen("Jogador 2 venceu!") : ball.reset();
    return;
  }

  if (isInsideRightGoal) {
    score1++;
    score1 >= 5 ? showRestartScreen("Jogador 1 venceu!") : ball.reset();
    return;
  }

  // Ricocheteia se bater na parte de trás do gol (fora da área válida de gol)
  const bateAtrasDoGol =
    (ball.x - ball.radius < goalLeftX &&
     (ball.y <= goalTop + 10 || ball.y >= goalBottom - 10)) ||
    (ball.x + ball.radius > goalRightX + 10 &&
     (ball.y <= goalTop + 10 || ball.y >= goalBottom - 10));

  if (bateAtrasDoGol) {
    ball.speedX *= -1;
  }

  // Colisão com jogadores
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

 
  ctx.strokeStyle = "white";
  ctx.lineWidth = 4;

  
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();

  
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, 60, 0, Math.PI * 2);
  ctx.stroke();

  
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, 2, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.fill();

  
  function drawSide(isLeft) {
    const baseX = isLeft ? 0 : canvas.width;
    const direction = isLeft ? 1 : -1;

    const goalTop = canvas.height / 2 - 75;

    
    ctx.strokeRect(baseX + direction * 0, canvas.height / 2 - 110, direction * 110, 220);

    
    ctx.strokeRect(baseX + direction * 0, canvas.height / 2 - 55, direction * 50, 110);

   
    ctx.beginPath();
    ctx.arc(baseX + direction * 80, canvas.height / 2, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(baseX + direction * 80, canvas.height / 2, 44, isLeft ? 1.2 : 1.9, isLeft ? 4.1 : 5.4);
    ctx.stroke();
  }

  
  drawSide(true);  
  drawSide(false); 

  
  const cornerRadius = 10;
  const corners = [
    { x: 0, y: 0, start: 0, end: Math.PI / 2 },
    { x: canvas.width, y: 0, start: Math.PI / 2, end: Math.PI },
    { x: 0, y: canvas.height, start: -Math.PI / 2, end: 0 },
    { x: canvas.width, y: canvas.height, start: Math.PI, end: 1.5 * Math.PI }
  ];

  corners.forEach(c => {
    ctx.beginPath();
    ctx.arc(c.x, c.y, cornerRadius, c.start, c.end);
    ctx.stroke();
  });

  
  ctx.fillStyle = "white";
  ctx.font = "36px Arial";
  ctx.fillText(score1, canvas.width / 4, 50);
  ctx.fillText(score2, (canvas.width * 3) / 4, 50);
}


function drawGoals() {
  const goalTop = canvas.height / 4;
  const goalHeight = canvas.height / 2;
  const goalWidth = 10;
  const innerBar = 6;

  // Traves verticais e travessão (com espessura maior)
  ctx.fillStyle = "white";

  // Gol esquerdo
  ctx.fillRect(20, goalTop, goalWidth, goalHeight); // trave direita do gol esquerdo
  ctx.fillRect(10, goalTop, goalWidth, goalHeight); // nova trave esquerda
  ctx.fillRect(10, goalTop, goalWidth + innerBar, innerBar); // travessão

  // Gol direito
  ctx.fillRect(canvas.width - 30, goalTop, goalWidth, goalHeight); // trave esquerda do gol direito
  ctx.fillRect(canvas.width - 20, goalTop, goalWidth, goalHeight); // nova trave direita
  ctx.fillRect(canvas.width - 30, goalTop, goalWidth + innerBar, innerBar); // travessão
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
