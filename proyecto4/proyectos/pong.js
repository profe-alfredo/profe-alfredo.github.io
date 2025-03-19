const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

// Paletas y pelota
const paddleWidth = 10, paddleHeight = 80;
let leftPaddle = { x: 10, y: canvas.height / 2 - paddleHeight / 2, dy: 0 };
let rightPaddle = { x: canvas.width - paddleWidth - 10, y: canvas.height / 2 - paddleHeight / 2, dy: 0 };
let ball = { x: canvas.width / 2, y: canvas.height / 2, dx: 4, dy: 4, size: 10 };

// Puntuación
let scoreLeft = 0;
let scoreRight = 0;

// Movimiento de las paletas
const paddleSpeed = 6;

document.addEventListener("keydown", (e) => {
  if (e.key === "w") leftPaddle.dy = -paddleSpeed;
  if (e.key === "s") leftPaddle.dy = paddleSpeed;
  if (e.key === "ArrowUp") rightPaddle.dy = -paddleSpeed;
  if (e.key === "ArrowDown") rightPaddle.dy = paddleSpeed;
});

document.addEventListener("keyup", (e) => {
  if (e.key === "w" || e.key === "s") leftPaddle.dy = 0;
  if (e.key === "ArrowUp" || e.key === "ArrowDown") rightPaddle.dy = 0;
});

// Dibuja las paletas, la pelota y el marcador
function drawRect(x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.closePath();
}

function drawScore() {
  document.getElementById("scoreLeft").innerText = scoreLeft;
  document.getElementById("scoreRight").innerText = scoreRight;
}

// Actualiza la posición de las paletas
function movePaddles() {
  leftPaddle.y += leftPaddle.dy;
  rightPaddle.y += rightPaddle.dy;

  // Limita el movimiento dentro del canvas
  if (leftPaddle.y < 0) leftPaddle.y = 0;
  if (leftPaddle.y + paddleHeight > canvas.height) leftPaddle.y = canvas.height - paddleHeight;
  if (rightPaddle.y < 0) rightPaddle.y = 0;
  if (rightPaddle.y + paddleHeight > canvas.height) rightPaddle.y = canvas.height - paddleHeight;
}

// Mueve la pelota y detecta colisiones
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Rebote en las paredes superior e inferior
  if (ball.y - ball.size < 0 || ball.y + ball.size > canvas.height) {
    ball.dy *= -1;
  }

  // Rebote en las paletas
  if (
    (ball.x - ball.size < leftPaddle.x + paddleWidth &&
      ball.y > leftPaddle.y &&
      ball.y < leftPaddle.y + paddleHeight) ||
    (ball.x + ball.size > rightPaddle.x &&
      ball.y > rightPaddle.y &&
      ball.y < rightPaddle.y + paddleHeight)
  ) {
    ball.dx *= -1;
    ball.dx *= 1.05; // Incrementa velocidad al golpear la paleta
    ball.dy *= 1.05;
  }

  // Punto para el jugador derecho
  if (ball.x - ball.size < 0) {
    scoreRight++;
    resetBall();
  }

  // Punto para el jugador izquierdo
  if (ball.x + ball.size > canvas.width) {
    scoreLeft++;
    resetBall();
  }
}

// Reinicia la posición de la pelota
function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.dx = Math.random() > 0.5 ? 4 : -4;
  ball.dy = Math.random() > 0.5 ? 4 : -4;
}

// Bucle principal del juego
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawRect(leftPaddle.x, leftPaddle.y, paddleWidth, paddleHeight, "#fff");
  drawRect(rightPaddle.x, rightPaddle.y, paddleWidth, paddleHeight, "#fff");
  drawBall();
  drawScore();

  movePaddles();
  moveBall();

  requestAnimationFrame(gameLoop);
}

gameLoop(); // Inicia el juego
