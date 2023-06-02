import 'virtual:uno.css'
import type { Plugin } from 'vue'

// import IndentedTree from './components/IndentedTree.vue'
// import CollapsibleTree from './components/CollapsibleTree.vue'
import SvgTree from './src/components/SvgTree.vue'
import LogViewer from './src/components/LogViewer.vue'

// export const FIndentedTree = IndentedTree
// export const FCollapsibleTree = CollapsibleTree
export const FSvgTree = SvgTree
export const FLogViewer = LogViewer

const plugin: Plugin = {
    install(vue) {
        // vue.component('FIndentedTree', IndentedTree)
        // vue.component('FCollapsibleTree', CollapsibleTree)
        vue.component('FSvgTree', SvgTree)
        vue.component('FLogViewer', LogViewer)
    },
}

export default plugin
