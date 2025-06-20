const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Jogadores (barras)
let player1 = { x: 10, y: canvas.height/2 - 50, width: 20, height: 100, color: "white" };
let player2 = { x: canvas.width - 30, y: canvas.height/2 - 50, width: 20, height: 100, color: "red" };

// Bola
let ball = { x: canvas.width/2, y: canvas.height/2, size: 20, speedX: 5, speedY: 5 };

// Placar
let score1 = 0;
let score2 = 0;

let gameOver = false;

function drawField() {
  // Linhas do campo
  ctx.fillStyle = "white";
  ctx.fillRect(canvas.width/2 - 2, 0, 4, canvas.height);
  for (let i = 0; i < canvas.height; i += 30) {
    ctx.fillRect(canvas.width/2 - 2, i, 4, 15);
  }
}

function drawPlayers() {
  ctx.fillStyle = player1.color;
  ctx.fillRect(player1.x, player1.y, player1.width, player1.height);
  
  ctx.fillStyle = player2.color;
  ctx.fillRect(player2.x, player2.y, player2.width, player2.height);
}

function drawBall() {
  ctx.fillStyle = "white";
  ctx.fillRect(ball.x, ball.y, ball.size, ball.size);
}

function drawScore() {
  ctx.font = "40px Arial";
  ctx.fillStyle = "white";
  ctx.fillText(score1, canvas.width/2 - 50, 50);
  ctx.fillText(score2, canvas.width/2 + 30, 50);
}

function moveBall() {
  ball.x += ball.speedX;
  ball.y += ball.speedY;
  
  // Teto e chão
  if (ball.y <= 0 || ball.y + ball.size >= canvas.height) {
    ball.speedY *= -1;
  }
  
  // Colisão com jogadores
  if (ball.x <= player1.x + player1.width && ball.y + ball.size >= player1.y && ball.y <= player1.y + player1.height) {
    ball.speedX *= -1;
  }
  if (ball.x + ball.size >= player2.x && ball.y + ball.size >= player2.y && ball.y <= player2.y + player2.height) {
    ball.speedX *= -1;
  }

  // Gol
  if (ball.x < 0) {
    score2++;
    resetBall();
  }
  if (ball.x > canvas.width) {
    score1++;
    resetBall();
  }
}

function resetBall() {
  ball.x = canvas.width/2;
  ball.y = canvas.height/2;
  ball.speedX = (Math.random() > 0.5 ? 5 : -5);
  ball.speedY = (Math.random() > 0.5 ? 5 : -5);
}

function checkWin() {
  if (score1 >= 5 || score2 >= 5) {
    gameOver = true;
    ctx.fillStyle = "yellow";
    ctx.font = "50px Arial";
    let winner = score1 >= 5 ? "JOGADOR 1 VENCEU!" : "JOGADOR 2 VENCEU!";
    ctx.fillText(winner, canvas.width/2 - 250, canvas.height/2);
    ctx.font = "30px Arial";
    ctx.fillText("Pressione ENTER para jogar novamente", canvas.width/2 - 250, canvas.height/2 + 50);
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawField();
  drawPlayers();
  drawBall();
  drawScore();
  
  if (!gameOver) {
    moveBall();
  } else {
    checkWin();
  }
}

setInterval(gameLoop, 1000/60);

// Controles
window.addEventListener("keydown", function(e) {
  const speed = 20;
  if (e.key === "w") player1.y -= speed;
  if (e.key === "s") player1.y += speed;
  if (e.key === "ArrowUp") player2.y -= speed;
  if (e.key === "ArrowDown") player2.y += speed;
  
  // Limites
  player1.y = Math.max(0, Math.min(canvas.height - player1.height, player1.y));
  player2.y = Math.max(0, Math.min(canvas.height - player2.height, player2.y));
  
  if (e.key === "Enter" && gameOver) {
    score1 = 0;
    score2 = 0;
    gameOver = false;
  }
});