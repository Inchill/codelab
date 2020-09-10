import Observer from '../observer/observer'
import Compiler from '../../compiler/compiler'
import { warn } from '../../utils/debug'

export function initMixin(Vue) {
    Vue.prototype._init = function(options) {
        if (typeof options !== "object") {
            warn('The options is not an object.')
        }

        this.$options = options || {}
        this.$data = options.data || {}
        this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el

        // 劫持 data 中的数据，使其成为响应式数据
        this._proxyData(this.$data)

        // 调用observer对象，监听数据的变化
        new Observer(this.$data)

        // 调用compiler对象，解析指令和插值表达式
        new Compiler(this)
    }

    Vue.prototype._proxyData = function(data) {
        Object.keys(data).forEach(key => {
            Object.defineProperty(this, key, {
                enumerable: true,
                configurable: true,
                get() {
                    return data[key]
                },
                set(newVal) {
                    if(newVal === data[key]) {
                        return
                    }
                    data[key] = newVal
                }
            })
        })
    }
}