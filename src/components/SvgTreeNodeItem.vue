<!-- eslint-disable vue/custom-event-name-casing -->
<script lang="ts" setup>
import type { HierarchyNode } from 'd3'
import { truncate } from '../utils/text'

const props = withDefaults(defineProps<{
    nodeSize?: number
    node: HierarchyNode<any> & { index: number }
}>(), {
    nodeSize: 17,
})

const emits = defineEmits(['click', 'node-mousemove', 'node-mouseleave'])

const tText = computed(() => {
    return truncate(props.node.data.name, 100)
})

// const tTitleText = computed(() => {
//     return props.node
//         .ancestors()
//         .reverse()
//         .map((d: any) => d.data.name)
//         .join('/')
// })

const isUser = computed(() => {
    return props.node.depth === 1 && props.node.data.avatar
})

const imageProps = computed(() => {
    return {
        'x': 12,
        'y': -6,
        'width': 12,
        'height': 12,
        'xlink:href': props.node.data.avatar,
    }
})

const circleProps = computed(() => {
    const { node, nodeSize = 17 } = props
    return {
        cx: node.depth * nodeSize,
        r: 2.5,
        fill: node.children ? '#000' : '#999',
    }
})

const textProps = computed(() => {
    return {
        dy: '0.32em',
        x: props.node.depth * props.nodeSize + 10,
    }
})

function handleClick() {
    emits('click')
}

function handleMousemove(evt: MouseEvent) {
    if (!isUser.value) {
        emits('node-mousemove', props.node, evt)
    }
}
</script>

<template>
    <g :transform="`translate(0, ${props.node.index * props.nodeSize})`" class="cursor-pointer hover:font-bold" @click="handleClick">
        <image v-if="isUser" v-bind="imageProps" />
        <circle v-else v-bind="circleProps" />
        <text v-bind="textProps" @mousemove="handleMousemove" @mouseleave="emits('node-mouseleave')">
            {{ tText }}
        </text>
        <!-- <title>{{ tTitleText }}</title> -->
    </g>
</template>
