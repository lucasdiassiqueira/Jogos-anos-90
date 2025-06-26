const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 500;

// Desenha o campo de futebol
function drawField() {
  // Fundo verde do campo
  ctx.fillStyle = '#0a7d0a';
  ctx.fillRect(0, 100, canvas.width, canvas.height - 200);

  // Linhas brancas do campo
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 3;

  // Linha do meio
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 100);
  ctx.lineTo(canvas.width / 2, canvas.height - 100);
  ctx.stroke();

  // Círculo do meio campo
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, 70, 0, Math.PI * 2);
  ctx.stroke();

  // Área do gol esquerda
  ctx.strokeRect(0, canvas.height / 2 - 80, 100, 160);

  // Área do gol direita
  ctx.strokeRect(canvas.width - 100, canvas.height / 2 - 80, 100, 160);
}

// Desenha arquibancada cinza na parte superior (faixa)
function drawUpperStands() {
  ctx.fillStyle = '#555'; // cinza escuro
  ctx.fillRect(0, 0, canvas.width, 100);
}

// Desenha torcedores pixelizados (lado esquerdo)
function drawFansLeft() {
  const startX = 10;
  const startY = 120;
  const fanSize = 18;
  const rows = 6;
  const cols = 3;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = startX + c * (fanSize + 4);
      const y = startY + r * (fanSize + 6);
      drawFan(x, y, fanSize);
    }
  }
}

// Desenha torcedores pixelizados (lado direito)
function drawFansRight() {
  const startX = canvas.width - 3 * 22 - 10;
  const startY = 120;
  const fanSize = 18;
  const rows = 6;
  const cols = 3;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = startX + c * (fanSize + 4);
      const y = startY + r * (fanSize + 6);
      drawFan(x, y, fanSize);
    }
  }
}

// Função que desenha um torcedor pixelizado (estilo retrô)
function drawFan(x, y, size) {
  // Cabeça
  ctx.fillStyle = '#f4c27a'; // cor pele clara
  ctx.fillRect(x + size * 0.3, y, size * 0.4, size * 0.4);

  // Corpo
  ctx.fillStyle = '#0033cc'; // camisa azul
  ctx.fillRect(x + size * 0.2, y + size * 0.4, size * 0.6, size * 0.6);

  // Olho (preto)
  ctx.fillStyle = 'black';
  ctx.fillRect(x + size * 0.4, y + size * 0.1, size * 0.1, size * 0.1);
}

// Exemplos simples de jogadores e bola
const player1 = { x: 100, y: canvas.height / 2, width: 40, height: 70, color: 'red' };
const player2 = { x: 660, y: canvas.height / 2, width: 40, height: 70, color: 'blue' };
const ball = { x: canvas.width / 2, y: canvas.height / 2, radius: 12, color: 'white' };

function drawPlayers() {
  // Jogador 1
  ctx.fillStyle = player1.color;
  ctx.fillRect(player1.x, player1.y - player1.height / 2, player1.width, player1.height);

  // Jogador 2
  ctx.fillStyle = player2.color;
  ctx.fillRect(player2.x, player2.y - player2.height / 2, player2.width, player2.height);
}

function drawBall() {
  ctx.beginPath();
  ctx.fillStyle = ball.color;
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();
}

// Função principal que desenha tudo
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawUpperStands();
  drawField();
  drawFansLeft();
  drawFansRight();

  drawPlayers();
  drawBall();
}

// Loop do jogo para desenhar a 60 fps
function gameLoop() {
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
