// constants
const GAME_HEIGHT = 660;
const GAME_WIDTH = 660;
const WIDTH = 150;
const HEIGHT = 150;
const BULLET_HEIGHT = 50;
const BULLET_WIDTH = 60;

var container = document.getElementById("container");

var backgroundImage;

var getRandomValue = function () {
  return Math.floor(Math.random() * 3);
};

function Main() {
  var that = this;
  this.obstacles = [];
  this.gameover = true;

  var intervalCount = 0;

  this.highScore = localStorage.getItem("highscore")
    ? localStorage.getItem("highscore")
    : 0;

  this.gameCover = function () {
    this.width = 660;
    this.height = 660;

    this.coverPage = document.createElement("div");
    coverPage = this.coverPage;

    coverPage.style.width = this.width;
    coverPage.style.height = this.height;
    coverPage.style.position = "relative";
    coverPage.style.margin = "0 auto";
    coverPage.setAttribute("id", "game-cover");
    coverPage.style.backgroundImage = "url(./img/game-cover.jpg)";
    coverPage.style.backgroundSize = "cover";
    container.appendChild(coverPage);

    var gameName = document.createElement("div");
    gameName.innerText = "CAR LANE GAME";
    gameName.setAttribute("id", "game-name");
    coverPage.appendChild(gameName);

    // game controls
    var gameControls = document.createElement("div");
    gameControls.setAttribute("id", "game-controls");
    coverPage.appendChild(gameControls);

    var controlTitle = document.createElement("p");
    controlTitle.innerText = "CONTROLS";
    controlTitle.setAttribute("class", "control-title");
    gameControls.appendChild(controlTitle);

    var control1 = document.createElement("p");
    control1.innerText = "Press 'A' or 'ARROWLEFT' to move left.";
    control1.setAttribute("class", "control");
    gameControls.appendChild(control1);

    var control2 = document.createElement("p");
    control2.innerText = "Press 'D' or 'ARROWRIGHT' to move right.";
    control2.setAttribute("class", "control");
    gameControls.appendChild(control2);

    // game instructions

    var gameInstruction = document.createElement("div");
    gameInstruction.setAttribute("id", "game-instruction");
    coverPage.appendChild(gameInstruction);

    var instructionTitle = document.createElement("p");
    instructionTitle.innerText = "INSTRUCTIONS";
    instructionTitle.setAttribute("class", "instruction-title");
    gameInstruction.appendChild(instructionTitle);

    var instruction1 = document.createElement("p");
    instruction1.innerText = "Avoid collision with other cars.";
    instruction1.setAttribute("class", "instructions");
    gameInstruction.appendChild(instruction1);

    var instruction2 = document.createElement("p");
    instruction2.innerText =
      " Cross car without collision to increase  your score each time.";
    instruction2.setAttribute("class", "instructions");
    gameInstruction.appendChild(instruction2);

    var startButton = document.createElement("button");
    startButton.innerText = "PLAY";
    startButton.setAttribute("id", "start-button");
    coverPage.appendChild(startButton);

    startButton.addEventListener("click", () => {
      container.removeChild(coverPage);
      this.gameStart();
    });
  };

  this.gameStart = function () {
    that.gameover = false;
    this.gameBackground = new GameBackground();
    this.gameCar = new GameCar();

    // function backgroundMotion() {
    //   that.gameBackground.positionY += 5;
    //   that.gameBackground.upadteBackgroundPostion();
    //   window.requestAnimationFrame(backgroundMotion);
    // }
    // backgroundMotion();
    // bulletFire = setInterval(() => {
    // that.gameCar.bulletCreate();
    // }, 1000);

    this.controls();
    this.movement();
  };

  this.controls = function () {
    document.onkeydown = function (e) {
      var key = e.key;
      console.log(key);

      switch (key) {
        case "a":
        case "ArrowLeft":
          if (that.gameover) {
            break;
          }
          if (that.gameCar.x == 255) {
            that.gameCar.x = 60;
          } else if (that.gameCar.x == 445) {
            that.gameCar.x = 255;
          }
          that.gameCar.updatePosition();
          break;

        case "Shift":
          if (that.gameCar.bulletCount < 1) {
            that.gameCar.bulletCreate();
          }
          break;

        case "d":
        case "ArrowRight":
          if (that.gameover) {
            break;
          }
          if (that.gameCar.x == 60) {
            that.gameCar.x = 255;
          } else if (that.gameCar.x == 255) {
            that.gameCar.x = 445;
          }
          that.gameCar.updatePosition();
          break;

        default:
          break;
      }
    };
  };

  this.movement = function () {
    movement = setInterval(() => {
      intervalCount++;

      var newObstaclesArray = [];
      for (var i = 0; i < that.obstacles.length; i++) {
        if (that.obstacles[i].y < GAME_HEIGHT) {
          newObstaclesArray.push(that.obstacles[i]);
        } else {
          that.gameBackground.scoreValue++;
          that.obstacles[i].removePosition();
          that.obstacles[i] = null;
        }
      }
      that.gameBackground.updateScore();

      that.obstacles = newObstaclesArray;

      if (that.gameCar.bulletCount == 1) {
        console.log("object");
        that.gameCar.bulletUpdate();
        that.bulletCollision();
      }

      //   at every 240 ms
      if (intervalCount % 40 == 0) {
        that.createObstacle();
      }

      that.obstacleDetection();
    }, 60);
  };

  this.createObstacle = function () {
    this.gameObstacle = new GameObstacle();
    that.obstacles.push(this.gameObstacle);
  };

  this.obstacleDetection = function () {
    for (i = 0; i < that.obstacles.length; i++) {
      that.obstacles[i].updatePosition();

      if (
        that.obstacles[i].y + that.obstacles[i].height >= that.gameCar.y &&
        that.obstacles[i].x == that.gameCar.x &&
        this.gameCar.height + this.gameCar.y >= that.obstacles[i].y
      ) {
        that.gameOver();
      }
    }
  };

  this.bulletCollision = function () {
    for (i = 0; i < that.obstacles.length; i++) {
      if (
        that.obstacles[i].y + that.obstacles[i].height >=
          that.gameCar.bulletPositionY &&
        that.obstacles[i].x == that.gameCar.x &&
        BULLET_HEIGHT + this.gameCar.bulletPositionY >= that.obstacles[i].y
      ) {
        // backgroundImage.removeChild(this.obstacles[i]);
        that.obstacles[i].removePosition();
        backgroundImage.removeChild(this.gameCar.bulletElement);
        this.gameCar.bulletCount = 0;
        this.obstacles[i] = null;
      }
    }

    for (var j = 0; j < this.obstacles.length; j++) {
      if (this.obstacles[j] === null) {
        this.obstacles.splice(this.obstacles.indexOf(this.obstacles[j]), 1);
        break;
      }
    }
  };

  this.gameOver = function () {
    that.gameover = true;
    clearInterval(movement);
    that.gameBackground.backgroundImage.style.animation = "none";

    if (that.highScore < that.gameBackground.scoreValue) {
      that.updateHighScore(that.gameBackground.scoreValue);
    }

    that.gameOverBackground();
  };

  this.updateHighScore = function (newScore) {
    localStorage.setItem("highscore", newScore);
    that.highScore = newScore;
  };
  this.gameOverBackground = function () {
    this.gameOverElement = document.createElement("div");
    this.gameOverElement.setAttribute("id", "gameover");
    backgroundImage.appendChild(this.gameOverElement);

    this.gameOverText = document.createElement("div");
    this.gameOverText.setAttribute("id", "gameover-text");
    this.gameOverText.innerText = "GAME OVER";
    this.gameOverElement.appendChild(this.gameOverText);

    this.gameOverScore = document.createElement("div");
    this.gameOverScore.setAttribute("id", "gameover-score");
    this.gameOverScore.innerText = `YOUR SCORE : ${that.gameBackground.scoreValue}`;
    this.gameOverElement.appendChild(this.gameOverScore);

    this.gameOverHighScore = document.createElement("div");
    this.gameOverHighScore.setAttribute("id", "gameover-high-score");
    this.gameOverHighScore.innerText = `HIGH SCORE : ${that.highScore}`;
    this.gameOverElement.appendChild(this.gameOverHighScore);

    this.gameOverReset = document.createElement("button");
    this.gameOverReset.setAttribute("id", "gameover-reset");
    this.gameOverReset.innerText = "RESET";
    this.gameOverElement.appendChild(this.gameOverReset);

    this.gameOverPlayAgain = document.createElement("button");
    this.gameOverPlayAgain.setAttribute("id", "gameover-play-again");
    this.gameOverPlayAgain.innerText = "PLAY AGAIN";
    this.gameOverElement.appendChild(this.gameOverPlayAgain);

    this.scoreInformation = document.createElement("div");
    this.scoreInformation.setAttribute("id", "score-information");

    if (that.highScore <= that.gameBackground.scoreValue) {
      this.scoreInformation.innerText = "New High Score Recorded. HURRAY!!";
    } else if (that.highScore >= that.gameBackground.scoreValue) {
      this.scoreInformation.innerText = "TRY AGAIN";
    }
    this.gameOverElement.appendChild(this.scoreInformation);

    this.gameOverReset.addEventListener("click", () => {
      backgroundImage.removeChild(that.gameOverElement);
      container.removeChild(backgroundImage);

      that.obstacles.length = 0;
      that.updateHighScore(0);
      that.gameCover();
    });

    this.gameOverPlayAgain.addEventListener("click", () => {
      backgroundImage.removeChild(that.gameOverElement);
      container.removeChild(backgroundImage);

      that.obstacles.length = 0;
      that.gameStart();
    });
  };
}

