function Slider(
  carouselClass = "carousel-container",
  transitionTime = 50,
  delay = 1000
) {
  this.carouselClass = carouselClass;
  this.transitionTime = transitionTime;
  this.transitionDelay = delay;

  // Get Dom Elements
  var carouselContainer = document.querySelector(`.${this.carouselClass}`);
  console.log(carouselContainer)
  var carouselImages = carouselContainer.getElementsByTagName("div")[0];
  var images = carouselImages.getElementsByTagName("img");

  //   assign varibale
  var currentIndex = 0;
  var nextIndex = 0;
  var noImage = images.length;
  var width = carouselContainer.offsetWidth;
  var transitionTime = this.transitionTime;
  var transitionDelay = this.transitionDelay;

  //   arrow left
  var arrowLeft = document.createElement("div");
  arrowLeft.innerText = "<";
  arrowLeft.classList.add("arrow");
  arrowLeft.setAttribute("id", "arrowLeft");
  carouselContainer.appendChild(arrowLeft);

  arrowLeft.addEventListener("click", () => {
    nextIndex = currentIndex - 1;
    if (nextIndex < 0) {
      nextIndex = noImage - 1;
    }
    // clearTimeout(slideAction);
    slideFunc(nextIndex);
  });

  //   arrow Right
  var arrowRight = document.createElement("div");
  arrowRight.innerHTML = ">";
  arrowRight.classList.add("arrow");
  arrowRight.setAttribute("id", "arrowRight");
  carouselContainer.appendChild(arrowRight);

  arrowRight.addEventListener("click", () => {
    var nextIndex = currentIndex + 1;
    if (nextIndex > noImage - 1) {
      nextIndex = 0;
    }
    // if (index == currentIndex) {
    //   return;
    // }
    // clearTimeout(slideAction);
    slideFunc(nextIndex);
  });

  var slideAction;
  // continuousSlider();

  //   function continuousSlider() {
  //     var nextIndex = currentIndex + 1;
  //     if (nextIndex > noImage - 1) {
  //       nextIndex = 0;
  //     }
  //     slideAction = setTimeout(() => {
  //       slideFunc(nextIndex);
  //     }, 1000);
  //   }

  //dots
  var dotsContainer = document.createElement("div");
  dotsContainer.classList.add("dots-container");
  carouselContainer.appendChild(dotsContainer);

  var dotsArray = [];
  for (var j = 0; j < images.length; j++) {
    var dots = document.createElement("span");
    dotsContainer.appendChild(dots);
    dots.classList.add("dot");
    dotsArray.push(dots);
  }

  dotsArray[0].classList.add("active");

  dotsArray.forEach((dot, index) => {
    dot.addEventListener("click", (e) => {
      //   clearTimeout(slideAction);
      //   if (index == currentIndex) {
      //     return;
      //   }

      slideFunc(index);
    });
  });

  //slide function
  function slideFunc(index) {
    var timer = 0;
    var currentOffset = carouselImages.offsetLeft;
    var maxOffset = index == 0 ? 0 : -index * width;
    var changeOffset = (maxOffset - currentOffset) / transitionTime;
    var initialOffset;
    console.log(index, currentOffset, maxOffset, changeOffset, transitionTime);

    var slide = setInterval(() => {
      var currentOffset = carouselImages.offsetLeft;

      if (currentIndex > index) {
        if (currentOffset + changeOffset * 2 > maxOffset) {
          clearInterval(slide);
          //   clearTimeout(slideAction);
          currentIndex = index;
          // continuousSlider();
        }
      } else if (currentOffset + changeOffset * 2 < maxOffset) {
        clearInterval(slide);
        // clearTimeout(slideAction);
        currentIndex = index;
        // continuousSlider();
      }

      carouselImages.style.left = currentOffset + changeOffset + "px";
      timer++;
      console.log(carouselImages.style.left, "timer:", timer);
    }, 10);

    // dot active
    for (var i = 0; i < dotsArray.length; i++) {
      dotsArray[i].classList.remove("active");
      if (index == i) {
        dotsArray[i].classList.add("active");
      }
    }
  }
}
