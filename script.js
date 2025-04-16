const startBtn = document.getElementById('start-btn');
const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const videoOverlay = document.getElementById('video-overlay');
const endVideo = document.getElementById('end-video');
const player = document.getElementById('player');
const hitSound = document.getElementById('hit-sound');

let score = 0;
let time = 0;
let playerPos = { x: 200, y: 200 };
let enemies = [];  // 用來存儲所有敵人
let gameInterval;
let enemyInterval;
let gameRunning = false;
let targetPos = { x: playerPos.x, y: playerPos.y };

// 開始遊戲
startBtn.addEventListener('click', () => {
  resetGame(); // 重置遊戲狀態
  gameRunning = true;

  // 啟動遊戲邏輯
  gameInterval = setInterval(updateGame, 1000 / 60); // 每秒更新60次
  spawnEnemy();  // 初始生成一個敵人
  enemyInterval = setInterval(spawnEnemy, 5000); // 每 5 秒生成一個新的敵人
});

// 點擊移動玩家
document.addEventListener('click', (e) => {
  if (!gameRunning || isVideoPlaying()) return; // 影片播放中不處理移動

  // 計算目標位置
  const gameContainerRect = document.getElementById('game-container').getBoundingClientRect();
  targetPos.x = e.clientX - gameContainerRect.left - player.offsetWidth / 2;
  targetPos.y = e.clientY - gameContainerRect.top - player.offsetHeight / 2;
});

// 讓玩家朝目標移動
function movePlayer() {
  let dx = targetPos.x - playerPos.x;
  let dy = targetPos.y - playerPos.y;
  let dist = Math.sqrt(dx * dx + dy * dy);
  let speed = 4;  // 人物移動速度

  if (dist > speed) {
    playerPos.x += (dx / dist) * speed;
    playerPos.y += (dy / dist) * speed;

    // 邊界檢查，防止人物超出遊戲區域
    const gameContainer = document.getElementById('game-container');
    const gameRect = gameContainer.getBoundingClientRect();

    // 確保人物位置不會超過邊界
    playerPos.x = Math.max(gameRect.left, Math.min(playerPos.x, gameRect.right - player.offsetWidth));
    playerPos.y = Math.max(gameRect.top, Math.min(playerPos.y, gameRect.bottom - player.offsetHeight));

    player.style.left = playerPos.x + 'px';
    player.style.top = playerPos.y + 'px';
  }
}

// 生成敵人
function spawnEnemy() {
  const enemyObj = {
    pos: getRandomPosition(),  // 隨機生成敵人位置並檢查是否與其他敵人重疊
    speed: 2,  // 敵人初速度設定為2
    element: document.createElement('div')
  };

  enemyObj.element.classList.add('enemy');  // 為敵人元素添加CSS類
  enemyObj.element.style.position = 'absolute';
  enemyObj.element.style.width = '50px';
  enemyObj.element.style.height = '50px';
  enemyObj.element.style.backgroundImage = 'url("https://i.imgur.com/NPnmEtr.png")';
  enemyObj.element.style.backgroundSize = 'cover';
  enemyObj.element.style.backgroundRepeat = 'no-repeat';
  document.getElementById('game-container').appendChild(enemyObj.element);

  // 設置敵人的位置
  enemyObj.element.style.left = enemyObj.pos.x + 'px';
  enemyObj.element.style.top = enemyObj.pos.y + 'px';

  enemies.push(enemyObj);  // 添加到敵人陣列

  // 開始移動敵人
  setInterval(() => moveEnemy(enemyObj), 30); // 每30ms更新一次
}

// 隨機生成敵人位置並檢查是否與其他敵人重疊
function getRandomPosition() {
  const minDist = 60; // 最小距離，避免敵人太靠近
  let newPos;
  let overlap = true;

  while (overlap) {
    overlap = false;
    newPos = {
      x: Math.random() * (window.innerWidth - 50),
      y: Math.random() * (window.innerHeight - 50)
    };

    // 檢查新位置是否與現有敵人重疊
    for (let i = 0; i < enemies.length; i++) {
      let dist = Math.sqrt(
        Math.pow(newPos.x - enemies[i].pos.x, 2) + Math.pow(newPos.y - enemies[i].pos.y, 2)
      );
      if (dist < minDist) {
        overlap = true;
        break;
      }
    }
  }

  return newPos;
}

