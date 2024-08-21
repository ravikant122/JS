async function calculateSum() {
  const a = parseInt(document.getElementById("firstNum").value);
  const b = parseInt(document.getElementById("secondNum").value);

  const response = await fetch(
    `https://sum-server.100xdevs.com/sum?a=${a}&b=${b}`
  );
  const sum = await response.text();
  document.getElementById("finalSum").innerHTML = sum;
}

/*
if previous timeout exists then cancel it and start a new one, if timeout is finished then no worries, it won't clear any 
timeout because that has been executed already

let timeout;
function debounceCalculateSum() {
  clearTimeout(timeout);
  timeout = setTimeout(calculateSum, 1000);
}

drawback of above function:
1. uses a global variable, anyone can change it
2. function is not generic, means its not reusable if we want to use it for some other debouncing 
*/

function debounceCalculateSum(callback, delay) {
  let timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(callback, delay);
  };
}

const betterDebounceCalculateSum = debounceCalculateSum(calculateSum, 1000);
/*
  how it remembring the old value of timeout everytime the user inputs

  1. debounceCalculateSum only gets called on time, it returns an function and this function is then getting stored in 
    betterDebounceCalculateSum and we call this function when user input in the html
  2. here we are using closure, the inner function returned by debounceCalculateSum remembers the reference of timeout variable
    even though the debounceCalculateSum's call is finished.
*/
