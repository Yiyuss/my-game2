// 遊戲變數初始化
const player = document.getElementById('player');
const gameContainer = document.getElementById('game-container');
const startButton = document.getElementById('start-button');
const video = document.getElementById('game-video');
const enemyContainer = document.getElementById('enemy-container');

let playerPos = { x: 100, y: 100 };  // 玩家初始位置
let targetPos = { x: 200, y: 200 };  // 玩家目標位置
let enemies = [];  // 存儲敵人的陣列
let isGameRunning = false;
let enemySpeed = 1; // 敵人移動速度
let gameInterval; // 遊戲循環

// 玩家移動函數
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

    player.style.left = playerPos.x + 'px';
    player.style.top = playerPos.y + 'px';
  }
}

// 敵人生成函數
function createEnemy() {
  const enemy = document.createElement('div');
  enemy.classList.add('enemy');
  enemy.style.left = Math.random() * (gameContainer.offsetWidth - 50) + 'px';
  enemy.style.top = Math.random() * (gameContainer.offsetHeight - 50) + 'px';
  enemyContainer.appendChild(enemy);
  enemies.push(enemy);
}

// 敵人追蹤玩家
function moveEnemies() {
  enemies.forEach(enemy => {
    const enemyPos = {
      x: parseFloat(enemy.style.left),
      y: parseFloat(enemy.style.top)
    };
    
    let dx = playerPos.x - enemyPos.x;
    let dy = playerPos.y - enemyPos.y;
    let dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist > 2) {
      let speed = enemySpeed;
      enemyPos.x += (dx / dist) * speed;
      enemyPos.y += (dy / dist) * speed;
      
      // 更新敵人位置
      enemy.style.left = enemyPos.x + 'px';
      enemy.style.top = enemyPos.y + 'px';
    }
  });
}

// 開始遊戲按鈕事件
startButton.addEventListener('click', () => {
  if (!isGameRunning) {
    startGame();
  } else {
    resetGame();
  }
});

// 開始遊戲
function startGame() {
  isGameRunning = true;
  startButton.innerHTML = '重新開始';
  video.play();
  gameInterval = setInterval(gameLoop, 1000 / 60);  // 60 FPS
  createEnemy();
}

// 重置遊戲
function resetGame() {
  isGameRunning = false;
  startButton.innerHTML = '開始遊戲';
  video.pause();
  video.currentTime = 0;
  enemies.forEach(enemy => enemy.remove());
  enemies = [];
  playerPos = { x: 100, y: 100 };
  targetPos = { x: 200, y: 200 };
  player.style.left = playerPos.x + 'px';
  player.style.top = playerPos.y + 'px';
  clearInterval(gameInterval);  // 停止遊戲循環
}

// 遊戲主循環
function gameLoop() {
  if (isGameRunning) {
    movePlayer();
    moveEnemies();
  }
}

// 處理滑鼠點擊移動角色
gameContainer.addEventListener('click', (event) => {
  const rect = gameContainer.getBoundingClientRect();
  targetPos.x = event.clientX - rect.left;
  targetPos.y = event.clientY - rect.top;
});

// 處理鍵盤移動
document.addEventListener('keydown', (event) => {
  const speed = 5;
  switch (event.key) {
    case 'ArrowUp':
      targetPos.y -= speed;
      break;
    case 'ArrowDown':
      targetPos.y += speed;
      break;
    case 'ArrowLeft':
      targetPos.x -= speed;
      break;
    case 'ArrowRight':
      targetPos.x += speed;
      break;
  }
});

// 影片結束後重置遊戲
video.addEventListener('ended', () => {
  resetGame();
});

// 初始化遊戲
function init() {
  player.style.left = playerPos.x + 'px';
  player.style.top = playerPos.y + 'px';
  video.style.width = gameContainer.offsetWidth + 'px';  // 設置影片對齊遊戲畫面
  video.style.height = gameContainer.offsetHeight + 'px';
}

init();
