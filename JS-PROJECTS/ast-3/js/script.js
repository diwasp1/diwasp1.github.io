var context = document.querySelector("canvas").getContext("2d");

// ball class
const Ball = function (x, y, radius) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.color =
    "rgb(" +
    Math.floor(Math.random() * 256) +
    "," +
    Math.floor(Math.random() * 256) +
    "," +
    Math.floor(Math.random() * 256) +
    ")";
  this.speed = Math.random() * 2 + 1;
  this.direction = Math.random() * Math.PI * 2;

  this.update = function (height, width) {
    // initial random direction
    this.x += Math.cos(this.direction) * this.speed;
    this.y += Math.sin(this.direction) * this.speed;

    // bouncing off the wall

    if (this.x - this.radius < 0) {
      this.x = this.radius;
      this.direction = Math.atan2(
        Math.sin(this.direction),
        Math.cos(this.direction) * -1
      );
    } else if (this.x + this.radius > width) {
      this.x = width - this.radius;
      this.direction = Math.atan2(
        Math.sin(this.direction),
        Math.cos(this.direction) * -1
      );
    } else if (this.y - this.radius < 0) {
      this.y = this.radius;
      this.direction = Math.atan2(
        Math.sin(this.direction) * -1,
        Math.cos(this.direction)
      );
    } else if (this.y + this.radius > height) {
      this.y = height - this.radius;
      this.direction = Math.atan2(
        Math.sin(this.direction) * -1,
        Math.cos(this.direction)
      );
    }
  };

  this.checkCollision = function (compareBall) {
    var dx = this.x - compareBall.x;
    var dy = this.y - compareBall.y;
    var distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < this.radius + compareBall.radius) {
      console.log("collision");
      this.direction = Math.atan2(
        Math.sin(this.direction) * -1,
        Math.cos(this.direction) * -1
      );
    }
  };
};

// ball instances
var balls = new Array();

var height = document.documentElement.clientHeight;
var width = document.documentElement.clientWidth;


var random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
console.log(height, width);

for (var i = 0; i < TOTALBALL; i++) {
  var radius = random(MIN_RADIUS, MAX_RADIUS);

  var x = random(radius, width - radius);
  var y = random(radius, height - radius);

  if (balls.length > 0) {
    for (var j = 0; j < balls.length; j++) {
      var dx = x - balls[j].x;
      var dy = y - balls[j].y;
      var distance = Math.sqrt(dx * dx + dy * dy);
      if (distance - (radius + balls[j].radius) < 0) {
        x = random(radius, width - radius);
        y = random(radius, height - radius);
        j = -1;
      }
    }
  }

  balls.push(new Ball(x, y, radius));
}

// continues loop
function running() {
  height = document.documentElement.clientHeight;
  width = document.documentElement.clientWidth;
  context.canvas.height = height;
  context.canvas.width = width;

  for (var i = 0; i < balls.length; i++) {
    context.fillStyle = balls[i].color;
    context.beginPath();
    context.arc(balls[i].x, balls[i].y, balls[i].radius, 0, Math.PI * 2);
    context.fill();

    for (var j = 0; j < balls.length; j++) {
      if (i != j) {
        balls[i].checkCollision(balls[j]);
      }
    }

    balls[i].update(height, width);
  }

  window.requestAnimationFrame(running);
}

running();
