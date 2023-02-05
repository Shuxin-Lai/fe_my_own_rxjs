export {}

type Fn = (...args: any[]) => any

function fromEvent(target: Element | Window | Document, eventName: string) {
  return function (listener: Fn) {
    target.addEventListener(eventName, (ev) => {
      listener(ev)
    })
  }
}

const click$ = fromEvent(document, 'click')
click$((event) => console.log(event.clientX, event.clientY))
