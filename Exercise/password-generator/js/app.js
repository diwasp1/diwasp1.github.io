var rangeSlider = document.getElementById("range-slider");
var range = document.getElementById("range");
var generateBtn = document.getElementById("generate-button");
var resultContainer = document.getElementById("result-container");
var result = document.getElementById("result");
var copyButton = document.getElementById("copy-button");
var alert = document.getElementById("alert");
var switchBtns = document.getElementsByClassName("switch");

var optionsCharacter = {
  lowercase: true,
  uppercase: false,
  numbers: false,
  symbols: false,
};

var getRandom = {
  lower: getRandomLowerChar,
  upper: getRandomUpperChar,
  number: getRandomNumber,
  symbol: getRandomSymbol,
};

//call generateFunction
function callGeneratePassword() {
  const LENGTH = +range.value;
  result.innerText = generatePassword(
    optionsCharacter["lowercase"],
    optionsCharacter["uppercase"],
    optionsCharacter["numbers"],
    optionsCharacter["symbols"],
    LENGTH
  );
}
// Generate Button event

generateBtn.addEventListener("click", () => {
  callGeneratePassword();
  resultContainer.style.display = "block";
});

// generate password function

function generatePassword(lower, upper, number, symbol, numberLength) {
  var generatedPassword = "";
  var typesArr = [{ lower }, { upper }, { number }, { symbol }].filter(
    (item) => Object.values(item)[0]
  );

  if (typesArr.length === 0) {
    return "";
  }
  console.log(`typesArr.length`, typesArr.length);
  for (var i = 0; i < numberLength; i += typesArr.length) {
    typesArr.forEach((type) => {
      var funcName = Object.keys(type);
      generatedPassword += getRandom[funcName]();
    });
  }
  generatedPassword = generatedPassword.slice(0, numberLength);
  return generatedPassword;
}

//copy password
copyButton.addEventListener("click", () => {
  var textarea = document.createElement("textarea");
  var password = result.innerText;

  if (!password) {
    return;
  }

  textarea.value = password;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
  alert.style.display = "block";
  alert.style.bottom = "20px";
  alert.style.transition = "all 0.5s ease 0s";
  setTimeout(() => {
    alert.style.display = "none";
  }, 3000);
});
// / range slider
var rangeValue;

rangeSlider.addEventListener("input", (e) => {
  rangeValue = e.target.value;
  rangeSlider.value = rangeValue;
  range.value = rangeValue;
  callGeneratePassword();
});
range.addEventListener("input", (e) => {
  rangeValue = e.target.value;
  rangeSlider.value = rangeValue;
  range.value = rangeValue;
});

//switch btn on /off
for (var i = 0; i < switchBtns.length; i++) {
  switchBtns[i].addEventListener("click", (e) => {
    e.target.classList.toggle("active");

    var optionsID = e.target.parentElement.attributes.id.value;

    if (e.target.className == "switch active") {
      switch (optionsID) {
        case "option-lowercase":
          optionsCharacter.lowercase = true;
          break;
        case "option-uppercase":
          optionsCharacter.uppercase = true;
          break;
        case "option-numbers":
          optionsCharacter.numbers = true;
          break;
        case "option-symbols":
          optionsCharacter.symbols = true;
          break;

        default:
          break;
      }
    } else if (e.target.className == "switch") {
      switch (optionsID) {
        case "option-lowercase":
          optionsCharacter.lowercase = false;
          break;
        case "option-uppercase":
          optionsCharacter.uppercase = false;
          break;
        case "option-numbers":
          optionsCharacter.numbers = false;
          break;
        case "option-symbols":
          optionsCharacter.symbols = false;
          break;

        default:
          break;
      }
    }
  });
}

// lower case letter from 97 to 122 - 26 char

function getRandomLowerChar() {
  var lowerCase = Math.floor(Math.random() * 26 + 97);
  return String.fromCharCode(lowerCase);
}

function getRandomUpperChar() {
  var upperCase = Math.floor(Math.random() * 26 + 65);
  return String.fromCharCode(upperCase);
}

function getRandomNumber() {
  var number = Math.floor(Math.random() * 10 + 48);
  return String.fromCharCode(number);
}
function getRandomSymbol() {
  const SYMBOLS = "!@#$%^&*()-_+={}[].,<>:;";
  var symbol = Math.floor(Math.random() * SYMBOLS.length);

  return SYMBOLS[symbol];
}
