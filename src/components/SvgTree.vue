<script lang="ts" setup>
import type { HierarchyLink, HierarchyNode } from 'd3-hierarchy'
import { hierarchy } from 'd3-hierarchy'
import { uniqueBy } from '../utils/array'

const props = withDefaults(defineProps<{
    data: any
    nodeSize?: number
}>(), {
    nodeSize: 17,
})

const emits = defineEmits(['node-mouseover'])

const width = 700

function mapEdges(edges: any[]) {
    return edges.map((edge: any) => {
        const { name } = edge
        return {
            ...edge,
            name,
            children: [],
        }
    })
}

const cachedCollapsedItems = ref<string[]>([])

const hierarchyRoot = ref<{
    nodes: HierarchyNode<any>[]
    links: HierarchyLink<any>[]
}>({
    nodes: [],
    links: [],
})

// Using cache to reduce calculation for more higher perfermance
const cache: any = ref({})

const treeData = computed(() => {
    const data = props.data
    const { users = [], group = {} } = data
    const collapsedItems = cachedCollapsedItems.value
    return {
        ...group,
        name: `GROUP NAME: ${group?.name || '-'}`,
        children: collapsedItems.includes(group.id)
            ? []
            : users.map((user: any) => {
                const { account, edges, id } = user
                const children = applyCache(id, edges)
                const result = {
                    ...user,
                    name: account,
                    children: collapsedItems.includes(id)
                        ? []
                        : children,
                }
                return result
            }),
    }
})

function applyCache(id: string, edges: any[]) {
    if (!cache.value[id]) {
        const uniqueEdges = uniqueBy(edges, 'deviceid')
        cache.value[id] = mapEdges(uniqueEdges)
    }
    return cache.value[id]
}

// only when data is changed, the cache should be reset.
watch(props.data, () => {
    cachedCollapsedItems.value = []
})

const counter = ref(0)

watch(() => [counter.value, treeData.value], () => {
    let i = 0
    const root = hierarchy(treeData.value)
        .eachBefore((d: any) => (d.index = i++))

    hierarchyRoot.value = {
        links: root.links(),
        nodes: root.descendants(),
    }
})

const viewBox = computed(() => {
    const nodeSize = props.nodeSize
    return [
        -nodeSize / 2,
        (-nodeSize * 3) / 2,
        width,
        (hierarchyRoot.value.nodes.length + 1) * nodeSize,
    ]
})

function handlerNodeClick(node: HierarchyNode<any> & { index: number; _children?: any[] }) {
    const id = node.data.id
    const has = cachedCollapsedItems.value.includes(id)
    if (has) {
        cachedCollapsedItems.value = cachedCollapsedItems.value.filter(d => d !== id)
    }
    else {
        cachedCollapsedItems.value.push(id)
    }
    counter.value++
}
</script>

<template>
    <svg :viewBox="viewBox.toString()" font-size="10" font-family="sans-serif">
        <g fill="none" stroke="#999">
            <SvgTreeLinkPath v-for="(d, i) in hierarchyRoot.links" :key="i" :node="d" />
        </g>
        <g>
            <SvgTreeNodeItem
                v-for="(d, i) in hierarchyRoot.nodes" :key="i"
                :node="d"
                @node-mouseover="emits('node-mouseover', d)"
                @click="handlerNodeClick(d)"
            />
        </g>
    </svg>
</template>