// background
function GameBackground() {
  this.width = GAME_WIDTH;
  this.height = GAME_HEIGHT;
  this.scoreValue = 0;
  this.backgroundImage = document.createElement("div");
  backgroundImage = this.backgroundImage;
  this.positionY = 0;

  backgroundImage.style.width = this.width;
  backgroundImage.style.height = this.height;
  backgroundImage.style.position = "relative";
  backgroundImage.style.overflow = "hidden";
  backgroundImage.style.borderRadius = "20px";
  backgroundImage.style.margin = "0 auto";
  backgroundImage.setAttribute("id", "backgroundImgae");
  backgroundImage.style.backgroundImage = "url(./img/road-lane.png)";
  backgroundImage.style.backgroundRepeat = "repeat-y";
  backgroundImage.style.backgroundSize = "cover";
  container.appendChild(backgroundImage);
  this.backgroundImage.style.animation = "moveBackground 5s linear  infinite ";

  //   this.upadteBackgroundPostion = function () {
  //     // this.positionY += 5;
  //     backgroundImage.style.backgroundPositionY = this.positionY + "px";
  //   };

  //create score div
  this.scoreElement = document.createElement("div");
  this.scoreElement.setAttribute("id", "score");
  this.scoreElement.innerText = "SCORE:" + this.scoreValue;
  backgroundImage.appendChild(this.scoreElement);

  this.updateScore = function () {
    this.scoreElement.innerText = `SCORE : ${this.scoreValue}`;
  };
}

