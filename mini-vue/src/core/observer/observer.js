import Dep from './dep'

class Observer {
    constructor(data) {
        this.walk(data)
    }
    // 此方法遍历对象的所有属性
    walk(data) {
        if (!data || typeof data !== 'object') {
            return
        }
        Object.keys(data).forEach(key => {
            this.defineReactive(data, key, data[key])
        })
    }
    defineReactive(obj, key, val) {
        let self = this
        // 负责收集依赖并发送通知
        let dep = new Dep()
        this.walk(val)
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get() {
                // 收集依赖
                Dep.target && dep.addSub(Dep.target)
                // 不直接返回obj[key]是因为会死递归
                return val
            },
            set(newVal) {
                if (newVal === val) {
                    return
                }
                val = newVal
                self.walk(newVal)
                // 发送通知
                dep.notify()
            }
        })
    }
}

export default Observer