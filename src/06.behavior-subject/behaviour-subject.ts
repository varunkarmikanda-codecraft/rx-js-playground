import type { Observer, Subscription } from "../02.observables/observable.js";
import { Subject } from "../05.subjects/subject.js";

export class BehaviourSubject<T> extends Subject<T> {
  currentValue: T | null = null;

  override subscribe(observer: Observer<T>): Subscription {
    if (this.currentValue) observer.next(this.currentValue);

    return super.subscribe(observer);
  }

  override next(value?: T) {
    this.currentValue = value ?? null;
    super.next(value);
  }

  constructor(initialValue: T) {
    super();
    this.currentValue = initialValue;
  }
}
