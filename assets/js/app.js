//portfolio link active

let portLinks = document.querySelector(".port-links");
let linkBtn = portLinks.getElementsByClassName("link-btn");

console.log(linkBtn.length);

for (i = 0; i < linkBtn.length; i++) {
  linkBtn[i].addEventListener("click", function (e) {
    e.preventDefault();
    let current = document.querySelector(".active");
    current.className = current.className.replace(" active", " ");
    this.className += " active";
  });
}

function openNav() {
  document.getElementById("mySidenav").style.display = "block";
  document.querySelector(".bars").style.display = "none";
  document.querySelector(".close-bars").style.display = "block";
  document.querySelector(".close-bars").style.transition = "5s ease-in-out";

}

function closeNav() {
  document.getElementById("mySidenav").style.display = "none";
  document.querySelector(".bars").style.display = "block";
  document.querySelector(".close-bars").style.display = "none";
}

  var btn = $("#button");

  $(window).scroll(function () {
    if ($(window).scrollTop() > 300) {
      btn.addClass("show");
    } else {
      btn.removeClass("show");
    }
  });

  btn.on("click", function (e) {
    e.preventDefault();
    $("html, body").animate({ scrollTop: 0 }, "300");
  });





