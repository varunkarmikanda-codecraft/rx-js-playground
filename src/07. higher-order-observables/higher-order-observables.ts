import { catchError, concatAll, concatMap, delay, filter, from, interval, map, mergeAll, mergeMap, Observable, of, switchMap, take, tap, throwError, timer } from "rxjs";
import { ajax } from "rxjs/ajax";
import XMLHttpRequest from "xhr2";

const numberObservables$ = of(1, 2, 3);  // Emits number, so normal observable
 
// const numberHOObservables$ = of(of(1, 2), of(3, 4, 5));
const numberHOObservables$ = of(of(1), of(2), of(3),of(4), of(5));

// numberHOObservables$.subscribe((value) => {
//   // So here value is an observable, Hence to get that we need to subscribe again
//   value.subscribe((innerValue) => console.log(innerValue));
// })

// Can we create a higher order observable, using pipe, and a map on number observable>
// for each value, we will transform it into a observable that emits a number

// const numberHOObservablesPipe$ = numberObservables$.pipe(map((value) => of(value)))

// const numbers = [1, 2, 3, 4];
// const transformed = numbers.map(value => [ value ]).flat();
// const transformed1 = numbers.flatMap(value => [ value ]);

// console.log(transformed)
// console.log(transformed1)


// Lets see few join operators that help flatten a map that was producing a higher order observables

// const numberHOObservablesPipe$ = numberHOObservables$.pipe(
//   tap((previousValue) => {
//     console.log("Prev val ",previousValue)
//     return of(1, 2, 3)  // Ignored
//   }),
//   map((value) => of(value)),// This produces an observable, that produces an observable as value
//   tap((previousObs) => {
//     console.log("Value after concatAll")
//     return previousObs;
//   }),
//   concatAll()
// ).subscribe((v) => {
//   console.log(v)
// })

const numberHOObservables1$ = of(
  interval(1).pipe(take(3)),
  of(11111, 21111).pipe(take(5)),
  of(1),
  of(2),
  of(3)
);

// numberHOObservables1$.pipe(concatAll()).subscribe((value) => console.log(value))


// ConcatAll is sequential process first > process second

// There is mergeAll, that does subscribe to all incoming observables and emit value as they arrive
// When the order of the observable doe snot matter than we can go to the mergeAll else concatAll 
// console.log("Merge all")
// numberHOObservables1$
//   .pipe(
//     // map((value) => of(value)),
//     mergeAll()
//   )
//   .subscribe((v) => {
//     console.log(v)
//   })

// Doing map to produce higer order observeble and then using concatAll and mergeAll

// we have mergeMap = map + merge

// const numberObservables3$ = from([10, 11, 12, 13])
// numberObservables3$.pipe(
//   // map((value) => of(value)),// This produces an observable, that produces an observable as value
//   concatMap((value) => of(value)) // Factory function and the callback must return an observable
// ).subscribe((v) => {
//   console.log("Concat Map: ", v)
// })

// // Merge map
// numberObservables3$
//   .pipe(
//     mergeMap(value => of(value))  // Factory function and the callback must return an observable
//   )
//   .subscribe((v) => {
//     console.log("merge map: ", v)
//   })

// switch map -> Factory 
// This operator will be consuming values which are observables, and it starts consuming or producing values from current observables but immediatly
// unsubscribes form it should see 

// To avoid the race conditions -> whn in search bars

// const obs3$ = of(3000, 2000, 1000, 4000);
// obs3$
//   .pipe(
//     switchMap((value) => timer(value).pipe(map(() => value)))
//   )
//   .subscribe((v) =>{
//     console.log("Switch map", v)
//   })

// const obs3$ = of(3000, 2000, 1000, 4000);
// let count = 2000;
// obs3$
//   .pipe(
//     // switchMap((value) => timer(value).pipe(map((v) => value)))
//     switchMap((value) => interval(value).pipe(take(2), map((v) => value)))
//   )
//   .subscribe((v) =>{
//     console.log("Switch map", v)
//   })



// const obs3$ = of(3000, 4000, 2000, 1000);
// let count = 2000;
// obs3$
//   .pipe(
//     // switchMap((value) => timer(value).pipe(map((v) => value)))
//     switchMap((value) => interval(value).pipe(take(1), map((v) => {
//       switch(value) {
//         case 1000:
//           return "one thousand";
//         case 2000:
//           return "two thousand";
//         case 3000:
//           return "three thousand";
//         case 4000:
//           return "four thousand";
//       }
//     })))
//   )
//   .subscribe((v) =>{
//     console.log("Switch map", v)
//   })


// const obs4$ = of(3000, 4000, 2000, 1000);
// obs3$
//   .pipe(
//     // switchMap((value) => timer(value).pipe(map((v) => value)))
//     switchMap((value) => of(value))
//   )
//   .subscribe((v) =>{
//     console.log("Switch map", v)
//   })



interface Geo {
  lat: string;
  lng: string;
}

interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
}

interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
}

function fetchUser(id: number): Observable<User> {
  return ajax({
    url: `https://jsonplaceholder.typicode.com/users/${id}`,
    createXHR: () => new XMLHttpRequest(),
  })  
  .pipe(
    map((httpResponse) => {
      return httpResponse.response as User;
    }),
    catchError(() => {
      const newError = new Error("the url is invalid, no resource is found");
      return throwError(() => newError)
    })
  );
}

const userIds = [1, 2, 3, 1000];
from(userIds)
  .pipe(
    concatMap(id => fetchUser(id)),
    catchError(error => {
      return of({ id: -1, name: "unknown"})
    }),
    filter(user => user.id !== 1),
    map(user => user.name),
  )
  .subscribe({
    next(user) {
      console.dir(user)
    },
  })