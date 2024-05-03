// beauty of Javascript runtime environment(JRE) 
// to execute JS, you need JRE and you can fit this JRE anywhere and then execute JS anywhere
// Browsers, Node.js, even Java all has JRE

// JRE has - JS Engine + API(some basic functions like setTimeout, console, window etc.) + callback Queue + microTask Queue

/* 
 JS Engine - V8 engine
 1. take the code
 2. parse it, here it generates AST(Abstract syntax tree, its like dividing code into tokens)
 3. compiling - it uses both interpreter and compiler. JS is interpreted lang but V8 makes it interpreted and compiled lang using JIT
 interpreted means it directly start executing the code from the first line
 compiled means first generates an optimized code and then execute it
 There's a thing called JIT(Just in Time) compilation, it means just before(or sometime after in case of AOT(ahead of time compilation))
 interpretation, it compiles the code.
 4. execution


 we have some useful things here like
 1. callStack
 2. Memory heap
 3. Garbage Collector - uses Mark & sweep algo, olipan 
 4. inlining
 4. inline caching
 5. copy elision
 */

 /*
 JS Execution context(EC) - it will be created when you run a program - it has two parts
 1. Memory component(aka variable env) - contains variables and function as key-value pairs
 2. code component(aka thread of execution) -  contains the code, and gets executed line by line

 JS is a single threaded synchronous programming lang
  */
 
/*
 How a program gets executed in JS
 1. first of all, a EC is being created and this one will be called Global execution context(GEC)
 2. now it will go through all the code and allocates space for variables and functions in Memory component = this will be first phase aka memory phase
  2.a for variables it will store undefined
  2.b for functions it will store whole definition as it is
 3. now we will go again through all the code for code component
  3.a for variable it will change the value from undefined to that value
  3.b for functions it will create a new EC just for this function 
    3.b.1 memory component will have arguments and local function variables
    3.b.2 code component will just iterate through the definition of function and executes the code and also update the variables in execution context 

 4. after function is completed, EC made for this function will be removed from the callstack and control goes back to GEC when the function was invoked
 
 so we had a callStack for the ECs and we don't need another callstack for a particular EC.
 */

/*
  Hoisting - you can access variables and functions before declaring them - for example

  getName();
  console.log(x);

  var x = 5;
  function getName() {
    return "ravi";
  }

  this programs prints 
  ravi
  undefined

  this is because of execution context
*/

  // undefined = memory has reserved but don't have any value


/*
  let and const and functions are all hoisted but we can't access let and const before declaration
  they are hoisted means they will have a space in memory(not in global space but in a script space, some diff spcae)
  but we can't access them

  Temporal dead zone - the time between let and const hoisted till they get a value(or declared) and in this zone we can't access them

  */

// we can redeclare var variables
// var a = 10;
// var a = 20;
// console.log(a) = 20 , and NO errors

/*
 Block = {}
 let and const are block scoped, means if some let is declared in a block then we can only access them inside block 
 we can't access them outside the block since they were had the memory in the block space(a new space was created for the block)

 but var is global scoped, it means var is always have its place in global space means we can access var outside block 
 even if var is declared in block
 */
 {
  var aA = 10
  let bB = 20
  const cC = 30
  console.log(aA, bB, cC)
 }
 console.log(aA) // we can access var here but we can't access let and const outside of their scope 
//  console.log(bB)
//  console.log(cC)

function counter() {
  var count =0
}
counter()
// console.log(count) // even though var is global scoped, we can't access count because each function has its diff EC 

/*
 Lexical scope = scope of an item's definintion - means the area/scope where its defined, not where its invoked  
*/

/*
 Closure -- function with its lexical scope - closure has the function and the access to the items where that function is defined 
*/
var vari = 200
function x () {
  var a = 10
  function y() {
    console.log(a, vari) // and if doesn't found in the function and its parent function then it will keep searching in the upper heirarchy
  }
  return y
}
var z = x()
z() // here z = y and even though x is gone, y will remember a and that's the function with its lexical scope(surrounding space) 
// y have x's items access means it have their reference not the value

// setTimeout - executes the callback function after the given time period.
function timed() {
  let i = 1000
  setTimeout(function () {
    console.log(i)
  }, 3000)
  i = 2000 // setTimeout will print 2000 not 1000 because it remembers the reference of i not the value
          // and we can only have one lexical scope 
  console.log('hello')
}
timed()
console.log('yellow')
// yellow will be printed before setTimeout's i, means timed function is gone
// means setTimeout's callback function is a closure since it's a function that remembered its lexical scope 

/*
functions
 */
above()
// below()

function above () {
  console.log('above')
}

var below = function () {
  console.log('below')
}
// the difference betwween above functions are hoisting, we can call above but we can't call below before declaration

// callbacks - nothing but a function passed as argument and can be called by some other function any time
/*
 Synchronous programming - executing code line by line 
 now for example, if we use setTimeout - in that we pass a callback fn and a timer and that callback function will be executed
 after timer goes off. so the code here does not gets executed line by line because setTimer's code will be executed after timer
 and in the meantime JS will execute the code written after setTimeout

 so that's how callback provides async prog.
 */

// data hiding using callback and closure
let count = 0 // making this variable global isn't a good idea as it can be changed by anyone
document.getElementById('clickMe').addEventListener('click', function xyz() {
  console.log(++count)
})

