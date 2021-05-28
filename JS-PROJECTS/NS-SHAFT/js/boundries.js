// LOAD IMAGE
const ceiling = new Image();
ceiling.src = "./assets/images/ceiling.png";

const leftWall = new Image();
leftWall.src = "./assets/images/wall.png";

const rightWall = new Image();
rightWall.src = "./assets/images/wall.png";

class Boundries {
  constructor() {
    this.y1 = 0;
    this.y2 = CANVAS_HEIGTH;
    this.x1 = 0;
    this.x2 = CANVAS_WIDTH - WALL_WIDTH;
    this.width = WALL_WIDTH;
    this.height = CANVAS_HEIGTH;
    this.speed = INITIAL_GAME_SPEED;
  }

  draw(speed) {
    ctx.drawImage(ceiling, 0, 0, CANVAS_WIDTH, CEILING_HEIGHT);

    if (this.y1 <= -this.height + this.speed) {
      this.y1 = this.height;
    } else {
      this.y1 -= this.speed;
    }
    if (this.y2 <= -this.height + this.speed) {
      this.y2 = this.height;
    } else {
      this.y2 -= this.speed;
    }

    ctx.drawImage(leftWall, this.x1, this.y1, this.width, this.height);
    ctx.drawImage(leftWall, this.x1, this.y2, this.width, this.height);

    ctx.drawImage(rightWall, this.x2, this.y1, this.width, this.height);
    ctx.drawImage(rightWall, this.x2, this.y2, this.width, this.height);

    this.speed = speed;
  }
}
