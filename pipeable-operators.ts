import { of } from "./creational-operators.js";
import { Observable } from "./observable.js";

// An operator is a function that takes an observable and return an observable
type Operator<T, U> = (input$: Observable<T>) => Observable<U>;

// lets implement an operator double
const double: Operator<number, number> = (input$: Observable<number>): Observable<number> => {
  
  // Create the output observable. Its executor function must read the values of the input and double them,
  // and feed the output to the observer of the output observable
  // You get the reference to it in the executor function

  const output$ = new Observable((observer) => {
    const inputSubscription = input$.subscribe({
      next(value) {
        if(value !== undefined) {
          observer.next(value * 2);
        }
      },
    })

    return () => {
      inputSubscription.unsubscribe();
    }
  })

  return output$;

}

const square: Operator<number, number> = (input$: Observable<number>): Observable<number> => {
  const output$ = new Observable((observer) => {
    const inputSubscription = input$.subscribe({
      next(value) {
        if(value !== undefined) {
          observer.next(value * value);
        }
      },
    })

    return () => {
      inputSubscription.unsubscribe();
    }
  })

  return output$;
}

const first: Operator<unknown, unknown> = (input$: Observable<unknown>): Observable<unknown> => {
  const output$ = new Observable<unknown>((observer) => {
    const inputSubscription = input$.subscribe({
      next(value: unknown) {
        observer.next(value);
        // Soon after the consumption of the first value we need to unsubscribe
        inputSubscription.unsubscribe()
      },
    })
    return () => inputSubscription.unsubscribe();
  })
  return output$;
}


// we can actually chain these - compose or pipe

// We can create an observable that doubles and then squares a given observable and gets the first value.

const anObservable$ = of(1, 2, 3, 4);

const firstDoubledSquare$ = first(square(double(anObservable$)))
firstDoubledSquare$.subscribe({
  next(value) {
    console.log("From manual piping: ", value);
  }
})

const firstDoubledSquare1$ = anObservable$.pipe(double, square, first);
firstDoubledSquare1$.subscribe({
  next(value) {
    console.log("From observables piping: ", value);
  },
})