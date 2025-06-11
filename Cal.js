let currentInput = "0";
let prevInput = "";
let operator = "";
let expression = "";
let waitingForNext = false;

const screen = document.querySelector(".calculator-screen");
const buttonsContainer = document.querySelector(".calculator-buttons");
const themeRadios = document.querySelectorAll('input[name="theme"]');
const expressionDisplay = document.getElementById("expression");
const resultDisplay = document.getElementById("result");

const body = document.body;

document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("calcTheme") || "1";
  body.classList.remove("theme-1", "theme-2", "theme-3");
  body.classList.add(`theme-${savedTheme}`);

  if (!localStorage.getItem("calcTheme")) {
    localStorage.setItem("calcTheme", "1");
  }

  document.querySelector(`input[value="${savedTheme}"]`).checked = true;
  updateScreen();
});

themeRadios.forEach(radio => {
  radio.addEventListener("change", (e) => {
    const selectedTheme = e.target.value; 
    body.classList.remove("theme-1", "theme-2", "theme-3");
    body.classList.add(`theme-${selectedTheme}`);
    localStorage.setItem("calcTheme", selectedTheme);
  });
});

function updateScreen() {
  resultDisplay.textContent = currentInput;
  expressionDisplay.textContent = expression;
}

function inputDigit(digit) {
  if (waitingForNext) {
    currentInput = digit;
    waitingForNext = false;
  } else {
    currentInput = currentInput === "0" ? digit : currentInput + digit;
  } 
  expression += digit;
}

function inputDecimal() {
  if (waitingForNext) {
    currentInput = "0.";
    waitingForNext = false;
  } else if (!currentInput.includes(".")) {
    currentInput += ".";
    expression += ".";
  }
}


function handleOperator(nextOperator) {
  const inputValue = parseFloat(currentInput);

  if (operator && !waitingForNext) {
    const result = performCalculation[operator](prevInput, inputValue);
    currentInput = String(parseFloat(result.toFixed(8)));
    prevInput = result;
    expression = result + " " + nextOperator + " ";
  } else {
    prevInput = inputValue;
    expression += " " + nextOperator + " ";
  }

  operator = nextOperator;
  waitingForNext = true;
}


function deleteLast() {
  if (waitingForNext) return;
  if (currentInput.length === 1) {
    currentInput = "0";
  } else {
    currentInput = currentInput.slice(0, -1);
  }
  expression = expression.slice(0, -1);
}

function resetCalculator() {
  currentInput = "0";
  prevInput = "";
  operator = "";
  expression = "";
  waitingForNext = false;
}



function handleEquals() {
  if (!operator || waitingForNext) return;

  const inputValue = parseFloat(currentInput);

  if (operator === "/" && inputValue === 0) {
    currentInput = "Error";
  } else {
    const result = performCalculation[operator](prevInput, inputValue);
    currentInput = String(parseFloat(result.toFixed(8)));
    expression += " =";
  }

  operator = "";
  prevInput = "";
  waitingForNext = true;
}

const performCalculation = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "*": (a, b) => a * b,
  "/": (a, b) => a / b,
};

document.addEventListener("keydown", (e) => {
  const key = e.key;

  if (!isNaN(key)) {
    inputDigit(key);
  } else if (key === ".") {
    inputDecimal();
  } else if (["+", "-", "*", "/"].includes(key)) {
    handleOperator(key);
  } else if (key === "Enter" || key === "=") {
    handleEquals();
  } else if (key === "Backspace") {
    deleteLast();
  } else if (key === "Escape") {
    resetCalculator();
  }

  updateScreen();
});


buttonsContainer.addEventListener("click", (e) => {
  const target = e.target;
  if (!target.matches("button")) return;

  const action = target.dataset.action;
  const type = target.dataset.type;
  const buttonValue = target.textContent;

  switch (action) {
    case "del":
      deleteLast();
      break;
    case "reset":
      resetCalculator();
      break;
    case "equals":
      handleEquals();
      break;
    default:
      if (type === "digit") {
        inputDigit(buttonValue);
      } else if (type === "decimal") {
        inputDecimal();
      } else if (type === "operator") {
        handleOperator(buttonValue);
      }
      break;
  }

  updateScreen();
});