// Tokenizer

function tokenize(expression) {

  expression = expression.replaceAll("−", "-");

  const tokens = [];
  let number = "";
  let word = "";
  for (const char of expression) {
    if ("1234567890.".includes(char)) {
      number += char;
    }

    else if ("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZπe".includes(char)) {
      word += char;
    }

    else {

      if (number !== "") {
        tokens.push(Number(number));
        number = "";
      }
      if (word !== "") {
        tokens.push(word);
        word = "";
      }

      if (char === "-") {
        const previous = tokens[tokens.length - 1];
        const isUnary =
          tokens.length === 0 ||
          ["+", "-", "×", "÷", "^", "(", ","].includes(previous);
        tokens.push(isUnary ? "u-" : "-");
      }

      else {
        tokens.push(char);
      }
    }
  }

  if (number !== "") {
    tokens.push(Number(number));
  }

  if (word !== "") {
    tokens.push(word);
  }
  return tokens;
}

// Validation

function validate(tokens) {
  const operators = "+-*/";

  for (let i = 0; i < tokens.length; i++) {
    const current = tokens[i];
    const next = tokens[i + 1];

    if (operators.includes(current) && operators.includes(next)) {
      const isUnaryContext =
        (next === "+" || next === "-") &&
        typeof tokens[i + 2] === "number";

      if (!isUnaryContext) {
        return false;
      }
    }
  }
  return true;
}

// Shunting-Yard Algorithm
// Infix → RPN

function shuntingYard(tokens) {
  const precedence = {
    "+": 1,
    "-": 1,
    "×": 2,
    "÷": 2,
    "^": 3,
    "u-": 4,
    "!": 5
  };

  const rightAssociative = {
    "^": true,
    "u-": true
  };

  const functions = new Set([
    "sqrt",
    "cbrt",
    "log",
    "ln"
  ]);

  const constants = new Set([
    "π",
    "e"
  ]);

  const output = [];
  const opStack = [];

  for (const token of tokens) {
    if (typeof token === "number") {
      output.push(token);
    }

    else if (functions.has(token)) {
      opStack.push(token);
    }

    else if (constants.has(token)) {
      output.push(token);
    }

    else if (token === ",") {
      while (
        opStack.length &&
        opStack[opStack.length - 1] !== "("
      ) {
        output.push(opStack.pop());
      }
    }

    else if (token in precedence) {

      while (
        opStack.length &&
        opStack[opStack.length - 1] !== "(" &&
        opStack[opStack.length - 1] in precedence &&
        (
          precedence[opStack[opStack.length - 1]] >
          precedence[token] ||  
          (
            precedence[opStack[opStack.length - 1]] ===
            precedence[token] &&
            !rightAssociative[token]
          )
        )
      ) {
        output.push(opStack.pop());
      }
      opStack.push(token);
    }

    else if (token === "(") {
      opStack.push(token);
    }

    else if (token === ")") {
      while (
        opStack.length &&
        opStack[opStack.length - 1] !== "("
      ) {
        output.push(opStack.pop());
      }
      opStack.pop();
      if (
        opStack.length &&
        functions.has(opStack[opStack.length - 1])
      ) {
        output.push(opStack.pop());
      }
    }
  }
  while (opStack.length) {
    output.push(opStack.pop());
  }
  return output;
}

// RPN Evaluator

function evaluateRPN(rpn) {
  const functions = {
    sqrt: a => Math.sqrt(a),
    cbrt: a => Math.cbrt(a),
    ln: a => Math.log(a),
    log: a => Math.log10(a)
  };

  const unaryOperators = {
    "u-": a => -a,
    "!": a => {
      if (a < 0 || !Number.isInteger(a)) {
        throw new Error("INVALID FACTORIAL");
      }
      let result = 1;
      for (let i = 2; i <= a; i++) {
        result *= i;
      }
      return result;
    }
  };

  const operators = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "×": (a, b) => a * b,
    "÷": (a, b) => {
      if (b === 0) {
        throw new Error("CANNOT DIVIDE BY 0");
      }
      return a / b;
    },
    "^": (a, b) => Math.pow(a, b)
  };

  const constants = {
    π: Math.PI,
    e: Math.E
  };

  const stack = [];

  for (const token of rpn) {
    if (typeof token === "number") {
      stack.push(token);
    }

    else if (token in functions) {
      if (stack.length < 1) {
        throw new Error("INVALID EXPRESSION");
      }
      const a = stack.pop();
      const result = functions[token](a);
      stack.push(result);
    }

    else if (token in operators) {
      if (stack.length < 2) {
        throw new Error("INVALID EXPRESSION");
      }
      const b = stack.pop();
      const a = stack.pop();
      const result = operators[token](a, b);
      stack.push(result);
    }

    else if (token in constants) {
      stack.push(constants[token]);
    }

    else if (token in unaryOperators) {
      if (stack.length < 1) {
        throw new Error("INVALID EXPRESSION");
      }
      const a = stack.pop();
      const result = unaryOperators[token](a);
      stack.push(result);
    }

    else {
      throw new Error(`UNKNOWN TOKEN: ${token}`);
    }
  }

  if (stack.length !== 1) {
    throw new Error("INVALID EXPRESSION");
  }
  return stack[0];
}

// Main Calculator Pipeline

function calculates(expression) {
  const tokens = tokenize(expression);
  if (!validate(tokens)) {
    throw new Error("INVALID EXPRESSION");
  }
  const rpn = shuntingYard(tokens);
  return evaluateRPN(rpn);
}