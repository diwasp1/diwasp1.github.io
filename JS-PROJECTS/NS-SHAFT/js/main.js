// CANVAS
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// CANVAS SIZE
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGTH;

// LOAD IMAGE

// CREATE PLATFORMS

class Platform {
  constructor(type, src, x, y, width, height, frameX, frameY, id) {
    this.type = type;
    this.src = src;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.frameX = frameX;
    this.frameY = frameY;
    this.speed = 1.5;
    this.counted = false;
    this.id = id;
  }

  draw() {
    const platformSprite = new Image();
    platformSprite.src = this.src;
    ctx.drawImage(
      platformSprite,
      this.width * this.frameX,
      this.height * this.frameY,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
  update() {
    this.draw();
    this.speed = gameSpeed;
    this.y -= this.speed;
  }
}

// VARIABLES
let animationId;
let background;
let player;
let keys = [];
let collide;
let checkGameOver;
let platforms;
let frame;
let life;
let gameScore;
let counter;
let highScore;
let newHighScore;
let fake;
let spike;
let trampoline;
let lastCollisionFrame;
let platformId;
let platformCount;
let sound = true;
let pause = false;
let gameSpeed;
let platformFrame;
let gameOverContainer;

// INIT FUNCTION
function init() {
  keys = [];
  platforms = [];
  platformId = [];
  platformCount = 0;
  background = new Background();
  boundries = new Boundries();
  player = new Player(184, 200, PLAYER_WIDTH, PLAYER_HEIGHT, 0, 4, 5);
  collide = false;
  checkGameOver = false;
  frame = 0;
  life = 10;
  gameScore = 0;
  lastCollisionFrame = 0;
  highScore = localStorage.getItem("highscore")
    ? localStorage.getItem("highscore")
    : 0;
  newHighScore = 0;
  gameSpeed = 1.5;
  platformFrame = 70;

  // KEYS CONTROLS
  addEventListener("keydown", (e) => {
    keys[e.keyCode] = true;
  });

  addEventListener("keyup", (e) => {
    delete keys[e.keyCode];
    player.left = false;
    player.right = false;
  });

  updateLife(life);

  if (sound) {
    backgroundSound.play();
    backgroundSound.loop = true;
  }
}

// PLAYER MOVEMENT
function movePlayer() {
  if ((keys[37] || keys[65]) && player.x > WALL_WIDTH) {
    player.x -= player.moveSpeed;
    player.left = true;
  }

  if (
    (keys[39] || keys[68]) &&
    player.x < canvas.width - player.width - WALL_WIDTH
  ) {
    player.x += player.moveSpeed;
    player.right = true;
  }
}

// GENERATE PLATFORMS
function generatePlatforms() {
  if (frame % platformFrame === 0) {
    let x = Math.random() * 320;
    let y = CANVAS_HEIGTH - 50;
    let random = Math.random() * 100;
    let platform;
    platformCount += 1;
    if (random < 40) {
      platform = new Platform(
        "shaft",
        "./assets/images/shaft.png",
        x,
        y,
        95,
        16,
        0,
        0,
        platformCount
      );
    } else if (random < 50) {
      platform = new Platform(
        "spike",
        "./assets/images/spiking.png",
        x,
        y,
        96,
        31,
        0,
        0,
        platformCount
      );
    } else if (random < 60) {
      platform = new Platform(
        "conveyorLeft",
        "./assets/images/conveyor_left.png",
        x,
        y,
        96,
        16,
        0,
        0,
        platformCount
      );
    } else if (random < 70) {
      platform = new Platform(
        "conveyorRight",
        "./assets/images/conveyor_right.png",
        x,
        y,
        96,
        16,
        0,
        0,
        platformCount
      );
    } else if (random < 80) {
      platform = new Platform(
        "trampoline",
        "./assets/images/trampoline.png",
        x,
        y,
        97,
        22,
        0,
        4,
        platformCount
      );
    } else {
      platform = new Platform(
        "fake",
        "./assets/images/fake.png",
        x,
        y,
        97,
        36,
        0,
        0,
        platformCount
      );
    }
    platforms.push(platform);
  }

  platforms.forEach((platform, index) => {
    platform.update();

    if (platform.y < 0) {
      platforms.splice(index, 1);
    }
  });
}

// CHECK COLLISION
function checkCollision() {
  for (var i = 0; i < platforms.length; i++) {
    if (
      player.x + 2 < platforms[i].x + platforms[i].width &&
      player.x + player.width > platforms[i].x &&
      player.y < platforms[i].y &&
      player.y + player.height > platforms[i].y
    ) {
      if (!platformId.includes(platforms[i].id)) {
        if (sound) {
          hitSound.play();
        }

        // console.log("collision");
      }
      // console.log("collide");
      lastCollisionFrame = frame;
      if (platforms[i].type == "fake") {
        collide = false;
        fake = true;
      } else if (platforms[i].type == "spike") {
        spike = true;
        collide = true;
        player.y = platforms[i].y - player.height;
        if (!platformId.includes(platforms[i].id)) {
          decreaseLife();
        }
      } else if (platforms[i].type == "trampoline") {
        trampoline = true;
        collide = true;
        player.y = platforms[i].y - player.height;
      } else if (platforms[i].type == "shaft") {
        collide = true;
        player.y = platforms[i].y - player.height;
        if (!platformId.includes(platforms[i].id)) {
          increseLife();
        }
      } else {
        collide = true;
        player.y = platforms[i].y - player.height;
      }
      platformId.push(platforms[i].id);
      platformEffect(platforms[i]);
    } else {
      if (frame > lastCollisionFrame + 1) {
        // console.log("notcollide");
        collide = false;
        spike = false;
      }
    }

    platformAnimate(platforms[i]);
  }
}

// PLATFORM EFFECTS
function platformAnimate(platform) {
  if (platform.type == "conveyorLeft" || platform.type == "conveyorRight") {
    if (frame % 10 === 0) {
      if (platform.frameY >= 3) {
        platform.frameY = 0;
      } else {
        platform.frameY++;
      }
    }
  } else if (platform.type == "trampoline" && trampoline) {
    if (platform.frameY >= 4) {
      platform.frameY = 0;
    } else {
      platform.frameY++;
    }
    trampoline = false;
  } else if (platform.type == "fake" && fake) {
    if (platform.frameY >= 5) {
      platform.frameY = 0;
    } else {
      platform.frameY++;
    }
    fake = false;
  }
}

function platformEffect(platform) {
  if (platform.type == "conveyorRight") {
    if (player.x < canvas.width - player.width - WALL_WIDTH) {
      player.x += 2;
    }
  } else if (platform.type == "conveyorLeft") {
    if (player.x > WALL_WIDTH) {
      player.x -= 2;
    }
  } else if (platform.type == "trampoline") {
    player.y -= 60;
  } else if (platform.type == "spike") {
    player.life -= 3;
  } else if (platform.type == "shaft") {
  } else if (platform.type == "fake") {
  }
  player.gravitySpeed = 0;
}

// LIFE UPDATE
function updateLife(counter) {
  const lifeElements = document.querySelectorAll(".life");

  for (var i = 0; i < lifeElements.length; i++) {
    lifeElements[i].remove();
  }
  for (var i = 0; i < counter; i++) {
    var lifeElement = document.createElement("div");
    lifeElement.setAttribute("class", "life");
    lifeElement.style.display = "iniline-block";
    lifeValue.appendChild(lifeElement);
  }
}

function increseLife() {
  life += 2;
  if (life > 10) {
    life = 10;
  }
  updateLife(life);
}
function decreaseLife() {
  life -= 3;
  if (life <= 0) {
    checkGameOver = true;
  }
  updateLife(life);
}

// UPADTE SCORE
function updateScore() {
  scoreValue.innerText = gameScore;
}

function updateRecord() {
  if (gameScore > highScore) {
    recordValue.innerText = gameScore;
  } else {
    recordValue.innerText = highScore;
  }
}

function updateHighScore(newScore) {
  localStorage.setItem("highscore", newScore);
  highScore = newScore;
}

// GAMEOVER
function gameOver() {
  if (sound) {
    dieSound.play();
    menuSound.play();
    menuSound.loop = true;
    backgroundSound.pause();
  }

  cancelAnimationFrame(animationId);
  console.log("gameover");

  if (highScore < gameScore) {
    newHighScore = 1;
    updateHighScore(gameScore);
  }
  gameOverBackground();
}

// GAMEOVER BACKGROUND
function gameOverBackground() {
  gameOverContainer = document.createElement("div");
  gameOverContainer.setAttribute("id", "gameoverContainer");
  gameContainer.appendChild(gameOverContainer);

  var gameOverElement = document.createElement("div");
  gameOverElement.setAttribute("id", "gameover");
  gameOverContainer.appendChild(gameOverElement);

  var gameOverAlert = document.createElement("div");
  gameOverAlert.setAttribute("id", "gameover-alert");
  gameOverAlert.innerText = "GAME OVER";
  gameOverElement.appendChild(gameOverAlert);

  // score
  var gameOverText = document.createElement("div");
  gameOverText.setAttribute("id", "gameover-text");
  gameOverElement.appendChild(gameOverText);

  var gameOverScore = document.createElement("div");
  gameOverScore.setAttribute("id", "gameover-score");
  gameOverScore.innerText = `SCORE ${gameScore}`;
  gameOverText.appendChild(gameOverScore);

  var gameOverHighScore = document.createElement("div");
  gameOverHighScore.setAttribute("id", "gameover-high-score");
  gameOverHighScore.innerText = `RECORD ${highScore} `;
  gameOverText.appendChild(gameOverHighScore);

  //play again
  var gameOverButton = document.createElement("div");
  gameOverButton.setAttribute("id", "gameover-button");
  gameOverElement.appendChild(gameOverButton);

  var gameOverPlayAgain = document.createElement("button");
  gameOverPlayAgain.setAttribute("id", "gameover-play-again");
  gameOverPlayAgain.innerText = "RESTART";
  gameOverButton.appendChild(gameOverPlayAgain);

  var gameOverReset = document.createElement("button");
  gameOverReset.setAttribute("id", "gameover-reset");
  gameOverReset.innerText = "RESET";
  gameOverButton.appendChild(gameOverReset);

  var scoreInformation = document.createElement("div");
  scoreInformation.setAttribute("id", "score-information");

  if (newHighScore) {
    scoreInformation.innerText = "new high score recorded";
  } else if (highScore > gameScore) {
    scoreInformation.innerText = "try again";
  } else if (highScore == gameScore) {
    if (!newHighScore && highScore != 0) {
      scoreInformation.innerText = "don't give up almost there";
    }
  }

  gameOverElement.appendChild(scoreInformation);

  gameOverReset.addEventListener("click", () => {
    gameContainer.removeChild(gameOverContainer);
    gameOverElement.style.display = "none";
    startgame.style.display = "flex";
    scoreboard.style.display = "none";
    col1.style.display = "none";
    col2.style.display = "none";
    updateHighScore(0);
    menuSound.pause();
  });

  gameOverPlayAgain.addEventListener("click", () => {
    gameContainer.removeChild(gameOverContainer);
    gameOverElement.style.display = "none";
    init();
    animate();
    menuSound.pause();
  });
}

// ANIMATE FUNCTION
function animate() {
  animationId = requestAnimationFrame(animate);
  if (!pause) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    background.draw();

    player.draw();
    movePlayer();
    player.update();
    generatePlatforms();

    if (frame % 120 == 0) {
      gameScore++;
      updateScore();
    }
    checkCollision();

    if (checkGameOver) {
      gameOver();
    }
    console.log(player.gravitySpeed);

    boundries.draw();
    frame++;

    updateRecord();

    if (frame % 600 === 0 && gameSpeed < 3) {
      gameSpeed += 0.2;
      platformFrame -= 3;
    }
  } else {
    return;
  }
}
