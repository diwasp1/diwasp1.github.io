var context = document.querySelector("canvas").getContext("2d");

const MIN_RADIUS = 30;
const MAX_RADIUS = 100;
const TOTALANTS = 10;
const HEIGHT = 800;
const WIDTH = 1200;

// ball class
const Ants = function (x, y, antHeight, antWidth) {
  this.x = x;
  this.y = y;
  this.width = antWidth;
  this.height = antHeight;
  this.speed = Math.random() * 2 + 1;
  this.direction = Math.random() * Math.PI * 2;

  this.update = function (height, width) {
    // initial random direction
    this.x += Math.cos(this.direction) * this.speed;
    this.y += Math.sin(this.direction) * this.speed;

    // bouncing off the wall

    if (this.x < 0) {
      this.direction = Math.atan2(
        Math.sin(this.direction),
        Math.cos(this.direction) * -1
      );
    } else if (this.x > width - this.width) {
      this.direction = Math.atan2(
        Math.sin(this.direction),
        Math.cos(this.direction) * -1
      );
    } else if (this.y < 0) {
      this.direction = Math.atan2(
        Math.sin(this.direction) * -1,
        Math.cos(this.direction)
      );
    } else if (this.y > height - this.height) {
      this.direction = Math.atan2(
        Math.sin(this.direction) * -1,
        Math.cos(this.direction)
      );
    }
  };

  this.checkCollision = function (compareAnt) {
    if (
      this.x < compareAnt.x + compareAnt.width &&
      this.x + this.width > compareAnt.x &&
      this.y < compareAnt.y + compareAnt.height &&
      this.y + this.height > compareAnt.y
    ) {
      this.direction = Math.atan2(
        Math.sin(this.direction) * -1,
        Math.cos(this.direction) * -1
      );
    }
  };
};

// ball instances
var ants = new Array();

var height = HEIGHT;
var width = WIDTH;

var random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

for (var i = 0; i < TOTALANTS; i++) {
  var antHeight = random(MIN_RADIUS, MAX_RADIUS);
  var antWidth = antHeight;

  var x = random(antWidth, width - antWidth);
  var y = random(antHeight, height - antHeight);

  if (ants.length > 0) {
    for (var j = 0; j < ants.length; j++) {
      if (
        x < ants[j].x + ants[j].antWidth &&
        x + antWidth > ants[j].x &&
        y < ants[j].y + ants[j].antHeight &&
        y + antHeight > ants[j].y
      ) {
        var x = random(antWidth, width);
        var y = random(antHeight, height);
        j = -1;
      }
    }
  }

  ants.push(new Ants(x, y, antHeight, antWidth));
}

// continues loop
var img = new Image();
img.src = "./img/ant.png";
function running() {
  context.canvas.height = height;
  context.canvas.width = width;

  for (var i = 0; i < ants.length; i++) {
    context.drawImage(img, ants[i].x, ants[i].y, ants[i].width, ants[i].height);

    for (var j = 0; j < ants.length; j++) {
      if (i != j) {
        ants[i].checkCollision(ants[j]);
      }
    }

    ants[i].update(height, width);
  }

  window.requestAnimationFrame(running);
}
canvas.addEventListener("click", (e) => {
  let x = e.pageX;
  let y = e.pageY;
  console.log(x, y);

  ants.forEach(function (ant, index) {
    console.log(ant.x, ant.y, ant.width);
    if (
      x >= ant.x &&
      x <= ant.x + ant.width &&
      y >= ant.y &&
      y <= ant.y + ant.height
    ) {
      ants.splice(index, 1);
    }
  });
});

window.addEventListener("load", function () {
  running();
});
