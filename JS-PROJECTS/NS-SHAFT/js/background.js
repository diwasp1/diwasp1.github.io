// LOAD IMAGE
const backgroundImage = new Image();
backgroundImage.src = "./assets/images/background.png";

// CREATE BACKGROUND
class Background {
  constructor() {
    this.y1 = 0;
    this.y2 = CANVAS_HEIGTH;
    this.x = 0;
    this.width = CANVAS_WIDTH;
    this.height = CANVAS_HEIGTH;
    this.speed = 1.5;
  }

  draw() {
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
    ctx.drawImage(backgroundImage, this.x, this.y1, this.width, this.height);
    ctx.drawImage(backgroundImage, this.x, this.y2, this.width, this.height);

    this.speed = gameSpeed;
  }
}
