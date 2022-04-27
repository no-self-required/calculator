//Global variables to track state
const appState = {
  operationValue: "+",
  leftOperand: "0",
  rightOperand: "0",
};

const leftOperand = document.getElementById("left-operand");
const rightOperand = document.getElementById("right-operand");
const calculateButton = document.getElementById("calculate-button");
const operation = document.getElementsByName("operation");
const [operationContainer] = document.getElementsByClassName(
  "operation-container"
);

leftOperand.addEventListener("input", (e) => {
  const stringValue = e.target.value;
  console.log("stringV", stringValue);
  appState.leftOperand = stringValue;
});

rightOperand.addEventListener("input", (e) => {
  appState.rightOperand = e.target.value;
});

calculateButton.addEventListener("click", () => {
  if (!checkOperands()) {
    alert("Result is undefined");
    return;
  } else if (checkOperands() === "invalid") {
    alert("Invalid input");
    return;
  } else if (checkOperands() === "empty") {
    alert("Empty input");
    return;
  }
  sendCalculation();
});

operationContainer.addEventListener("input", () => {
  let checkedOperations = document.querySelector(
    'input[type="radio"]:checked'
  ).value;
  appState.operationValue = checkedOperations;
});

const sendCalculation = () => {
  const query = createQuery();
  makeRequest(query);
};


const checkOperands = () => {
  if (
    (appState.rightOperand === "0") &&
    appState.operationValue === "/"
  ) {
    return false;
  } else if (
    (appState.rightOperand === "0") &&
    appState.operationValue === "%"
  ) {
    return false;
  } else if (appState.leftOperand === "" || appState.rightOperand === "") {
    leftOperand.value = "0";
    rightOperand.value = "0";
    appState.leftOperand.value = "0";
    appState.rightOperand.value = "0";
    document.getElementById("expression-value").innerHTML = "";
    document.getElementById("result-value").innerHTML = "";
    return "invalid";
  } else if (
    appState.leftOperand.includes("e") ||
    appState.rightOperand.includes("e")
  ) {
    leftOperand.value = "0";
    rightOperand.value = "0";
    appState.leftOperand.value = "0";
    appState.rightOperand.value = "0";
    document.getElementById("expression-value").innerHTML = "";
    document.getElementById("result-value").innerHTML = "";
    return "invalid";
  } else {
    return true;
  }
};

const createQuery = () => {
  return (queryString = `http://localhost:8080/leftOperand=${parseInt(
    appState.leftOperand
  )}&rightOperand=${parseInt(appState.rightOperand)}&operation=${
    appState.operationValue
  }`);
};

const makeRequest = (query) => {
  httpRequest = new XMLHttpRequest();

  if (!httpRequest) {
    alert("Giving up :( Cannot create an XMLHTTP instance");
    return false;
  }
  httpRequest.onreadystatechange = alertContents;
  httpRequest.open("GET", query);
  httpRequest.send();

  function alertContents() {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        const objResponse = JSON.parse(httpRequest.responseText);
        setResults(objResponse);
      } else {
        alert("There was a problem with the request.");
      }
    }
  }
};

const setResults = (objResponse) => {
  const expressionString = objResponse.Expression;
  const resultString = objResponse.Result;
  document.getElementById("expression-value").innerHTML = expressionString;
  document.getElementById("result-value").innerHTML = resultString;
};
