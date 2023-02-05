import '../lib'
import { interval, fromEvent } from 'rxjs'
import { switchMapTo, map, take, startWith } from 'rxjs/operators'

const countdownElem = document.getElementById('text')

function countdown(init: any, delay = 1000) {
  return interval(delay).pipe(
    take(init),
    map((val) => init - val - 1),
    startWith(init),
  )
}

const click$ = fromEvent(document.getElementById('start')!, 'click')
const countdownFrom10$ = countdown(10)
const countdownFrom10OnClick$ = click$.pipe(switchMapTo(countdownFrom10$))

const text = document.getElementById('#text')
countdownFrom10OnClick$.subscribe({
  next: (text) => {
    countdownElem!.innerHTML = `${text}`
  },
})
