import { coreMixin } from './scroll/core'
import { initMixin } from './scroll/init'
import { eventMixin } from './scroll/event'

function BScroll (el, options = {}) {
  this.wrapper = typeof el === 'string' ? document.querySelector(el) : el
  if (!this.wrapper) {
    console.error('Can not resolve the wrapper DOM.')
  }

  this.scroller = this.wrapper.children[0]
  if (!this.scroller) {
    console.error('The wrapper need at least one child element to be scroller.')
  }

  this.scrollerStyle = this.scroller.style

  this._init(el, options)
}

initMixin(BScroll)
coreMixin(BScroll)
eventMixin(BScroll)

module.exports = BScroll