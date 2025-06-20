const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let player1Score = 0;
let player2Score = 0;
const goalLimit = 5;

const player1 = {
    x: 50,
    y: canvas.height / 2 - 50,
    width: 50,
    height: 100,
    img: new Image()
};
player1.img.src = 'https://i.imgur.com/x37Xs6Y.png';

const player2 = {
    x: canvas.width - 100,
    y: canvas.height / 2 - 50,
    width: 50,
    height: 100,
    img: new Image()
};
player2.img.src = 'https://i.imgur.com/GaEyK9n.png';

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 20,
    dx: 5,
    dy: 5,
    img: new Image()
};
ball.img.src = 'https://i.imgur.com/oBPNQgO.png';

function drawPlayer(player) {
    ctx.drawImage(player.img, player.x, player.y, player.width, player.height);
}

function drawBall() {
    ctx.drawImage(ball.img, ball.x, ball.y, ball.size, ball.size);
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function newRound() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = -ball.dx;
}

function update() {
    clear();
    drawPlayer(player1);
    drawPlayer(player2);
    drawBall();

    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.y < 0 || ball.y + ball.size > canvas.height) {
        ball.dy *= -1;
    }

    if (ball.x < player1.x + player1.width && ball.x + ball.size > player1.x && ball.y < player1.y + player1.height && ball.y + ball.size > player1.y) {
        ball.dx *= -1;
    }

    if (ball.x < player2.x + player2.width && ball.x + ball.size > player2.x && ball.y < player2.y + player2.height && ball.y + ball.size > player2.y) {
        ball.dx *= -1;
    }

    if (ball.x < 0) {
        player2Score++;
        document.getElementById('player2Score').textContent = player2Score;
        newRound();
    }

    if (ball.x > canvas.width) {
        player1Score++;
        document.getElementById('player1Score').textContent = player1Score;
        newRound();
    }

    if (player1Score >= goalLimit || player2Score >= goalLimit) {
        document.getElementById('winnerText').innerText = player1Score > player2Score ? 'Jogador 1 venceu!' : 'Jogador 2 venceu!';
        document.getElementById('winner').classList.remove('hidden');
    }
}

function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

gameLoop();

document.addEventListener('keydown', (e) => {
    if (e.key === 'w') player1.y -= 20;
    if (e.key === 's') player1.y += 20;
    if (e.key === 'ArrowUp') player2.y -= 20;
    if (e.key === 'ArrowDown') player2.y += 20;
});

function restartGame() {
    player1Score = 0;
    player2Score = 0;
    document.getElementById('player1Score').textContent = player1Score;
    document.getElementById('player2Score').textContent = player2Score;
    document.getElementById('winner').classList.add('hidden');
    newRound();
}