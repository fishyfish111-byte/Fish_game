const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const statusEl = document.getElementById('status');
const restartBtn = document.getElementById('restartButton');
const width = canvas.width;
const height = canvas.height;
let animationActive = false;

const submarine = {
  x: 80,
  y: height / 2,
  width: 88,
  height: 42,
  speed: 4,
  dx: 0,
  dy: 0,
  oxygen: 100,
  color: '#ffd966'
};

const treasure = {
  x: 700,
  y: Math.random() * (height - 80) + 40,
  radius: 22,
  collected: false
};

const creatures = [];
let score = 0;
let gameOver = false;
let frames = 0;

function createCreature() {
  const typeRoll = Math.random();
  const size = Math.random() * 28 + 36;
  const creature = {
    x: width + size + 80,
    y: Math.random() * (height - size - 60) + 30,
    width: size * 1.6,
    height: size,
    speed: 0,
    color: '#7a7a7a',
    type: 'shark',
    ability: 'Deadly collision'
  };

  if (typeRoll < 0.5) {
    creature.type = 'shark';
    creature.speed = Math.random() * 4.5 + 6;
    creature.color = '#7a7a7a';
  } else if (typeRoll < 0.85) {
    creature.type = 'jellyfish';
    creature.speed = Math.random() * 3 + 3;
    creature.width = size * 1.2;
    creature.height = size * 1.2;
    creature.color = '#7ef9ff';
    creature.ability = 'Zaps oxygen on touch';
  } else {
    creature.type = 'dolphin';
    creature.speed = Math.random() * 1.5 + 1.8;
    creature.width = size * 1.4;
    creature.height = size * 0.8;
    creature.color = '#84d7ff';
    creature.ability = 'Restores oxygen';
  }

  creatures.push(creature);
}

function resetTreasure() {
  treasure.x = Math.random() * 320 + 900;
  treasure.y = Math.random() * (height - 120) + 60;
  treasure.collected = false;
}

function resetGame() {
  submarine.x = 80;
  submarine.y = height / 2;
  submarine.dx = 0;
  submarine.dy = 0;
  submarine.oxygen = 100;
  treasure.collected = false;
  resetTreasure();
  creatures.length = 0;
  score = 0;
  gameOver = false;
  frames = 0;
  statusEl.textContent = 'Mission restarted! Find the treasure!';
  scoreEl.textContent = 'Score: 0 | Oxygen: 100%';
  if (!animationActive) {
    loop();
  }
}

restartBtn.addEventListener('click', resetGame);

window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowUp':
    case 'w':
    case 'W':
      event.preventDefault();
      submarine.dy = -submarine.speed;
      break;
    case 'ArrowDown':
    case 's':
    case 'S':
      event.preventDefault();
      submarine.dy = submarine.speed;
      break;
    case 'ArrowLeft':
    case 'a':
    case 'A':
      event.preventDefault();
      submarine.dx = -submarine.speed;
      break;
    case 'ArrowRight':
    case 'd':
    case 'D':
      event.preventDefault();
      submarine.dx = submarine.speed;
      break;
  }
});

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'ArrowUp':
    case 'w':
    case 'W':
    case 'ArrowDown':
    case 's':
    case 'S':
      event.preventDefault();
      submarine.dy = 0;
      break;
    case 'ArrowLeft':
    case 'a':
    case 'A':
    case 'ArrowRight':
    case 'd':
    case 'D':
      event.preventDefault();
      submarine.dx = 0;
      break;
  }
});

