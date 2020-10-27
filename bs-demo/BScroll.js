const TOUCH_EVENT = 1,
      MOUSE_EVENT = 2;

const DIRECTION_DOWN = 1,
      DIRECTION_UP = -1;

const eventType = {
  touchstart: TOUCH_EVENT,
  touchmove: TOUCH_EVENT,
  touchend: TOUCH_EVENT,
  touchcancel: TOUCH_EVENT,

  mousedown: MOUSE_EVENT,
  mousemove: MOUSE_EVENT,
  mouseup: MOUSE_EVENT,
  mousecancel: MOUSE_EVENT
}

/** 滚动初始化，注册监听事件 */

function BScroll (el, options = {}) {
  this.wrapper = typeof el === 'string' ? document.querySelector(el) : el
  this.scroller = this.wrapper.children[0]
  this.scrollerStyle = this.scroller.style
  this._init(el, options)
}

BScroll.prototype._init = function (el, options) {
  this._events = {}

  this.x = 0
  this.y = 0
  this.directionX = 0
  this.directionY = 0

  this._addDOMEvents()
}

BScroll.prototype._addDOMEvents = function () {
  let eventOperation = addEvent
  this._handleDOMEvents(eventOperation)
}

BScroll.prototype._handleDOMEvents = function (eventOperation) {
  let target = this.wrapper
  eventOperation(target, 'mousedown', this)
  eventOperation(target, 'mousemove', this)
  eventOperation(target, 'mousecancel', this)
  eventOperation(target, 'mouseup', this)

  eventOperation(target, 'touchstart', this)
  eventOperation(target, 'touchmove', this)
  eventOperation(target, 'touchcancel', this)
  eventOperation(target, 'touchend', this)
}

BScroll.prototype.handleEvent = function (e) {
  switch (e.type) {
    case 'touchstart':
    case 'mousedown':
      this._start(e)
      break
    case 'touchmove':
    case 'mousemove':
      this._move(e)
      break
    case 'touchend':
    case 'mouseup':
    case 'touchcancel':
    case 'mousecancel':
      this._end(e)
      break
  }
}

/******* 滚动核心逻辑 *******/

BScroll.prototype._start = function (e) {
  // 初始化手指或鼠标的滑动距离
  this.distX = 0
  this.distY = 0

  let point = e.touches ? e.touches[0] : e

  // 初始化将要滚动到的位置
  this.startX = this.x
  this.startY = this.y
  this.absStartX = this.x      // 注意在 _end 函数里会用到
  this.absStartY = this.y
  // 鼠标或手指（触点）相对于页面位置（不是可视区域里的文档部分，而是滚动元素scroll部分，包括被卷去的部分）
  this.pointX = point.pageX
  this.pointY = point.pageY
}

BScroll.prototype._move = function (e) {
  let point = e.touches ? e.touches[0] : e

  // 实时计算滚动中的滚动距离差
  let deltaX = point.pageX - this.pointX
  let deltaY = point.pageY - this.pointY

  // 实时计算触点坐标
  this.pointX = point.pageX
  this.pointY = point.pageY

  // 累计 x，y 方向上的滚动距离
  this.distX += deltaX
  this.distY += deltaY

  // 计算新的滚动坐标
  let newX = this.x + deltaX
  let newY = this.y + deltaY

  this._translate(newX, newY)

  // 计算滚动条卷去的高度
  let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop

  let pY = this.pointY - scrollTop   // 手指或鼠标相对于scroll滚动元素的坐标 - 滚动条向上卷去的距离 = 在可视区的坐标

  if (pY > document.documentElement.clientHeight) {     // 如果到了视窗边缘，停止滚动
    this._end(e)
  }
}

BScroll.prototype._end = function (e) {
  let point = e.touches ? e.touches[0] : e

  this.trigger('touchEnd', {
    x: this.x,
    y: this.y
  })

  // 调用完 _translate 之后 x，y 会更新，计算新的坐标
  let newX = Math.round(this.x)
  let newY = Math.round(this.y)

  let deltaY = newY - this.absStartY
  this.directionY = deltaY > 0 ? DIRECTION_DOWN : deltaY < 0 ? DIRECTION_UP : 0

  let wrapperRect = getRect(this.wrapper)
  let scrollerRect = getRect(this.scroller)
  
  if (newY > 0) {     // 向下滚动
    this._translate(newX, newY)
    this._translate(newX, 0)      // 滚动元素超出边界后重置（上边界）
  } else {    // 向上滚动
    if (wrapperRect.height >= scrollerRect.height) {   // 包裹元素高度 >= 滚动元素高度
      this._translate(newX, newY)
      this._translate(newX, 0)
    } else {
      if (Math.abs(newY) < scrollerRect.height)
        this._translate(newX, newY)
      else {
        this._translate(newX, newY)
        this._translate(newX, -(scrollerRect.height - wrapperRect.height))    // 滚动元素超出边界后重置（下边界）
      }
    }
  }
}
/********** 上述为滚动核心 *******/

function addEvent(el, type, fn, capture) {
  el.addEventListener(type, fn, {passive: false, capture: !!capture})
}

function getRect(el) {
  if (el instanceof window.SVGElement) {
    let rect = el.getBoundingClientRect()
    return {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height
    }
  } else {
    return {
      top: el.offsetTop,
      left: el.offsetLeft,
      width: el.offsetWidth,
      height: el.offsetHeight
    }
  }
}

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

BScroll.prototype._translate = function (x, y) {
  this.scrollerStyle.transform = `translateY(${y}px)`
  this.scrollerStyle.transition = `all 1s ease-out`

  this.x = x
  this.y = y
}