// DOM MANIPULATION

const gameContainer = document.getElementById("game-container");

const scoreboard = document.getElementById("scoreboard");

const lifeValue = document.getElementById("lifeValue");

const scoreValue = document.getElementById("scoreValue");

const recordValue = document.getElementById("recordValue");

const startgame = document.getElementById("startgame");
const startButton = document.getElementById("startButton");

const instructionsButton = document.getElementById("instructionsButton");
const closeButton = document.getElementById("close-button");
const gameInstruction = document.querySelector(".game-instructions-container");

// SOUND
const hitSound = document.createElement("audio");
hitSound.src = "./assets/sounds/hit.wav";

const backgroundSound = document.createElement("audio");
backgroundSound.src = "./assets/sounds/bgm.wav";
backgroundSound.volume = 0.3;

const dieSound = document.createElement("audio");
dieSound.src = "./assets/sounds/die.wav";
dieSound.volume = 0.3;

const menuSound = document.createElement("audio");
menuSound.src = "./assets/sounds/menu_music.wav";
menuSound.volume = 0.3;

startButton.addEventListener("click", (e) => {
  init();
  animate();
  startgame.style.display = "none";
  scoreboard.style.display = "flex";
});

instructionsButton.addEventListener("click", () => {
  gameInstruction.style.display = "block";
});

closeButton.addEventListener("click", () => {
  gameInstruction.style.display = "none";
});

const soundElement = document.getElementById("sound");
const gameSoundElement = document.getElementById("game-sound");

soundElement.addEventListener("click", () => {
  soundElement.classList.toggle("active");
  gameSoundElement.classList.toggle("active");
  sound = !sound;
});

gameSoundElement.addEventListener("click", () => {
  soundElement.classList.toggle("active");
  gameSoundElement.classList.toggle("active");
  sound = !sound;
  if (sound) {
    backgroundSound.play();
    backgroundSound.loop = true;
  } else {
    backgroundSound.pause();
  }
});

const gamePause = document.getElementById("game-pause");

gamePause.addEventListener("click", () => {
  pause = !pause;
  gamePause.classList.toggle("active");
});
