import { of } from "./creational-operators.js"
import type { Observer } from "./observable.js"
import { Subject } from "./subject.js"

const aSubject$ = new Subject<number>()
aSubject$.next(10)

const obs1: Observer<number> = {
  next(value) {
    console.log("Obs1 received: ", value)
  },
}

const obs2: Observer<number> = {
  next(value) {
    console.log("Obs2 received: ", value)
  },
}

const obs1Sub = aSubject$.subscribe(obs1)
const obs2Sub = aSubject$.subscribe(obs2);

aSubject$.next(1)

// obs2Sub.unsubscribe();

aSubject$.next(5);


of(1, 2, 3, 4, 5, 6).subscribe(aSubject$);