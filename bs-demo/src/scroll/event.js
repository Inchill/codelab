export function eventMixin (BScroll) {
  BScroll.prototype.trigger = function (type) {
    let events = this._events[type]
    if (!events) {
      return
    }
  
    let len = events.length
    let eventsCopy = [...events]
    for (let i = 0; i < len; i++) {
      let event = eventsCopy[i]
      let [fn, context] = event
      if (fn) {
        fn.apply(context, [].slice.call(arguments, 1))
      }
    }
  }
}