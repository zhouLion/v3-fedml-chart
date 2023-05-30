<script lang="ts" setup>
defineProps<{
    columns: any[]
    nodeSize: number
}>()
</script>

<template>
    <text
        v-for="({ label, x }) in columns"
        :key="label"
        dt="0.32em" :y="-nodeSize" :x="x" text-anchor="end" font-weight="bold"
    >
        {{ label }}
    </text>
</template>
