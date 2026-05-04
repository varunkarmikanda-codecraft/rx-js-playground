import { interval, timer } from "./creational-operators.js";

const interval$ = interval(1000);   // Any observable is suffixed with $ after it

const intervalSubscription = interval$.subscribe({
  next(count) {
    console.log(count);
    if(count === 5) intervalSubscription.unsubscribe();
  }
})

timer(7000).subscribe(({
  next() {
    intervalSubscription.unsubscribe()
  }
}))



// setTimeout(() => {
//   intervalSubscription.unsubscribe()
// }, 5000)