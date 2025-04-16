let player, enemies = [], score = 0, time = 0, gameInterval, enemyInterval, timerInterval;
let gameStarted = false;

const gameContainer = document.getElementById("game-container");
const playerElement = document.getElementById("player");
const scoreElement = document.getElementById("score");
const timeElement = document.getElementById("time");
const startBtn = document.getElementById("start-btn");
const videoOverlay = document.getElementById("video-overlay");
const endVideo = document.getElementById("end-video");
const hitSound = document.getElementById("hit-sound");

const playerSize = 50;
let playerX = 100;
let playerY = 100;
let keys = {};

function createEnemy() {
  const enemy = document.createElement("div");
  enemy.className = "enemy";
  enemy.style.width = "50px";
  enemy.style.height = "50px";
  enemy.style.position = "absolute";
  enemy.style.left = Math.random() * (gameContainer.clientWidth - 50) + "px";
  enemy.style.top = Math.random() * (gameContainer.clientHeight - 50) + "px";
  enemy.style.backgroundImage = "url('https://i.imgur.com/NPnmEtr.png')";
  enemy.style.backgroundSize = "cover";
  enemy.style.zIndex = 2;
  gameContainer.appendChild(enemy);
  enemies.push(enemy);
}

function moveEnemies() {
  enemies.forEach(enemy => {
    const ex = parseInt(enemy.style.left);
    const ey = parseInt(enemy.style.top);

    const dx = playerX - ex;
    const dy = playerY - ey;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const speed = 1.5;
    const nx = dx / dist;
    const ny = dy / dist;

    const newX = ex + nx * speed;
    const newY = ey + ny * speed;

    enemy.style.left = Math.max(0, Math.min(gameContainer.clientWidth - 50, newX)) + "px";
    enemy.style.top = Math.max(0, Math.min(gameContainer.clientHeight - 50, newY)) + "px";

    // collision
    if (
      newX < playerX + playerSize &&
      newX + 50 > playerX &&
      newY < playerY + playerSize &&
      newY + 50 > playerY
    ) {
      endGame();
    }
  });
}

function updatePlayerPosition() {
  const speed = 5;
  if (keys["ArrowUp"] || keys["w"]) playerY -= speed;
  if (keys["ArrowDown"] || keys["s"]) playerY += speed;
  if (keys["ArrowLeft"] || keys["a"]) playerX -= speed;
  if (keys["ArrowRight"] || keys["d"]) playerX += speed;

  // 限制邊界
  playerX = Math.max(0, Math.min(gameContainer.clientWidth - playerSize, playerX));
  playerY = Math.max(0, Math.min(gameContainer.clientHeight - playerSize, playerY));

  playerElement.style.left = playerX + "px";
  playerElement.style.top = playerY + "px";
}

function updateGame() {
  updatePlayerPosition();
  moveEnemies();
  score++;
  scoreElement.textContent = score;
}

function startTimer() {
  time = 0;
  timerInterval = setInterval(() => {
    time++;
    timeElement.textContent = time;
  }, 1000);
}

function resetGame() {
  enemies.forEach(e => e.remove());
  enemies = [];
  clearInterval(gameInterval);
  clearInterval(enemyInterval);
  clearInterval(timerInterval);
  score = 0;
  scoreElement.textContent = score;
  timeElement.textContent = 0;
  playerX = 100;
  playerY = 100;
}

function startGame() {
  if (gameStarted) return;
  gameStarted = true;
  resetGame();

  playerElement.style.backgroundImage = "url('https://i.imgur.com/JFTxfva.png')";
  playerElement.style.width = playerSize + "px";
  playerElement.style.height = playerSize + "px";
  playerElement.style.left = playerX + "px";
  playerElement.style.top = playerY + "px";
  playerElement.style.zIndex = 3;

  gameInterval = setInterval(updateGame, 30);
  enemyInterval = setInterval(createEnemy, 2000);
  startTimer();
}

function endGame() {
  clearInterval(gameInterval);
  clearInterval(enemyInterval);
  clearInterval(timerInterval);
  hitSound.play();
  showVideo();
  gameStarted = false;
}

function showVideo() {
  videoOverlay.style.display = "flex";
  endVideo.src = "https://www.youtube.com/embed/hG8f19z8VJ8?autoplay=1";
}

startBtn.addEventListener("click", startGame);

document.addEventListener("keydown", e => {
  keys[e.key] = true;
});

document.addEventListener("keyup", e => {
  keys[e.key] = false;
});
