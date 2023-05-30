import 'virtual:uno.css'
import type { Plugin } from 'vue'

// import IndentedTree from './components/IndentedTree.vue'
// import CollapsibleTree from './components/CollapsibleTree.vue'
import SvgTree from './src/components/SvgTree.vue'

// export const FIndentedTree = IndentedTree
// export const FCollapsibleTree = CollapsibleTree
export const FSvgTree = SvgTree

const plugin: Plugin = {
    install(vue) {
        // vue.component('FIndentedTree', IndentedTree)
        // vue.component('FCollapsibleTree', CollapsibleTree)
        vue.component('FSvgTree', SvgTree)
    },
}

export default plugin
