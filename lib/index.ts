export {}

type Fn = (...args: any[]) => any
type VoidFn = () => void

interface Subscription {
  unsubscribe: VoidFn
}

type NextFn = (value: any) => void
type ErrorFn = (error: any) => void
interface Observer {
  next: NextFn
  complete: VoidFn
  error: ErrorFn
}

class Observable {
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

function fromEvent(target: Element | Window | Document, eventName: string) {
  return new Observable((observer) => {
    target.addEventListener(eventName, observer.next)
    return () => {
      target.removeEventListener(eventName, observer.next)
    }
  })
}

function interval(period: number) {
  return new Observable((observer) => {
    let tick = 0
    let timer: number | null = setInterval(() => {
      observer.next(tick++)
    }, period)
    return () => {
      if (timer != null) {
        clearInterval(timer)
        timer = null
      }
    }
  })
}

// const click$ = fromEvent(document, 'click')
// click$.subscribe({
//   next: (event) => console.log(event.clientX, event.clientY),
// })

// const obs$ = new Observable((observer: Observer) => {
//   observer.next('some data')
// })

// const anObserver: Observer = {
//   next: (value) => console.log(value),
// }
// obs$.subscribe(anObserver)

// const interval$ = interval(1000)
// // interval$.subscribe({
// //   next: (tick) => console.log(tick),
// // })

// const subscription: Subscription = interval$.subscribe({
//   next: console.log,
// })

// // Later
// setTimeout(() => {
//   subscription.unsubscribe()
// }, 3000)

new Observable((observer: Observer) => {
  observer.next('Message 1')
  observer.error(new Error('e1'))
  observer.next('Message 2')
  observer.complete()
  return () => {
    console.log('Unsubscribed!')
  }
}).subscribe({
  next: (value) => console.log(value),
  complete: () => console.log('Complete'),
  error: () => console.log('Error'),
})