// 敵人移動
function moveEnemy(enemyObj) {
  if (!gameRunning || isVideoPlaying()) return; // 影片播放中不處理敵人移動

  let dx = playerPos.x - enemyObj.pos.x;
  let dy = playerPos.y - enemyObj.pos.y;
  let dist = Math.sqrt(dx * dx + dy * dy);
  let speed = enemyObj.speed;  // 每個敵人的移動速度

  if (dist > speed) {
    enemyObj.pos.x += (dx / dist) * speed;
    enemyObj.pos.y += (dy / dist) * speed;
    enemyObj.element.style.left = enemyObj.pos.x + 'px';
    enemyObj.element.style.top = enemyObj.pos.y + 'px';
  }

  // 檢查敵人間的碰撞
  avoidEnemyCollision(enemyObj);

  checkCollision(enemyObj); // 檢查是否碰撞
}

// 檢查敵人之間的碰撞並避開
function avoidEnemyCollision(enemyObj) {
  const minDist = 60; // 設定敵人之間的最小距離

  enemies.forEach(otherEnemy => {
    if (enemyObj === otherEnemy) return; // 跳過自己

    let dx = enemyObj.pos.x - otherEnemy.pos.x;
    let dy = enemyObj.pos.y - otherEnemy.pos.y;
    let dist = Math.sqrt(dx * dx + dy * dy);

    // 如果兩個敵人太近，就避開
    if (dist < minDist) {
      // 計算避免重疊的方向
      let angle = Math.atan2(dy, dx);
      let offsetX = Math.cos(angle) * (minDist - dist);
      let offsetY = Math.sin(angle) * (minDist - dist);

      // 調整敵人的位置
      enemyObj.pos.x += offsetX;
      enemyObj.pos.y += offsetY;
      enemyObj.element.style.left = enemyObj.pos.x + 'px';
      enemyObj.element.style.top = enemyObj.pos.y + 'px';
    }
  });
}

// 檢查碰撞
function checkCollision(enemyObj) {
  if (!gameRunning || isVideoPlaying()) return; // 影片播放中不處理碰撞檢查

  let playerRect = player.getBoundingClientRect();
  let enemyRect = enemyObj.element.getBoundingClientRect();

  if (
    playerRect.right > enemyRect.left &&
    playerRect.left < enemyRect.right &&
    playerRect.bottom > enemyRect.top &&
    playerRect.top < enemyRect.bottom
  ) {
    hitSound.play();
    showVideo(); // 播放影片
  }
}

// 更新遊戲狀態
function updateGame() {
  if (!gameRunning || isVideoPlaying()) return; // 如果影片正在播放，不進行更新

  time++;
  timeEl.textContent = time;
  score++;
  scoreEl.textContent = score;

  movePlayer();  // 讓玩家移動
}

// 顯示影片
function showVideo() {
  endVideo.src = 'https://www.youtube.com/embed/Qybud8_paik?autoplay=1';
  videoOverlay.style.display = 'flex';
  gameRunning = false; // 暫停遊戲

  // 影片播放 9 秒後關閉
  setTimeout(() => {
    videoOverlay.style.display = 'none'; // 隱藏影片
    resetGame(); // 重置遊戲狀態
  }, 9000); // 9秒後重啟遊戲
}

// 重置遊戲狀態
function resetGame() {
  // 清除定時器
  clearInterval(gameInterval);

  // 重新初始化遊戲狀態
  score = 0;
  time = 0;
  scoreEl.textContent = score;
  timeEl.textContent = time;

  // 重新設定玩家位置
  playerPos.x = 200;
  playerPos.y = 200;
  player.style.left = playerPos.x + 'px';
  player.style.top = playerPos.y + 'px';

  // 清除所有敵人
  enemies.forEach(enemyObj => enemyObj.element.remove());
  enemies = []; // 清空敵人陣列

  // 重新生成敵人並啟動敵人移動
  spawnEnemy();

  // 重啟遊戲定時器
  gameRunning = true;
  gameInterval = setInterval(updateGame, 1000 / 60); // 更新遊戲狀態
}

// 檢查影片是否正在播放
function isVideoPlaying() {
  return videoOverlay.style.display === 'flex';
}
