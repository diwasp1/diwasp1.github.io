// LOAD IMAGE
const playerSprite = new Image();
playerSprite.src = "./assets/images/player.png";

// CREATE PALYER

class Player {
  constructor(x, y, width, height, frameX, frameY, moveSpeed) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.frameX = frameX;
    this.frameY = frameY;
    this.moveSpeed = moveSpeed;

    this.left = false;
    this.right = false;

    this.gravity = 0.1;
    this.gravitySpeed = 0;
    this.velocity = 0;
  }

  draw() {
    ctx.drawImage(
      playerSprite,
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
    if (this.y > canvas.height) {
      this.y = canvas.height;
      this.gravitySpeed = 0;
      checkGameOver = true;
    } else if (collide === false && checkGameOver === false) {
      this.gravitySpeed += this.gravity;
      this.y += this.gravitySpeed;
    } else if (collide === true) {
      this.up();
    }
    this.animateSprite();
  }

  up() {
    // this.y -= this.speed;
    if (this.y < 0) {
      collide = false;
      this.y = 0 + this.height;
      this.gravitySpeed = 0;
      decreaseLife();
    }
  }
  animateSprite() {
    if (frame % 10 === 0) {
      if (collide === false) {
        if (this.left === true) {
          this.frameY = 0;
        } else if (this.right === true) {
          this.frameY = 1;
        } else {
          this.frameY = 4;
        }
        if (this.frameX >= 3) {
          this.frameX = 0;
        } else {
          this.frameX++;
        }
      } else if (collide === true && this.left === true) {
        this.frameY = 0;
        if (this.frameX >= 3) {
          this.frameX = 0;
        } else {
          this.frameX++;
        }
      } else if (collide === true && this.right === true) {
        this.frameY = 1;
        if (this.frameX >= 3) {
          this.frameX = 0;
        } else {
          this.frameX++;
        }
      } else if (
        collide === true &&
        this.left === false &&
        this.right === false
      ) {
        this.frameX = 8;
        if (spike) {
          if (this.frameY >= 1) {
            this.frameY = 0;
          } else {
            this.frameY++;
          }
        } else {
          this.frameY = 0;
        }
      }
    }
  }
}
