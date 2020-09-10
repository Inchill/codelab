import { initMixin } from './instance/init'

function Vue(options) {
    this._init(options)
}

initMixin(Vue)

// export default Vue
// 如果用es module形式，new Vue实例的时候会提示没有这个构造函数，实际上的构造函数是Vue.default()
module.exports = Vue