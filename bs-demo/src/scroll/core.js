import { getRect } from '../utils/dom'
import { getNow } from '../utils/lang'

const DIRECTION_DOWN = 1,
      DIRECTION_UP = -1;

export function coreMixin (BScroll) {
  BScroll.prototype._start = function (e) {
    // 初始化手指或鼠标的滑动距离
    this.distX = 0
    this.distY = 0

    // 清除前一次惯性滚动时间
    this.duration = 0
    this.startTime = getNow()
  
    let point = e.touches ? e.touches[0] : e
  
    // 初始化将要滚动到的位置
    this.startX = this.x
    this.startY = this.y
    this.absStartX = this.x      // 注意在 _end 函数里会用到
    this.absStartY = this.y
    // 触点在页面的位置坐标（可理解为 scroller 部分）
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
    this.trigger('touchEnd', {
      x: this.x,
      y: this.y
    })
  
    // 调用完 _translate 之后 x，y 会更新，计算新的坐标，同时四舍五入取整
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

  BScroll.prototype._translate = function (x, y) {
    this.scrollerStyle.transform = `translateY(${y}px)`
    this.scrollerStyle.transition = `all 1s ease-out`
  
    this.x = x
    this.y = y
  }
}