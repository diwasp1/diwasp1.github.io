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
    this.speed = INITIAL_GAME_SPEED;
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
