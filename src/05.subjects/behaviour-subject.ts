import type { Observer, Subscription } from "../02.observables/observable.js";
import { Subject } from "./subject.js";

export class BehaviourSubject<T> extends Subject<T> {
  mostRecentValue: T | null = null;

  override subscribe(observer: Observer<T>): Subscription {
    if (this.mostRecentValue) observer.next(this.mostRecentValue);

    return super.subscribe(observer);
  }

  override next(value?: T) {
    this.mostRecentValue = value ?? null;
    super.next(value);
  }
}
