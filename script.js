let player = document.getElementById("player");
let gameContainer = document.getElementById("game-container");
let playerPos = { x: 200, y: 200 }; // 玩家起始位置
let targetPos = { x: playerPos.x, y: playerPos.y }; // 目標位置（滑鼠或鍵盤控制）
let enemyPositions = []; // 敌人位置
let enemies = []; // 敌人元素
let gameInterval; // 遊戲主循環
let lastTime = 0; // 記錄上次時間
let frameDuration = 1000 / 60; // 每秒幀數（60 FPS）
let gameStarted = false; // 遊戲是否開始

// 角色初始化
function initPlayer() {
  player.style.position = 'absolute';
  player.style.left = playerPos.x + 'px';
  player.style.top = playerPos.y + 'px';
}

// 更新玩家位置
function movePlayer() {
  let dx = targetPos.x - playerPos.x;
  let dy = targetPos.y - playerPos.y;
  let dist = Math.sqrt(dx * dx + dy * dy);
  let speed = 4;  // 玩家移動速度

  if (dist > speed) {
    playerPos.x += (dx / dist) * speed;
    playerPos.y += (dy / dist) * speed;

    // 確保角色不會超出邊界
    const gameContainerRect = gameContainer.getBoundingClientRect();
    const playerWidth = player.offsetWidth;
    const playerHeight = player.offsetHeight;

    // 左邊界
    if (playerPos.x < 0) playerPos.x = 0;
    // 右邊界
    if (playerPos.x + playerWidth > gameContainerRect.width) playerPos.x = gameContainerRect.width - playerWidth;
    // 上邊界
    if (playerPos.y < 0) playerPos.y = 0;
    // 下邊界
    if (playerPos.y + playerHeight > gameContainerRect.height) playerPos.y = gameContainerRect.height - playerHeight;

    // 更新角色的位置
    player.style.left = playerPos.x + 'px';
    player.style.top = playerPos.y + 'px';
  }
}

// 鍵盤控制
function handleKeyDown(event) {
  switch (event.key) {
    case 'ArrowUp':
      targetPos.y -= 10;
      break;
    case 'ArrowDown':
      targetPos.y += 10;
      break;
    case 'ArrowLeft':
      targetPos.x -= 10;
      break;
    case 'ArrowRight':
      targetPos.x += 10;
      break;
  }
}

// 滑鼠控制
function handleMouseMove(event) {
  const rect = gameContainer.getBoundingClientRect();
  targetPos.x = event.clientX - rect.left;
  targetPos.y = event.clientY - rect.top;
}

// 初始化敵人
function initEnemies() {
  for (let i = 0; i < 5; i++) {
    const enemy = document.createElement('div');
    enemy.className = 'enemy';
    gameContainer.appendChild(enemy);
    enemies.push(enemy);

    // 隨機生成敵人的位置
    let x = Math.random() * (gameContainer.offsetWidth - 50); // 減去敵人寬度以免超出邊界
    let y = Math.random() * (gameContainer.offsetHeight - 50); // 減去敵人高度以免超出邊界
    enemyPositions.push({ x, y });

    enemy.style.position = 'absolute';
    enemy.style.left = x + 'px';
    enemy.style.top = y + 'px';
  }
}

// 移動敵人
function moveEnemies() {
  for (let i = 0; i < enemies.length; i++) {
    let dx = playerPos.x - enemyPositions[i].x;
    let dy = playerPos.y - enemyPositions[i].y;
    let dist = Math.sqrt(dx * dx + dy * dy);
    let speed = 2;  // 敵人移動速度

    if (dist > speed) {
      enemyPositions[i].x += (dx / dist) * speed;
      enemyPositions[i].y += (dy / dist) * speed;
    }

    // 更新敵人位置
    enemies[i].style.left = enemyPositions[i].x + 'px';
    enemies[i].style.top = enemyPositions[i].y + 'px';
  }
}

// 更新遊戲狀態
function updateGame() {
  let currentTime = Date.now();
  if (currentTime - lastTime >= frameDuration) {
    movePlayer();
    moveEnemies();
    lastTime = currentTime;
  }
}

// 啟動遊戲
function startGame() {
  if (!gameStarted) {
    gameStarted = true;
    initEnemies(); // 初始化敵人
    gameInterval = setInterval(updateGame, 1000 / 60); // 60 FPS
  }
}

// 停止遊戲
function stopGame() {
  clearInterval(gameInterval);
  gameStarted = false;
}

// 設置事件監聽
document.addEventListener('keydown', handleKeyDown);
gameContainer.addEventListener('mousemove', handleMouseMove);

// 設置開始遊戲按鈕
document.getElementById("startButton").addEventListener('click', startGame);

// 初始化遊戲
initPlayer();