function drawSubmarine() {
  ctx.save();
  ctx.fillStyle = submarine.color;
  ctx.beginPath();
  ctx.ellipse(submarine.x, submarine.y, submarine.width / 2, submarine.height / 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#2e3b4e';
  ctx.fillRect(submarine.x - 14, submarine.y - 12, 36, 24);
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(submarine.x - 20, submarine.y, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawTreasure() {
  if (treasure.collected) return;
  ctx.save();
  ctx.fillStyle = '#f9a825';
  ctx.fillRect(treasure.x - 18, treasure.y - 18, 36, 28);
  ctx.fillStyle = '#af6c00';
  ctx.fillRect(treasure.x - 18, treasure.y - 18, 36, 8);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(treasure.x - 10, treasure.y - 4, 20, 4);
  ctx.restore();
}

function drawCreature(creature) {
  ctx.save();
  ctx.fillStyle = creature.color;

  if (creature.type === 'shark') {
    ctx.beginPath();
    ctx.moveTo(creature.x, creature.y + creature.height / 2);
    ctx.quadraticCurveTo(creature.x + creature.width / 2, creature.y - creature.height / 2, creature.x + creature.width, creature.y + creature.height / 2);
    ctx.quadraticCurveTo(creature.x + creature.width / 2, creature.y + creature.height * 1.2, creature.x, creature.y + creature.height / 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(creature.x + creature.width * 0.75, creature.y + creature.height * 0.35, creature.height * 0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(creature.x + creature.width * 0.78, creature.y + creature.height * 0.35, creature.height * 0.06, 0, Math.PI * 2);
    ctx.fill();
  } else if (creature.type === 'jellyfish') {
    ctx.beginPath();
    ctx.arc(creature.x + creature.width / 2, creature.y + creature.height / 2, creature.width / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#b1f7ff';
    ctx.beginPath();
    ctx.moveTo(creature.x + creature.width * 0.25, creature.y + creature.height * 0.85);
    ctx.quadraticCurveTo(creature.x + creature.width * 0.5, creature.y + creature.height * 1.1, creature.x + creature.width * 0.75, creature.y + creature.height * 0.85);
    ctx.quadraticCurveTo(creature.x + creature.width * 0.5, creature.y + creature.height * 1.05, creature.x + creature.width * 0.25, creature.y + creature.height * 0.85);
    ctx.fill();
  } else if (creature.type === 'dolphin') {
    ctx.beginPath();
    ctx.ellipse(creature.x + creature.width / 2, creature.y + creature.height / 2, creature.width / 2, creature.height / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(creature.x + creature.width * 0.35, creature.y + creature.height / 2, creature.height * 0.14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(creature.x + creature.width * 0.35, creature.y + creature.height / 2, creature.height * 0.06, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawCreatures() {
  creatures.forEach(drawCreature);
}

function drawBackground() {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#0b2a4f');
  gradient.addColorStop(1, '#001923');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  for (let i = 0; i < 60; i += 1) {
    const x = (i * 85) % width;
    const y = ((frames + i * 37) * 3) % height;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.beginPath();
    ctx.arc(x, y, 2.2, 0, Math.PI * 2);
    ctx.fill();
  }
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function collisionRectCircle(rect, circle) {
  const distX = Math.abs(circle.x - rect.x - rect.width / 2);
  const distY = Math.abs(circle.y - rect.y - rect.height / 2);
  if (distX > rect.width / 2 + circle.radius || distY > rect.height / 2 + circle.radius) {
    return false;
  }
  if (distX <= rect.width / 2 || distY <= rect.height / 2) {
    return true;
  }
  const dx = distX - rect.width / 2;
  const dy = distY - rect.height / 2;
  return dx * dx + dy * dy <= circle.radius * circle.radius;
}

function checkCollisions() {
  const subRect = { x: submarine.x - submarine.width / 2, y: submarine.y - submarine.height / 2, width: submarine.width, height: submarine.height };
  if (!treasure.collected && collisionRectCircle(subRect, treasure)) {
    treasure.collected = true;
    score += 250;
    statusEl.textContent = 'Treasure recovered! Head for the surface!';
  }

  for (let i = creatures.length - 1; i >= 0; i -= 1) {
    const creature = creatures[i];
    const creatureRect = { x: creature.x, y: creature.y, width: creature.width, height: creature.height };
    if (collisionRectCircle(creatureRect, { x: submarine.x, y: submarine.y, radius: submarine.height / 2 })) {
      if (creature.type === 'shark') {
        gameOver = true;
        statusEl.textContent = 'A shark got you! Mission failed.';
        break;
      }
      if (creature.type === 'jellyfish') {
        submarine.oxygen = Math.max(0, submarine.oxygen - 35);
        statusEl.textContent = 'A jellyfish zapped your oxygen!';
        creatures.splice(i, 1);
        continue;
      }
      if (creature.type === 'dolphin') {
        submarine.oxygen = Math.min(100, submarine.oxygen + 22);
        score += 50;
        statusEl.textContent = 'A friendly dolphin restored oxygen!';
        creatures.splice(i, 1);
        continue;
      }
    }
  }
}

function update() {
  if (gameOver) return;
  frames += 1;
  submarine.x += submarine.dx;
  submarine.y += submarine.dy;
  submarine.x = clamp(submarine.x, submarine.width / 2, width - submarine.width / 2);
  submarine.y = clamp(submarine.y, submarine.height / 2, height - submarine.height / 2);

  creatures.forEach((creature) => {
    creature.x -= creature.speed;
  });

  if (frames % 35 === 0) {
    createCreature();
  }

  for (let i = creatures.length - 1; i >= 0; i -= 1) {
    if (creatures[i].x + creatures[i].width < -50) {
      creatures.splice(i, 1);
      score += 10;
    }
  }

  if (treasure.collected && submarine.y < 80) {
    gameOver = true;
    statusEl.textContent = 'You surfaced with the treasure! Victory!';
    score += 500;
  }

  submarine.oxygen -= 0.08;
  if (submarine.oxygen <= 0) {
    submarine.oxygen = 0;
    gameOver = true;
    statusEl.textContent = 'Out of oxygen! Mission failed.';
  }

  if (!gameOver && score >= 1000) {
    statusEl.textContent = 'Keep going! The treasure is waiting.';
  }

  checkCollisions();
  scoreEl.textContent = `Score: ${Math.floor(score)} | Oxygen: ${Math.floor(submarine.oxygen)}%`;
}

function drawOxygenBar() {
  const barWidth = 260;
  const barHeight = 12;
  const x = width - barWidth - 20;
  const y = 20;
  ctx.save();
  ctx.fillStyle = '#002b4c';
  ctx.fillRect(x, y, barWidth, barHeight);
  ctx.fillStyle = submarine.oxygen > 40 ? '#4caf50' : submarine.oxygen > 15 ? '#ffb300' : '#f44336';
  ctx.fillRect(x, y, (barWidth * submarine.oxygen) / 100, barHeight);
  ctx.strokeStyle = '#ffffff';
  ctx.strokeRect(x, y, barWidth, barHeight);
  ctx.fillStyle = '#eef7ff';
  ctx.font = '12px Arial';
  ctx.fillText('OXYGEN', x, y - 6);
  ctx.restore();
}

function drawGoalMarker() {
  ctx.save();
  ctx.strokeStyle = '#8ce6ff';
  ctx.setLineDash([6, 8]);
  ctx.strokeRect(10, 10, 120, 70);
  ctx.fillStyle = '#8ce6ff';
  ctx.font = '14px Arial';
  ctx.fillText('SURFACE', 18, 36);
  ctx.fillText('SAFE ZONE', 18, 54);
  ctx.restore();
}

function draw() {
  drawBackground();
  drawGoalMarker();
  drawTreasure();
  drawCreatures();
  drawSubmarine();
  drawOxygenBar();
}

function loop() {
  animationActive = true;
  update();
  draw();
  if (!gameOver) {
    requestAnimationFrame(loop);
  } else {
    animationActive = false;
  }
}

loop();
