type VoidFn = () => void

export interface Subscription {
  unsubscribe: VoidFn
}

type NextFn = (value: any) => void
type ErrorFn = (error: any) => void

export interface Observer {
  next: NextFn
  complete: VoidFn
  error: ErrorFn
}

export class Observable {
  private _unsubscribe: VoidFn = () => {}
  constructor(private _subscribe: (observer: Observer) => VoidFn) {}
  private _stopped = true

  subscribe(observer: Observer): Subscription {
    this._stopped = false

    const unsubscribe = this._subscribe({
      next: (value: any) => {
        if (!this._stopped) {
          observer.next(value)
        }
      },

      complete: () => {
        if (!this._stopped) {
          observer.complete()
          this._stop()
        }
      },

      error: (error: any) => {
        if (!this._stopped) {
          observer.error(error)
          this._stop()
        }
      },
    })

    if (unsubscribe) {
      this._unsubscribe = unsubscribe
    }

    return {
      unsubscribe: this._unsubscribe.bind(this),
    }
  }

  _stop() {
    if (!this._stopped) {
      this._stopped = true
      setTimeout(() => {
        this._unsubscribe()
      })
    }
  }
}
