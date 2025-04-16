const gameArea = document.getElementById("gameArea");
const player = document.getElementById("player");
const video = document.getElementById("video");
const startButton = document.getElementById("startButton");

let enemies = [];
let isGameRunning = false;
let moveSpeed = 5;
let dx = 0, dy = 0;
let animationFrameId;
let targetX = 0, targetY = 0;
const enemySize = 50;
const playerSize = 50;
const margin = 10;

function createEnemy() {
  const enemy = document.createElement("div");
  enemy.classList.add("enemy");
  gameArea.appendChild(enemy);

  let x, y, isOverlapping;

  do {
    isOverlapping = false;
    x = Math.random() * (gameArea.clientWidth - enemySize);
    y = Math.random() * (gameArea.clientHeight - enemySize);

    for (const other of enemies) {
      const ox = parseFloat(other.style.left);
      const oy = parseFloat(other.style.top);
      if (
        x < ox + enemySize &&
        x + enemySize > ox &&
        y < oy + enemySize &&
        y + enemySize > oy
      ) {
        isOverlapping = true;
        break;
      }
    }
  } while (isOverlapping);

  enemy.style.left = `${x}px`;
  enemy.style.top = `${y}px`;
  enemies.push(enemy);
}

function updateEnemies() {
  const playerX = parseFloat(player.style.left);
  const playerY = parseFloat(player.style.top);

  enemies.forEach((enemy, i) => {
    const ex = parseFloat(enemy.style.left);
    const ey = parseFloat(enemy.style.top);
    let dx = playerX - ex;
    let dy = playerY - ey;
    const dist = Math.hypot(dx, dy);
    dx /= dist;
    dy /= dist;

    let newX = ex + dx * 1.5;
    let newY = ey + dy * 1.5;

    // 防止敵人重疊
    let overlapped = false;
    for (let j = 0; j < enemies.length; j++) {
      if (i !== j) {
        const other = enemies[j];
        const ox = parseFloat(other.style.left);
        const oy = parseFloat(other.style.top);
        if (
          newX < ox + enemySize &&
          newX + enemySize > ox &&
          newY < oy + enemySize &&
          newY + enemySize > oy
        ) {
          overlapped = true;
          break;
        }
      }
    }

    if (!overlapped) {
      enemy.style.left = `${newX}px`;
      enemy.style.top = `${newY}px`;
    }
  });
}

function gameLoop() {
  if (!isGameRunning) return;

  // 計算最大邊界
  const maxX = gameArea.clientWidth - player.offsetWidth - margin;
  const maxY = gameArea.clientHeight - player.offsetHeight - margin;

  // 鍵盤移動
  let newX = parseFloat(player.style.left) + dx;
  let newY = parseFloat(player.style.top) + dy;
  newX = Math.max(margin, Math.min(newX, maxX));
  newY = Math.max(margin, Math.min(newY, maxY));
  player.style.left = `${newX}px`;
  player.style.top = `${newY}px`;

  updateEnemies();
  animationFrameId = requestAnimationFrame(gameLoop);
}

function startGame() {
  player.style.left = "100px";
  player.style.top = "100px";
  dx = 0;
  dy = 0;
  isGameRunning = true;
  enemies.forEach(e => e.remove());
  enemies = [];
  for (let i = 0; i < 10; i++) createEnemy();
  video.style.display = "none";
  video.pause();
  gameLoop();
}

startButton.addEventListener("click", () => {
  if (!isGameRunning) {
    startGame();
  } else {
    isGameRunning = false;
    cancelAnimationFrame(animationFrameId);
  }
});

document.addEventListener("keydown", (e) => {
  if (!isGameRunning) return;
  switch (e.key) {
    case "ArrowUp":
    case "w":
      dy = -moveSpeed;
      break;
    case "ArrowDown":
    case "s":
      dy = moveSpeed;
      break;
    case "ArrowLeft":
    case "a":
      dx = -moveSpeed;
      break;
    case "ArrowRight":
    case "d":
      dx = moveSpeed;
      break;
  }
});

document.addEventListener("keyup", (e) => {
  if (!isGameRunning) return;
  switch (e.key) {
    case "ArrowUp":
    case "ArrowDown":
    case "w":
    case "s":
      dy = 0;
      break;
    case "ArrowLeft":
    case "ArrowRight":
    case "a":
    case "d":
      dx = 0;
      break;
  }
});

gameArea.addEventListener("click", (e) => {
  if (!isGameRunning) return;
  const maxX = gameArea.clientWidth - player.offsetWidth - margin;
  const maxY = gameArea.clientHeight - player.offsetHeight - margin;

  targetX = Math.max(margin, Math.min(e.clientX - player.offsetWidth / 2, maxX));
  targetY = Math.max(margin, Math.min(e.clientY - player.offsetHeight / 2, maxY));
  player.style.left = `${targetX}px`;
  player.style.top = `${targetY}px`;
});

// 撞到敵人播放影片
function checkCollision() {
  const playerRect = player.getBoundingClientRect();
  for (const enemy of enemies) {
    const enemyRect = enemy.getBoundingClientRect();
    if (
      playerRect.left < enemyRect.right &&
      playerRect.right > enemyRect.left &&
      playerRect.top < enemyRect.bottom &&
      playerRect.bottom > enemyRect.top
    ) {
      isGameRunning = false;
      cancelAnimationFrame(animationFrameId);
      video.style.display = "block";
      video.currentTime = 0;
      video.play();
      break;
    }
  }
}

setInterval(checkCollision, 100);
