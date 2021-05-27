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

    this.gravity = GRAVITY;
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
    if (this.y < 0) {
      collide = false;
      this.y = 0 + this.height;
      this.gravitySpeed = 0;
      decreaseLife();
    }
  }
  animateSprite() {
    if (frame % SPRITE_FRAME_RATE === 0) {
      if (collide === false) {
        if (this.left === true) {
          this.frameY = PLAYER_LEFT_FRAME;
        } else if (this.right === true) {
          this.frameY = PLAYER_RIGHT_FRAME;
        } else {
          this.frameY = PLAYER_FALLING_FRAME;
        }
        if (this.frameX >= MAX_SPRITE_FRAME) {
          this.frameX = INITIAL_SPRITE_FRAME;
        } else {
          this.frameX++;
        }
      } else if (collide === true && this.left === true) {
        this.frameY = PLAYER_LEFT_FRAME;
        if (this.frameX >= MAX_SPRITE_FRAME) {
          this.frameX = INITIAL_SPRITE_FRAME;
        } else {
          this.frameX++;
        }
      } else if (collide === true && this.right === true) {
        this.frameY = PLAYER_RIGHT_FRAME;
        if (this.frameX >= MAX_SPRITE_FRAME) {
          this.frameX = INITIAL_SPRITE_FRAME;
        } else {
          this.frameX++;
        }
      } else if (
        collide === true &&
        this.left === false &&
        this.right === false
      ) {
        this.frameX = PLAYER_STANDING_FRAME;
        if (spike) {
          if (this.frameY >= MAX_SPIKE_SPRITE_FRAME) {
            this.frameY = INITIAL_SPRITE_FRAME;
          } else {
            this.frameY++;
          }
        } else {
          this.frameY = INITIAL_SPRITE_FRAME;
        }
      }
    }
  }
}
