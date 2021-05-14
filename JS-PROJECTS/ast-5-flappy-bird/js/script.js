// GAME CONTAINER

var container = document.getElementById("game-container");
var backgroundImage;
var obstacleId;
var gameScores;

// GET RANDOM VALUE
function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}


//MAIN FUNCTION
function Main() {
  var that = this;
  this.gameOverState = true;
  this.gravity = 0.5;
  this.jumpValue = 40;
  this.obstacles = [];
  this.newHighScore = 0;
  this.speed = 0.5;

  this.highScore = localStorage.getItem("highscore")
    ? localStorage.getItem("highscore")
    : 0;

  this.gameCover = function () {
    this.width = GAME_WIDTH;
    this.height = GAME_HEIGHT;

    this.coverPage = document.createElement("div");

    this.coverPage.style.width = this.width;
    this.coverPage.style.height = this.height;
    this.coverPage.style.position = "relative";
    this.coverPage.style.margin = "10px auto";
    this.coverPage.setAttribute("id", "game-cover");
    this.coverPage.style.backgroundImage = "url(./images/bg.png)";
    this.coverPage.style.backgroundSize = "cover";
    container.appendChild(this.coverPage);

    this.gameName = document.createElement("div");
    this.gameName.innerText = "Flappy Bird";
    this.gameName.setAttribute("id", "game-name");
    this.coverPage.appendChild(this.gameName);

    this.startButton = document.createElement("button");
    this.startButton.innerText = "START";
    this.startButton.setAttribute("id", "start-button");
    this.coverPage.appendChild(this.startButton);

    // game controls
    this.gameControls = document.createElement("div");
    this.gameControls.innerText = "press space to jump";
    this.gameControls.setAttribute("id", "game-controls");
    this.coverPage.appendChild(this.gameControls);

    // High Score
    if (that.highScore > 0) {
      this.bannerScore = document.createElement("div");
      this.bannerScore.innerText = `High Score : ${that.highScore}`;
      this.bannerScore.setAttribute("id", "banner-score");
      this.coverPage.appendChild(this.bannerScore);
    }

    this.startButton.addEventListener("click", () => {
      container.removeChild(this.coverPage);
      this.gameStart();
    });
  };

  this.gameStart = function () {
    that.gameOverState = false;
    obstacleId = 0;
    gameScores = [];
    that.newHighScore = 0;

    that.gravity = 1;

    this.background = new Background();
    this.background.createBackground();

    this.bird = new Bird();
    this.bird.createBird();

    that.birdMovement();
    that.keyControls();

    running = setInterval(() => {
      that.obstacleGenerate();
    }, 5000);

    that.obstacleMovement();
  };

  this.obstacleGenerate = function () {
    that.obstacle = new Obstacles();
    that.obstacle.createObstacle();
    that.obstacles.push(that.obstacle);
  };

  this.birdMovement = function () {
    birdMove = setInterval(() => {
      that.bird.positionY += that.gravity;
      // that.speed += that.gravity;
      that.gravity += that.speed;
      that.bird.updateBird();
      that.checkCollision();
      that.obstacleCollision();
      that.background.updateScore();
      that.background.updateFooter();
    }, 30);
  };

  this.obstacleMovement = function () {
    obstacleMove = setInterval(() => {
      var ids = [];
      for (var i = 0; i < that.obstacles.length; i++) {
        ids.push(that.obstacles[i].id);
        that.obstacles[i].positionLeft -= 2;
        that.obstacles[i].updateObstacle();

        if (that.obstacles[i].positionLeft <= -60) {
          that.obstacles[i].removeObstacle();
          that.obstacles.splice(i, 1);
        }
      }
    }, 40);
  };

  this.keyControls = function () {
    document.onkeydown = function (e) {
      if (e.keyCode === 32) {
        if (that.gameOverState == false) {
          that.jump();
        }
      }
    };
  };

  this.jump = function () {
    if (
      that.bird.positionY <= MAX_HEIGHT - BIRD_HEIGHT &&
      that.bird.positionY >= 0
    ) {
      // that.speed = 0;
      that.gravity = 0.5;
      that.bird.positionY -= that.jumpValue;
      that.bird.updateBird();
    }
  };

  this.checkCollision = function () {
    if (that.bird.positionY >= MAX_HEIGHT - BIRD_HEIGHT) {
      that.gameOver();
    }
  };

  this.obstacleCollision = function () {
    for (var i = 0; i < that.obstacles.length; i++) {
      if (that.obstacles[i].positionLeft <= 240) {
        if (
          that.bird.positionX + BIRD_WIDTH >= that.obstacles[i].positionLeft &&
          that.bird.positionX <= that.obstacles[i].positionLeft + OBSTACLE_WIDTH
        ) {
          var top =
            GAME_HEIGHT -
            that.obstacles[i].positionBottom -
            that.obstacles[i].gap;
          var bottom =
            GAME_HEIGHT - that.obstacles[i].positionBottom - OBSTACLE_HEIGHT;
          if (that.bird.positionY < top || that.bird.positionY > bottom) {
            // gameScores = gameScores.filter((id) => id != that.obstacles[i].id);
            that.gameOver();
          } else {
            if (!gameScores.includes(that.obstacles[i].id)) {
              gameScores.push(that.obstacles[i].id);
            }
          }
        }
      }
    }
  };

  this.gameOver = function () {
    that.gameOverState = true;
    obstacleId = 0;
    clearInterval(birdMove);
    clearInterval(running);
    clearInterval(obstacleMove);

    if (that.highScore < gameScores.length) {
      that.newHighScore = 1;
      that.updateHighScore(gameScores.length);
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

    this.gameOverAlert = document.createElement("div");
    this.gameOverAlert.setAttribute("id", "gameover-alert");
    this.gameOverAlert.innerText = "GAME OVER";
    this.gameOverElement.appendChild(this.gameOverAlert);

    // score
    this.gameOverText = document.createElement("div");
    this.gameOverText.setAttribute("id", "gameover-text");
    this.gameOverElement.appendChild(this.gameOverText);

    this.gameOverScore = document.createElement("div");
    this.gameOverScore.setAttribute("id", "gameover-score");
    this.gameOverScore.innerText = `SCORE ${gameScores.length}`;
    this.gameOverText.appendChild(this.gameOverScore);

    this.gameOverHighScore = document.createElement("div");
    this.gameOverHighScore.setAttribute("id", "gameover-high-score");
    this.gameOverHighScore.innerText = `BEST ${that.highScore}`;
    this.gameOverText.appendChild(this.gameOverHighScore);

    //play again
    this.gameOverButton = document.createElement("div");
    this.gameOverButton.setAttribute("id", "gameover-button");
    this.gameOverElement.appendChild(this.gameOverButton);

    this.gameOverPlayAgain = document.createElement("button");
    this.gameOverPlayAgain.setAttribute("id", "gameover-play-again");
    this.gameOverPlayAgain.innerText = "RESTART";
    this.gameOverButton.appendChild(this.gameOverPlayAgain);

    this.gameOverReset = document.createElement("button");
    this.gameOverReset.setAttribute("id", "gameover-reset");
    this.gameOverReset.innerText = "RESET";
    this.gameOverButton.appendChild(this.gameOverReset);

    this.scoreInformation = document.createElement("div");
    this.scoreInformation.setAttribute("id", "score-information");

    if (that.newHighScore) {
      this.scoreInformation.innerText = "new high score recorded";
    } else if (that.highScore > gameScores.length) {
      this.scoreInformation.innerText = "try again";
    } else if (that.highScore == gameScores.length) {
      if (!that.newHighScore && that.highScore != 0) {
        this.scoreInformation.innerText = "don't give up almost there";
      }
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

function Background() {
  this.width = GAME_WIDTH;
  this.height = GAME_HEIGHT;
  this.scoreValue = 0;
  this.footerX = 0;

  //   create background
  this.createBackground = function () {
    this.backgroundImage = document.createElement("div");
    backgroundImage = this.backgroundImage;
    this.backgroundImage.setAttribute("id", "background-image");
    this.backgroundImage.style.backgroundImage = "url(./images/bg.png)";
    container.appendChild(this.backgroundImage);

    this.footerImage = document.createElement("div");
    this.footerImage.setAttribute("id", "footer-image");
    this.footerImage.style.backgroundImage = "url(./images/fg.png)";
    this.backgroundImage.appendChild(this.footerImage);

    //create score div
    this.scoreElement = document.createElement("div");
    this.scoreElement.setAttribute("id", "score");
    this.scoreElement.innerText = gameScores.length;
    backgroundImage.appendChild(this.scoreElement);

    this.updateScore = function () {
      this.scoreElement.innerText = gameScores.length;
    };

    this.updateFooter = function () {
      this.footerX -= 3;
      this.footerImage.style.backgroundPositionX = this.footerX + "px";
    };
  };
}

function Bird() {
  this.width = BIRD_WIDTH;
  this.height = BIRD_HEIGHT;
  this.positionX = 180;
  this.positionY = 200;

  //create bird
  this.createBird = function () {
    this.bird = document.createElement("div");
    this.bird.setAttribute("id", "bird");
    this.bird.style.backgroundImage = "url(./images/bird.png)";
    backgroundImage.appendChild(this.bird);
  };

  this.updateBird = function () {
    this.bird.style.top = this.positionY + "px";
  };
}

function Obstacles() {
  this.width = OBSTACLE_WIDTH;
  this.height = OBSTACLE_HEIGHT;
  this.positionLeft = 500;
  this.gap = 430;
  // this.randomHeight = Math.random() * 110;
  this.randomHeight = getRandomValue(-50, 100);
  this.positionBottom = this.randomHeight;

  this.id = obstacleId;

  this.createObstacle = function () {
    obstacleId++;
    this.obstacleTop = document.createElement("div");
    this.obstacleTop.setAttribute("class", "obstacle-top");
    this.obstacleTop.style.backgroundImage = "url(./images/pipe.png)";
    this.obstacleTop.style.left = this.positionLeft + "px";
    this.obstacleTop.style.bottom = this.positionBottom + this.gap + "px";
    backgroundImage.appendChild(this.obstacleTop);

    this.obstacleBottom = document.createElement("div");
    this.obstacleBottom.setAttribute("class", "obstacle-bottom");
    this.obstacleBottom.style.backgroundImage = "url(./images/pipe.png)";
    this.obstacleBottom.style.left = this.positionLeft + "px";
    this.obstacleBottom.style.bottom = this.positionBottom + "px";
    backgroundImage.appendChild(this.obstacleBottom);
  };

  this.updateObstacle = function () {
    this.obstacleTop.style.left = this.positionLeft + "px";
    this.obstacleBottom.style.left = this.positionLeft + "px";
  };

  this.removeObstacle = function () {
    backgroundImage.removeChild(this.obstacleTop);
    backgroundImage.removeChild(this.obstacleBottom);
  };
}

var main = new Main();
main.gameCover();
