<script lang="ts" setup>
const props = withDefaults(defineProps<{
    node: any
    columns: any[]
    nodeSize?: number
}>(), {
    nodeSize: 17,
})

const d = computed(() => {
    const { node, nodeSize = 17 } = props
    return `
          M${node.source.depth * nodeSize},${node.source.index * nodeSize}
          V${node.target.index * nodeSize}
          h${nodeSize}
        `
})
</script>

<template>
    <path
        :d="d"
    />
</template>
