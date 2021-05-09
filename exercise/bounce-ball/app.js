var ballContainer = document.getElementById("ballContainer");
var ball = document.getElementById("ball");
var ballTop, maxHeight;
var bounce = false;

function startAnimation() {
  maxHeight = ballContainer.offsetHeight - ball.offsetHeight;

  if (!bounce) {
    ball.style.top = (ball.offsetTop += 5) + "px";
  } else {
    ball.style.top = (ball.offsetTop -= 5) + "px";
  }
  if (ball.offsetTop >= maxHeight) {
    bounce = true;
  } else if (ball.offsetTop <= 0) {
    bounce = false;
  }
  window.requestAnimationFrame(startAnimation);
}

window.addEventListener("load", startAnimation);
