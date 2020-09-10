import Watcher from '../core/observer/watcher'

class Compiler {
    constructor(vm) {
        this.el = vm.$el
        this.vm = vm
        this.compile(this.el)
    }
    // 编译模板，处理文本和元素节点
    compile(el) {
        let childNodes = el.childNodes
        Array.from(childNodes).forEach(node => {
            if (this.isTextNode(node)) {
                this.compileText(node)
            } else if (this.isElementNode(node)) {
                this.compileElement(node)
            }

            // 如果有子节点
            if (node.childNodes && node.childNodes.length) {
                this.compile(node)
            }
        })
    }
    // 编译文本节点，处理指令
    compileText(node) {
        let reg = /\{\{(.+?)\}\}/
        let value = node.textContent
        if (reg.test(value)) {
            let key = RegExp.$1.trim()
            node.textContent = value.replace(reg, this.vm[key])
            // 创建watcher对象，当数据改变时更新
            new Watcher(this.vm, key, (newVal) => {
                node.textContent = newVal
            })
        }
    }
    // 编译元素节点，处理插值表达式
    compileElement(node) {
        Array.from(node.attributes).forEach(attr => {
            // 判断是否是指令
            let attrName = attr.name
            if (this.isDirective(attrName)) {
                // 去掉v-
                attrName = attrName.substr(2)
                let key = attr.value
                this.update(node, key, attrName)
            }
        })
    }

    update(node, key, attrName) {
        let updateFn = this[attrName + 'Updater']
        updateFn && updateFn.call(this, node, this.vm[key], key)
    }

    // handler v-text
    textUpdater(node, value, key) {
        node.textContent = value
        new Watcher(this.vm, key, newVal => {
            node.textContent = newVal
        })
    }
    // handler v-model
    modelUpdater(node, value, key) {
        node.value = value
        new Watcher(this.vm, key, newVal => {
            node.value = newVal
        })
        // 双向绑定
        node.addEventListener('input', () => {
            this.vm[key] = node.value
        })
    }
    // 判断元素属性是否为指令
    isDirective(attrName) {
        return attrName.startsWith('v-')
    }
    // 是否是文本节点
    isTextNode(node) {
        return node.nodeType === 3
    }
    // 是否是元素节点
    isElementNode(node) {
        return node.nodeType === 1
    }
}

export default Compiler