// player car
function GameCar() {
  this.height = HEIGHT;
  this.width = WIDTH;
  this.x = 255;
  this.y = 495;
  this.bulletCount = 0;

  this.bulletPositionY = 0;
  this.bulletElement = "";

  //create car
  this.carElement = document.createElement("div");
  var carElement = this.carElement;

  carElement.style.height = this.height;
  carElement.style.width = this.width;
  carElement.style.position = "absolute";
  carElement.style.zIndex = "2";
  carElement.style.top = this.y + "px";
  carElement.style.left = this.x + "px";

  carElement.setAttribute("id", "player-car");
  backgroundImage.appendChild(carElement);

  var carImg = document.createElement("img");
  carImg.setAttribute("src", "./img/car-player.png");
  carImg.style.backgroundRepeat = "no-repeat";
  carImg.style.height = "100%";
  carImg.style.width = "100%";
  carElement.appendChild(carImg);

  this.updatePosition = function () {
    carElement.style.left = this.x + "px";
  };

  //bullet

  this.bulletCreate = function () {
    this.bulletCount++;
    console.log(this.bulletPositionY, "bullet");

    this.bulletElement = document.createElement("div");
    this.bullet = document.createElement("img");

    this.bulletElement.style.position = "absolute";
    this.bulletElement.style.zIndex = "20";
    this.bulletElement.style.width = BULLET_WIDTH + "px";
    this.bulletElement.style.height = BULLET_HEIGHT + "px";
    this.bulletElement.style.top = this.y - 51 + "px";
    this.bulletElement.style.left = this.x + 45 + "px";
    this.bullet.style.width = "100%";
    this.bullet.style.height = "100%";
    this.bullet.setAttribute("src", "img/bullet.png");

    backgroundImage.appendChild(this.bulletElement);
    this.bulletElement.appendChild(this.bullet);
    this.bulletUpdate();
  };
  this.bulletUpdate = function () {
    this.bulletPositionY = this.bulletElement.offsetTop;
    this.bulletPositionY -= 5;
    this.bulletElement.style.top = this.bulletPositionY + "px";

    if (this.bulletPositionY <= 0) {
      backgroundImage.removeChild(this.bulletElement);
      this.bulletCount--;
    }
  };
}

// obstacle
function GameObstacle() {
  this.width = WIDTH;
  this.height = HEIGHT;
  this.y = 1;
  this.x = 60;

  this.obstacleElement = document.createElement("div");
  var obstacleElement = this.obstacleElement;

  obstacleElement.style.height = this.height;
  obstacleElement.style.width = this.width;
  obstacleElement.style.position = "absolute";
  obstacleElement.style.zIndex = "2";
  obstacleElement.style.top = this.y + "px";
  obstacleElement.style.left = this.x + "px";

  obstacleElement.setAttribute("id", "obstacle-car");
  backgroundImage.appendChild(obstacleElement);

  var obstacleImg = document.createElement("img");
  obstacleImg.setAttribute("src", "./img/car-obstacle.png");
  obstacleImg.style.backgroundRepeat = "no-repeat";
  obstacleImg.style.height = "100%";
  obstacleImg.style.width = "100%";
  obstacleElement.appendChild(obstacleImg);

  var randomPosition = getRandomValue();

  if (randomPosition == 0) {
    this.x = 60;
    obstacleElement.style.left = this.x + "px";
  } else if (randomPosition == 1) {
    this.x = 255;
    obstacleElement.style.left = this.x + "px";
  } else {
    this.x = 445;
    obstacleElement.style.left = this.x + "px";
  }

  this.updatePosition = function () {
    this.y += 5;
    obstacleElement.style.top = this.y + "px";
  };

  this.removePosition = function () {
    backgroundImage.removeChild(obstacleElement);
  };
}

//bullet

var carGame = new Main();
carGame.gameCover();
