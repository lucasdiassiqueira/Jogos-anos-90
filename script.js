const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let snake = [{ x: 160, y: 160 }];
let dx = 40;
let dy = 0;

function drawSnake() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  snake.forEach(segment => {
    ctx.fillStyle = '#2196F3';
    ctx.fillRect(segment.x, segment.y, 40, 40);
    ctx.strokeStyle = '#1976D2';
    ctx.strokeRect(segment.x, segment.y, 40, 40);
  });
}

function moveSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);
  snake.pop();
}

function gameLoop() {
  moveSnake();
  drawSnake();
}

setInterval(gameLoop, 200);

document.addEventListener('keydown', (e) => {
  switch(e.key) {
    case 'ArrowUp':
      dx = 0; dy = -40;
      break;
    case 'ArrowDown':
      dx = 0; dy = 40;
      break;
    case 'ArrowLeft':
      dx = -40; dy = 0;
      break;
    case 'ArrowRight':
      dx = 40; dy = 0;
      break;
  }
});
