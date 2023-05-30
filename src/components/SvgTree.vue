<script lang="ts" setup>
import type { HierarchyLink, HierarchyNode } from 'd3'
import { hierarchy } from 'd3'
import { uniqueBy } from '../utils/array'

type MyHierarchyNode = HierarchyNode<any> & { index?: number; _children?: any[] }

const props = withDefaults(defineProps<{
    data: any
    nodeSize?: number
}>(), {
    nodeSize: 17,
})

defineEmits(['node-mouseover'])

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
    nodes: Array<MyHierarchyNode>
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
watch(() => props.data, () => {
    cachedCollapsedItems.value = []
})

const counter = ref(0)

const treeState = reactive({
    show: false,
    node: null as any,
    style: {
        transform: 'none',
        width: '400px',
        height: '300px',
        left: '0',
        top: '0',
    },
})

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

function handlerNodeClick(node: MyHierarchyNode) {
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

function throttle(fn: Function, wait = 200) {
    let timeout: number | undefined
    return (...args: any[]) => {
        if (timeout) {
            return
        }
        timeout = window.setTimeout(() => {
            fn(...args)
            timeout = undefined
        }, wait)
    }
}

const handlerMouseover = throttle((
    node: MyHierarchyNode,
    evt: MouseEvent,
) => {
    treeState.show = !!node
    treeState.node = node
    const tx = `${evt?.x > window.innerWidth - 400 ? evt?.x - 412 : evt?.x + 12}px`
    const ty = `${evt?.y > window.innerHeight - 300 ? evt?.y - 312 : evt?.y + 12}px`
    treeState.style.transform = `translate(${tx}, ${ty})`
})
</script>

<template>
    <div>
        <svg :viewBox="viewBox.toString()" font-size="10" font-family="sans-serif" @click.self="treeState.show = false">
            <g fill="none" stroke="#999">
                <SvgTreeLinkPath v-for="(d, i) in hierarchyRoot.links" :key="i" :node="d" />
            </g>
            <g>
                <SvgTreeNodeItem
                    v-for="(d, i) in hierarchyRoot.nodes" :key="i" :node="d" @node-mousemove="handlerMouseover"
                    @node-mouseleave="treeState.show = false" @click="handlerNodeClick(d)"
                />
            </g>
        </svg>

        <Teleport to="body">
            <div
                v-show="treeState.show" class="fixed bg-white z-9999
                w-80 h-60 top-0 left-0 rounded-md
                shadow shadow-md shadow-gray-600
                overflow-y-auto pl-6 pr-2 box-content break-words origin-top-left "
                :style="treeState.style"
                @mouseover="treeState.show = true"
                @mouseleave="treeState.show = false"
            >
                <ObjectDescription :data="treeState?.node?.data || {}" :excludes="['children']" />
            </div>
        </Teleport>
    </div>
</template>
