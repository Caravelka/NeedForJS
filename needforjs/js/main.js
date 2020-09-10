const score = document.querySelector(".score"),
  start = document.querySelector(".start"),
  gameArea = document.querySelector(".gameArea"),
  car = document.createElement("div"),
  btnEasy = document.querySelector(".easy"),
  btnMedium = document.querySelector(".medium"),
  btnHard = document.querySelector(".hard"),
  container = document.querySelector(".container");

car.classList.add("car");

btnEasy.addEventListener("click", speedEasy);
btnMedium.addEventListener("click", speedMedium);
btnHard.addEventListener("click", speedHard);
document.addEventListener("keydown", startRun);
document.addEventListener("keyup", stopRun);

let permitStart = false;

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false,
};

const setting = {
  start: false,
  score: 0,
  speed: 0,
  traffic: 3,
};

function getQuantityElements(heightElement) {
  return document.documentElement.clientHeight / (heightElement + 1);
}

// permit - уровень сложности выбран

function speedEasy() {
  setting.speed += 5;
  permitStart = true;
  startGame();
}

function speedMedium() {
  setting.speed += 10;
  permitStart = true;
  startGame();
}

function speedHard() {
  setting.speed += 15;
  permitStart = true;
  startGame();
}

function startGame() {

  for (let i = 0; i < getQuantityElements(100); i++) {
    const line = document.createElement("div");
    line.classList.add("line");
    line.style.top = i * 100 + "px";
    line.y = i * 100;
    gameArea.appendChild(line);
  }

  for (let i = 0; i < getQuantityElements(100 * setting.traffic); i++) {
    const enemy = document.createElement("div");
    enemy.classList.add("enemy");
    enemy.y = -100 * setting.traffic * (i + 1);
    enemy.style.left =
      Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + "px";
    enemy.style.top = enemy.y + "px";
    enemy.style.background =
      "transparent url(../img/player.png) center / cover no-repeat";
    gameArea.appendChild(enemy);
  }
  if (permitStart) {
    setting.start = true;
    btnEasy.classList.add("hide");
    btnMedium.classList.add("hide");
    btnHard.classList.add("hide");
  }
  setting.score = false;
  gameArea.appendChild(car);
  setting.x = car.offsetLeft;
  setting.y = car.offsetTop;
  requestAnimationFrame(playGame);
}

function playGame() {
  if (setting.start) {
    setting.score += setting.speed;
    score.textContent = "score:" + setting.score;

    moveRoad();
    moveEnemy();
    if (keys.ArrowLeft && setting.x > 0) {
      setting.x -= setting.speed;
    }
    if (keys.ArrowRight && setting.x < gameArea.offsetWidth - car.offsetWidth) {
      setting.x += setting.speed;
    }
    if (
      keys.ArrowDown &&
      setting.y < gameArea.offsetHeight - car.offsetHeight
    ) {
      setting.y += setting.speed;
    }
    if (keys.ArrowUp && setting.y > 0) {
      setting.y -= setting.speed;
    }
    car.style.left = setting.x + "px";
    car.style.top = setting.y + "px";
    requestAnimationFrame(playGame);
  }
}

function startRun(event) {
  event.preventDefault();
  keys[event.key] = true;
}

function stopRun(event) {
  event.preventDefault();
  keys[event.key] = false;
}

function moveRoad() {
  let lines = document.querySelectorAll(".line");
  lines.forEach(function (line) {
    line.y += setting.speed;
    line.style.top = line.y + "px";
    if (line.y > document.documentElement.clientHeight) {
      line.y = -100;
    }
  });
}

function moveEnemy() {
  let enemy = document.querySelectorAll(".enemy");
  enemy.forEach(function (item) {
    let carRect = car.getBoundingClientRect();
    let enemyRect = item.getBoundingClientRect();
    item.y += setting.speed / 2;
    item.style.top = item.y + "px";
    if (item.y >= document.documentElement.clientHeight) {
      item.y = -100 * setting.traffic;
      item.style.left =
        Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + "px";
    }

    if (
      carRect.top <= enemyRect.bottom &&
      carRect.right >= enemyRect.left &&
      carRect.left <= enemyRect.right &&
      carRect.bottom >= enemyRect.top
    ) {
      console.warn("dtp");
      setting.start = false;
      setting.speed = 0;
      setting.score = 0;
      btnEasy.classList.remove("hide");
      btnMedium.classList.remove("hide");
      btnHard.classList.remove("hide");
      score.style.top = container.offsetHeight + 20 + "px";
      gameArea.innerHTML = "";
    }
  });
}
