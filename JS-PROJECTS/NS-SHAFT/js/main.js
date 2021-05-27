// CANVAS
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// CANVAS SIZE
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGTH;

// VARIABLES
let animationId;
let background;
let player;
let keys = [];
let collide;
let checkGameOver;
let platforms;
let platform;
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
  player = new Player(
    INITIAL_PLAYER_POSITION_X,
    INITIAL_PLAYER_POSITION_Y,
    PLAYER_WIDTH,
    PLAYER_HEIGHT,
    INITIAL_PLAYER_FRAME_X,
    INITIAL_PLAYER_FRAME_Y,
    PLAYER_MOVE_SPEED
  );
  collide = false;
  checkGameOver = false;
  frame = 0;
  life = INITIAL_LIFE;
  gameScore = 0;
  lastCollisionFrame = 0;
  highScore = localStorage.getItem("nsshaft-highscore")
    ? localStorage.getItem("nsshaft-highscore")
    : 0;
  newHighScore = 0;
  gameSpeed = INITIAL_GAME_SPEED;
  platformFrame = INITIAL_PLATFORM_FRAME_RATE;

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

  // GENERATE SHAFT AT FIRST LOAD
  platform = new Platform(
    "shaft",
    "./assets/images/shaft.png",
    Math.random() * 320,
    500,
    SHAFT_WIDTH,
    SHAFT_HEIGHT,
    PLATFORM_FRAME_X,
    PLATFORM_FRAME_Y,
    platformCount
  );
  platforms.push(platform);
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
    let y = CANVAS_HEIGTH;
    let random = Math.random() * 100;
    platformCount += 1;

    if (random < 30) {
      platform = new Platform(
        "shaft",
        "./assets/images/shaft.png",
        x,
        y,
        SHAFT_WIDTH,
        SHAFT_HEIGHT,
        PLATFORM_FRAME_X,
        PLATFORM_FRAME_Y,
        platformCount
      );
    } else if (random < 45) {
      platform = new Platform(
        "spike",
        "./assets/images/spiking.png",
        x,
        y,
        SPIKE_WIDTH,
        SPIKE_HEIGHT,
        PLATFORM_FRAME_X,
        PLATFORM_FRAME_Y,
        platformCount
      );
    } else if (random < 60) {
      platform = new Platform(
        "conveyorLeft",
        "./assets/images/conveyor_left.png",
        x,
        y,
        CONVEYOR_WIDTH,
        CONVEYOR_HEIGHT,
        PLATFORM_FRAME_X,
        PLATFORM_FRAME_Y,
        platformCount
      );
    } else if (random < 75) {
      platform = new Platform(
        "conveyorRight",
        "./assets/images/conveyor_right.png",
        x,
        y,
        CONVEYOR_WIDTH,
        CONVEYOR_HEIGHT,
        PLATFORM_FRAME_X,
        PLATFORM_FRAME_Y,
        platformCount
      );
    } else if (random < 90) {
      platform = new Platform(
        "trampoline",
        "./assets/images/trampoline.png",
        x,
        y,
        TRAMPOLINE_WIDTH,
        TRAMPOLINE_HEIGHT,
        PLATFORM_FRAME_X,
        TRAMPOLINE_FRAME_Y,
        platformCount
      );
    } else {
      platform = new Platform(
        "fake",
        "./assets/images/fake.png",
        x,
        y,
        FAKE_WIDTH,
        FAKE_HEIGHT,
        PLATFORM_FRAME_X,
        PLATFORM_FRAME_Y,
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
      player.x < platforms[i].x + platforms[i].width &&
      player.x + player.width > platforms[i].x &&
      player.y < platforms[i].y &&
      player.y + player.height > platforms[i].y
    ) {
      if (!platformId.includes(platforms[i].id)) {
        if (sound) {
          hitSound.play();
        }
      }
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
    if (frame % SPRITE_FRAME_RATE === 0) {
      if (platform.frameY >= MAX_CONVEYOR_SPRITE_FRAME) {
        platform.frameY = INITIAL_SPRITE_FRAME;
      } else {
        platform.frameY++;
      }
    }
  } else if (platform.type == "trampoline" && trampoline) {
    if (platform.frameY >= MAX_TRAMPOLINE_SPRITE_FRAME) {
      platform.frameY = INITIAL_SPRITE_FRAME;
    } else {
      platform.frameY++;
    }
    trampoline = false;
  } else if (platform.type == "fake" && fake) {
    if (platform.frameY >= MAX_FAKE_SPRITE_FRAME) {
      platform.frameY = INITIAL_SPRITE_FRAME;
    } else {
      platform.frameY++;
    }
    fake = false;
  }
}

function platformEffect(platform) {
  if (platform.type == "conveyorRight") {
    if (player.x < canvas.width - player.width - WALL_WIDTH) {
      player.x += CONVEYOR_EFFECT;
    }
  } else if (platform.type == "conveyorLeft") {
    if (player.x > WALL_WIDTH) {
      player.x -= CONVEYOR_EFFECT;
    }
  } else if (platform.type == "trampoline") {
    player.y -= TRAMPOLINE_EFFECT;
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
  life += INCREASE_LIFE_RATE;
  if (life > MAX_LIFE) {
    life = MAX_LIFE;
  }
  updateLife(life);
}
function decreaseLife() {
  life -= DECREASE_LIFE_RATE;
  if (life <= MIN_LIFE) {
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
  localStorage.setItem("nsshaft-highscore", newScore);
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
  // console.log("gameover");

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
    scoreInformation.innerText = "Congratulations new high score recorded";
  } else if (highScore > gameScore) {
    scoreInformation.innerText = "Try again";
  } else if (highScore == gameScore) {
    if (!newHighScore && highScore != 0) {
      scoreInformation.innerText = "Don't give up almost there";
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
    // updateHighScore(0);
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

    // INCRESE SCORE
    if (frame % SCORE_FRAME_RATE == 0) {
      gameScore++;
      updateScore();
    }
    // INCRESE GAME SPEED
    if (frame % GAME_SPEED_FRAME_RATE === 0 && gameSpeed < MAX_GAME_SPEED) {
      gameSpeed += GAME_SPEED_RATE;
      platformFrame -= PLATFORM_FRAME_RATE;
    }

    checkCollision();

    boundries.draw();

    updateRecord();

    if (checkGameOver) {
      gameOver();
    }
    frame++;
  } else {
    return;
  }
}
