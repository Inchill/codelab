import { addEvent } from '../utils/dom'

export function initMixin (BScroll) {
  BScroll.prototype._init = function (el, options) {
    this._events = {}
  
    // 初始化即将滚动到的位置的坐标
    this.x = 0
    this.y = 0

    // 初始化锁定方向
    this.directionX = 0
    this.directionY = 0
  
    // 注册 DOM 监听事件
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
}