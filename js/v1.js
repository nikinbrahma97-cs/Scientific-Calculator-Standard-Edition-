// Calculator State

let expression = "";
let currentValue = "0";

// DOM Elements

const displayMain = document.getElementById("display-main");
const displayExpression = document.getElementById("display-expression");

const arithmeticKeyButtons = document.querySelectorAll(".key--op");
const numberButtons = document.querySelectorAll(".key--num");

const equalButton = document.getElementById("btn-equals");
const clearButton = document.getElementById("btn-clear");
const clearEntryButton = document.getElementById("btn-clear-entry");
const backspaceButton = document.getElementById("btn-backspace");

const openBrace = document.getElementById("btn-open-paren");
const closedBrace = document.getElementById("btn-close-paren");

const powerButton = document.getElementById("btn-power");
const sqrtButton = document.getElementById("btn-sqrt");
const cbrtButton = document.getElementById("btn-cbrt");
const piButton = document.getElementById("btn-pi");
const eulerButton = document.getElementById("btn-euler");

const negateButton = document.getElementById("btn-negate");
const naturalLogButton = document.getElementById("btn-ln");
const logButton = document.getElementById("btn-log");
const factorialButton = document.getElementById("btn-factorial");

// Display

function updateDisplay() {
  displayExpression.textContent = expression;
}

function updateMainDisplay(value) {
  displayMain.textContent = value;
}

// Number Buttons

numberButtons.forEach(button => {
  button.addEventListener("click", () => {
    expression += button.textContent;

    updateDisplay();
    updateMainDisplay(button.textContent);
  });
});

// Arithmetic Operators

arithmeticKeyButtons.forEach(button => {
  button.addEventListener("click", () => {
    expression += button.textContent;

    updateDisplay();
  });
});

// Special Operators

negateButton.addEventListener("click", () => {
  expression += "-";
  updateDisplay();
});


powerButton.addEventListener("click", () => {
  expression += "^";
  updateDisplay();
});


factorialButton.addEventListener("click", () => {
  expression += "!";
  updateDisplay();
});

// Parentheses

openBrace.addEventListener("click", () => {
  expression += "(";
  updateDisplay();
});


closedBrace.addEventListener("click", () => {
  expression += ")";
  updateDisplay();
});

// Constants

piButton.addEventListener("click", () => {
  expression += "π";

  updateDisplay();
  updateMainDisplay("π");
});


eulerButton.addEventListener("click", () => {
  expression += "e";
  
  updateDisplay();
  updateMainDisplay("e");
});


// Mathematical Functions

sqrtButton.addEventListener("click", () => {
  expression += "sqrt(";
  updateDisplay();
});


cbrtButton.addEventListener("click", () => {
  expression += "cbrt(";
  updateDisplay();
});


naturalLogButton.addEventListener("click", () => {
  expression += "ln(";
  updateDisplay();
});


logButton.addEventListener("click", () => {
  expression += "log(";
  updateDisplay();
});

// Equals

equalButton.addEventListener("click", () => {
  try {
    const result = calculates(expression);

    updateMainDisplay(result);
    currentValue = String(result);
  }
  catch (error) {
    updateMainDisplay("ERROR");
    console.error(error);
  }
});

// Clear

function clearCalculator() {
  expression = "";
  currentValue = "0";

  displayExpression.textContent = "";
  displayMain.textContent = "0";
}

clearButton.addEventListener("click", clearCalculator);

clearEntryButton.addEventListener("click", clearCalculator);

// Backspace

backspaceButton.addEventListener("click", () => {
  if (expression.endsWith("sqrt(")) {
    expression = expression.slice(0, -5);
  }

  else if (expression.endsWith("cbrt(")) {
    expression = expression.slice(0, -5);
  }

  else if (expression.endsWith("log(")) {
    expression = expression.slice(0, -4);
  }

  else if (expression.endsWith("ln(")) {
    expression = expression.slice(0, -3);
  }

  else {
    expression = expression.slice(0, -1);
  }

  updateDisplay();

  if (expression === "") {
    updateMainDisplay("0");
  }
});``