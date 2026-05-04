export interface Observer<T> {
  next(value: T): void;
  error(err: any): void;
  complete (): void;

}

export type CleanupFunction = () => void

export type Executor<T> = (observer: Observer<T>) => CleanupFunction | void;

export class Observable<T> {
  private readonly executor: Executor<T>

  constructor(executor: Executor<T>) {
    this.executor = executor;
  }

  subscribe(observer: Observer<T>) {
    const cleanup = this.executor(observer);

    return {
      unsubscribe() {
        if(cleanup) cleanup();
      }
    }
  }
}

const timerObservable = new Observable<number>((observer) => {
  console.log("Timer started!");
  let count = 0;
  const intervalId = setInterval(() => {
    observer.next(count++);
    console.log("Value: ", count);
  }, 1000);
  return () => clearInterval(intervalId);
})

const subscription = timerObservable.subscribe({
  next(value) {
    console.log("Reciver value: ", value);
  },
  error(err) {
    console.log("Error: ", err);
  },
  complete() {
    console.log("Completed!")
  },
});

setTimeout(() => {
  console.log("unsubscribed")
  subscription.unsubscribe();
}, 5000)


// Implement a function called as of(..) that will take a variable number of arguments and return an observable that emits those arguments sequentially and then completes. For example, of(1, 2, 3) should return an observable that emits 1, then 2, then 3, and then completes.

const of = <T>(...args: T[]): Observable<T> => new Observable<T>((observer) => {
  for(const arg of args) {
    observer.next(arg);
  }
  observer.complete()
})

of(1, 2, 3).subscribe({
  next: (value) => console.log("of Value: ", value),
  error: (err) => console.log(err),
  complete: () => console.log("of completed")
})


// Implement a function called from([...]) that takes an array of values and returns an observable that emits each value from the array sequentially and then completes. For example, from([1, 2, 3]) should return an observable that emits 1, then 2, then 3, and then completes.

const from = <T>(arg: T[]): Observable<T> => new Observable((observer) => {
  for(const ar of arg) {
    observer.next(ar);
  }
  observer.complete();
})

from([1, 2, 3]).subscribe({
  next: (value) => console.log("from Value: ", value),
  error: (err) => console.log(err),
  complete: () => console.log("from completed")
})