import { of } from "./creational-operators.js";
import { Observable } from "./observable.js";

// An operator is a function that takes an observable and return an observable
type Operator<T, U> = (input$: Observable<T>) => Observable<U>;

// lets implement an operator double
const double: Operator<number, number> = (
  input$: Observable<number>,
): Observable<number> => {
  // Create the output observable. Its executor function must read the values of the input and double them,
  // and feed the output to the observer of the output observable
  // You get the reference to it in the executor function

  const output$ = new Observable((observer) => {
    const inputSubscription = input$.subscribe({
      next(value) {
        if (value !== undefined) {
          observer.next(value * 2);
        }
      },
    });

    return () => {
      inputSubscription.unsubscribe();
    };
  });

  return output$;
};

const square: Operator<number, number> = (
  input$: Observable<number>,
): Observable<number> => {
  const output$ = new Observable((observer) => {
    const inputSubscription = input$.subscribe({
      next(value) {
        if (value !== undefined) {
          observer.next(value * value);
        }
      },
    });

    return () => {
      inputSubscription.unsubscribe();
    };
  });

  return output$;
};

const first: Operator<unknown, unknown> = (
  input$: Observable<unknown>,
): Observable<unknown> => {
  const isFirstItemSeen = false;

  const output$ = new Observable<unknown>((observer) => {
    const inputSubscription = input$.subscribe({
      next(value: unknown) {
        if (isFirstItemSeen) {
          return;
        } else {
          observer.next(value);

          // Soon after the consumption of the first value we need to unsubscribe
          setTimeout(() => inputSubscription.unsubscribe());
        }
      },
    });
    return () => inputSubscription.unsubscribe();
  });
  return output$;
};

// we can actually chain these - compose or pipe

// We can create an observable that doubles and then squares a given observable and gets the first value.

// const anObservable$ = of(1, 2, 3, 4);

// const firstDoubledSquare$ = first(square(double(anObservable$)))
// firstDoubledSquare$.subscribe({
//   next(value) {
//     console.log("From manual piping: ", value);
//   }
// })

// const firstDoubledSquare1$ = anObservable$.pipe(double, square, first);
// const firstDoubledSquare1 = firstDoubledSquare1$.subscribe({
//   next(value) {
//     console.log("From observables piping: ", value);
//   },
// });

// firstDoubledSquare1.unsubscribe();

const map = function <T, U>(transform: (value: T) => U): Operator<T, U> {
  // TODO
  // Must return an operator that takes an input observable as an argument
  // And then applies the transform function on each value emitted by the input observable, and then emit the transformed value to the output observables observer

  return (input$: Observable<T>): Observable<U> => {
    const output$ = new Observable((observer) => {
      const inputSubscription = input$.subscribe({
        next(value) {
          if (value) observer.next(transform(value));
        },
      });
      return () => inputSubscription.unsubscribe();
    });

    return output$;
  };
};

const double1 = map<number, number>((value) => value * 2);
const square1 = map<number, number>((value) => value * value);
const structured = map<number, { value: number }>((value) => ({ value }));

// const doubleSquare = of(10, 11, 12, 13).pipe(double1, square1, structured);
// doubleSquare.subscribe({
//   next(value) {
//     console.log(value);
//   },
// });

const filter = function <T>(predicate: (value: T) => boolean): Operator<T, T> {
  return (input$: Observable<T>): Observable<T> => {
    const output$ = new Observable((observer) => {
      const inputSubscription = input$.subscribe({
        next(value: T) {
          if(predicate(value)) observer.next(value);
        },
      });
      return () => inputSubscription.unsubscribe();
    });
    return output$;
  };
};

const greaterThanSix = filter<number>((value) => value > 6)
const lessThanSeven = filter<number>((value) => value < 7)
const structure = map<number, { value: number }>((value) => ({ value }))
const sixSeven = of(5.1, 5.9, 8.4, 6.7, 7.3, 6.3, 5.8, 6.8, 6.5).pipe(greaterThanSix, lessThanSeven, structure);

sixSeven.subscribe({
  next(value) {
    console.log(value);
  },
});