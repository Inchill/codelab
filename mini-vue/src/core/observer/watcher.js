import Dep from './dep'

class Watcher {
    constructor(vm, key, cb) {
        this.vm = vm
        this.key = key
        this.cb = cb
        // 把watcher对象记录到Dep类的静态属性target
        Dep.target = this
        // 触发get方法，会调用addSub方法
        this.oldVal = vm[key]
        Dep.target = null
    }
    update() {
        let newVal = this.vm[this.key]
        if (this.oldVal === newVal) return
        this.cb(newVal)
    }
}


export default Watcher