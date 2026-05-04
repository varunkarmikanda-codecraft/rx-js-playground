import {
  Observable,
  type Observer,
  type Subscription,
} from "../02.observables/observable.js";

export class Subject<T> extends Observable<T> implements Observer<T> {
  private observers: Observer<T>[] = [];

  override subscribe(observer: Observer<T>): Subscription {
    if (!this.observers.find((value) => value === observer)) {
      this.observers.push(observer);
    }

    return {
      unsubscribe: () => {
        this.observers = this.observers.filter((obs) => obs !== observer);
      },
    };
  }

  next(value?: T) {
    // Broadcast value to all your observer
    this.observers.forEach((obs) => obs.next(value));
  }
  error(err: any): void {
    this.observers.forEach((obs) => obs.error?.(err));
  }
  complete(): void {
    this.observers.forEach((obs) => obs.complete?.());
  }
}
