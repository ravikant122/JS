const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    // setTimeout will be registered and started getting executed as soon p1 promise get registed means as line 1 gets executed
    resolve("p1 resolved"); // but we will get this string when we consume this string
    // this means if we consume this promise after setTimeout's timer, the string will be available to us quickly
    // but if consume this promise lets say after 10 sec then we have to wait for 20 sec
  }, 3000);
});

const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("p2 resolved");
  }, 1000);
});

/*
Async Await theory

async function always returns a promise, if we don't return a promise then it will return a promise(some pending promise with undefined result)

await is replacement of .then, in .then we have the result in the callback function of .then
await will just return data and we can store that in some variable
 */
async function handlePromise() {
  console.log("hello world");

  // we have to wait 30 sec for p1 to get result but we don't have to wait for p2(we'll get its result in no time)
  // because while p1's setTimeout expires, p2's setTimeout got already expired
  // and first we will have value in val1 in 30 sec and then value in val2 in no time because both promises's setTimeout
  // getting executing parallely in browser

  const val1 = await p1; // as soon this line hits, the function handlePromise will get suspended from callstack
  // that's how the executed gets stop after using await, meaning until p1 gets resolved, the code execution won't move to the next line
  console.log(val1);
  console.log("namaste js1");

  const val2 = await p2;
  console.log(val2);
  console.log("namaste js2");

  /*
    we can also write above code in promise style
    p1.then(function (val1) => {
      console.log(val1)
      console.log('namaste js1')

      p2.then((val2) => {
        console.log(val2)
        console.log('namaste js2')
      })
    })

    that's why the code after await waits for await's promise to get completed
    async await is just syntactical sugar for the promise
    and promises are the syntactical sugar for the callbacks
   */
}

const result = handlePromise(); // handlePromise doesn't return anything so result will be a pending promise with undefined result
console.log(result);

// below line will not wait for anyone, the code which is after await will wait but in async function only
// the code outside after async function will not wait for the await's result
// because as await gets executed, the async function gets suspended from callstack
// and the code after the line which called the async function will get executed again(because the callback is empty now since async function gets suspended)
console.log("not waiting anymore");
