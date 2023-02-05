import { count, pipe } from 'rxjs'
import { Observable, Subscription } from './observe'

export function even(source: Observable): Observable {
  return new Observable((observer) => {
    const subscription = source.subscribe({
      next: function (value: any): void {
        if (value % 2 == 0) {
          observer.next(value)
        }
      },
      complete: function (): void {
        observer.complete()
      },
      error: function (error: any): void {
        observer.error(error)
      },
    })
    return () => {
      subscription?.unsubscribe()
    }
  })
}

export function fromEvent(
  target: Element | Window | Document,
  eventName: string,
) {
  return new Observable((observer) => {
    target.addEventListener(eventName, observer.next)
    return () => {
      target.removeEventListener(eventName, observer.next)
    }
  })
}

export function interval(period: number) {
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

export function multiply(by: number) {
  return function (observable: Observable) {
    return new Observable((observer) => {
      const subscription = observable.subscribe({
        next: function (value: any): void {
          observer.next(value * by)
        },
        complete: function (): void {
          observer.complete()
        },
        error: function (error: any): void {
          observer.error(error)
        },
      })

      return () => {
        subscription?.unsubscribe()
      }
    })
  }
}

// const interval$ = interval(1000)
// pipe(multiply(3), even)(interval$) === even(multiply(3)(interval$))

export function map(projection: (value: any) => any) {
  return function (source: Observable): Observable {
    return new Observable((observer) => {
      const subscription = source.subscribe({
        next: function (value: any): void {
          observer.next(projection(value))
        },
        complete: function (): void {
          observer.complete()
        },
        error: function (error: any): void {
          observer.error(error)
        },
      })

      return () => {
        subscription?.unsubscribe()
      }
    })
  }
}

export function take(maxEvents: number) {
  return function (source: Observable): Observable {
    return new Observable((observer) => {
      let _count = 0
      const subscription = source.subscribe({
        next: function (value: any): void {
          observer.next(value)

          ++_count
          if (_count >= maxEvents) {
            subscription?.unsubscribe()
            observer.complete()
          }
        },
        complete: function (): void {
          observer.complete()
        },
        error: function (error: any): void {
          observer.error(error)
        },
      })

      return () => {
        subscription?.unsubscribe()
      }
    })
  }
}