function eventListenerFn () {
  let counter = 0 // no one can change this because no one can use counter outside this fn
  document.getElementById('clickMe2').addEventListener('click', function increaseCounter() {
    console.log(++counter)
  })
}
eventListenerFn()

/*
Event loop

JS only has callstack, memory component and global execution context
Browser has Web APIs like window object, setTimeout, fetch API, DOM API(browser has access to DOM not JS) etc.

whenever a Web API gets called like setTimeout, browser will handle timer and browser will register the callback(somewhere in the memory)
Browser has there are three things 
1. event loop - continuosly checks if there are callback to execute in both queues and if the callstack is empty then push the front callback in the callstack

2. callback queue - lets say for setTimeout when timer goes off, its callback will be pushed into the queue
                  - lets for event handler, when someone clicks on the button, the callback will be pushed into the queue

3. microtask queue - this handler callbacks only for promises and mutation observer(whenever there is change in dom tree)
                  - this has higher prio then callback queue so event loop will be checking in the event loop

example for setTimeout - when timer goes off, callback will be pushed in the callback queue and then event loop will check 
this queue and it will find that there's a callback needs to be executed and then event loop will check callstack 
if its empty then it will check push the callback in the callstack
 */

// Note - console, setTimeout etc. all are entries in Windows object but we don't have to use window keyword
// because its available to use at global scope

/*
 callback hell - callbacks inside callbacks meaning so many nested callbacks
 this creates readability and maintainbility problem in code
 
 how this problem will be generated
 when we need to do something after we get success from the current tasks

 currentTask(currParams, function () {
  nextTask1(next1Params, function () {
    nextTask2(next2Params, function () {
      nextTask3(next3Params, function () {

      })
    })
  })
 })

 above code looks like pyramid(pyramid of doom) - this code is not readable at all.
 */


/*
Promise status - Pending, fullfilled(Resolved), reject  
 */
const promise1 = new Promise(function () {
  // the code inside promise starts executing as soon they get created
  // but we will get the result of the promise when we consume it
})
console.log(promise1)

const promise2 = new Promise((resolve, reject) => {
  resolve("promise2 fullfilled") // here this code is executed as promise2 is created means when line 239 get executed
  // but we will recieve resolve's string when we consume it
})
const promiseResult = promise2.then((data) => {
  console.log(data)
  return 5 // we will get this 5 when we consume the promise returned by 5, this will always go into then coz we are not using resolve,reject
})
console.log(promiseResult) // then always returns a promise - that's why we can do promise chaining
promiseResult.then(data => { // and then we can consume that promise
  console.log("data is", data)
}).catch((err) => {
  console.log("err is ", err)
})

function getPromise3 () {
  return new Promise((resolve, reject) => {
    resolve("promise3 fullfilled")
  })
}
promise2.then(data => {
  console.log(data)
  return getPromise3()
}).then(data => {
  console.log(data)
})

// catch also returns a promise
const promise4 = new Promise((resolve, reject) => {
  reject("rejected")
})
const promiseResult4 = promise4.catch((err) => {
  console.log(err)
})
console.log(promise4) // here we can see that catch also returns a promise, so if you will put then after catch
// that then will always be called because catch returned a promise

// we created promise so that we don't do callback hell
/*
// creating the promise
const myPromise = new Promise((resolve, reject) => {
  try {
    const data = api(params)
    resolve(data)
  } catch(err) {
    reject(err)
  }
})

// consuming the promise
myPromise.then((data) => {
  console.log(data) -> returned by resolve
}).catch((err) => {
  console.log(err) -> returned by reject
})
 */

// promises chaining - shopping order example
createOrder({}) // these function will call their APIs and returns a promise  
  .then((orderId) => {
  console.log(orderId)
  return proceedToPayment(orderId)
}).then(paymentInfo => {
  console.log(paymentInfo)
  return orderSummary(paymentInfo)
}).then(orderInfo => {
  console.log(orderInfo)
  showOrderInfo(orderInfo)
}).catch(err => { // we just need one catch for all then
  console.log(err)
})

function createOrder(cart) {
  return new Promise((resolve, reject) => {
    resolve("12345")
  })
}
function proceedToPayment(orderId) {
  return new Promise((resolve, reject) => {
    if (typeof orderId != "number") {
      reject("Payment unsuccessful")
    } else {
      resolve("Payment successful")
    }
  })
}
function orderSummary(paymentInfo) {
  return new Promise((resolve, reject) => {
    if (paymentInfo === "Payment unsuccessful") {
      resolve("order is dispatched")
    } else {
      reject("order cannot be dispatched")
    }
  })
}

// if you want to use catch for each individual promises
createOrder({})
  .then((orderId) => {
  console.log(orderId)
  return proceedToPayment(orderId)
}).catch(err => {
  console.log(err)
}).then(paymentInfo => {
  console.log(paymentInfo)
  return orderSummary(paymentInfo)
}).catch(err => {
  console.log(err) // here we will get the error but the following then will run no matter what becuase cathc also returns a promise
}).then(orderInfo => {
  console.log(orderInfo)
  // showOrderInfo(orderInfo)
}).catch(err => { 
  console.log(err)
})

/*
promise.all - it takes array of promises and runs them parallely and returns an array of data

because of parallel run - total time of execution = max(time of execution of all promises)

if any promises fails then it will not run other promises which are yet to be executed 
 */

/*
promise.allSettled - same as promise.all but it waits for all promises to be returned no matter of data or error
then it returns array of data and error(if some promise returns the error)
means there only be .then - we won't use .catch
 */

