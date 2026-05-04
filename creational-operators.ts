import { Observable } from './observable.js';

function of<T>(...values: T[]): Observable<T> {
  // Create an observable
  const observable = new Observable<T>((observer) => {
    // Produce value from the received value
    for(const value of values) {
      // tell the observer that the value is available
      observer.next(value);
    }
    // we are done producing values
    observer.complete?.();
    return null;
  })
  return observable;
}

function from<T>(iterable: Iterable<T>): Observable<T> {
  const observable = new Observable<T>((observer) => {
    for(const value of iterable) {
      observer.next(value);
    }
    observer.complete?.();
    return null;
  })
  return observable;
}

function range(start: number, count: number): Observable<number> {
  const observable = new Observable((observer) => {
    for(let s = start; s <= count; s++) {
      observer.next(s);
    }
    observer.complete?.();
    return null;
  })

  // implicitly conveying that there is no cleanup function needed

  return observable;
}

function interval(milliseconds: number): Observable<number> {
  const observable = new Observable((observer) => {
    let count = 0;
    const interval = setInterval(() => {
      // convey the current  value of the observer
      observer.next(count++);
    }, milliseconds);

    // now forced to return a proper cleanup or a cleanup is not needed
    return () => clearInterval(interval)
  })

  return observable;
}

function timer(dueTimeMilliseconds: number): Observable<number> {
  const observable = new Observable((observer) => {
    const timeout = setTimeout(() => {
      // convey the current  value of the observer
      observer.next();
    }, dueTimeMilliseconds);

    // now forced to return a proper cleanup or a cleanup is not needed
    return () => clearTimeout(timeout)
  })

  return observable;
}
export { of, from, range, interval, timer };
