<script setup lang="ts">
import { createD3TreeChart, createD3TreeData } from '../utils/d3-tree-chart'

const props = defineProps<{
    data: any
    width?: number
    chartHeight?: string
}>()

type GroupKeys = 'memory' | 'os_ver' | 'role' | 'type' | 'gpu' | 'processor' | 'network' | 'core_type' | 'update_time' | 'state'

const options = ref([
    'memory', 'os_ver', 'role', 'type', 'gpu', 'processor', 'network', 'core_type', 'update_time', 'state',
])

const rootRef = ref()

const groupKey = ref<GroupKeys>('memory')

watchEffect(() => {
    const el = rootRef.value as HTMLDivElement
    const { users = [], group = {} } = (props.data || {})

    const tTreeData = createD3TreeData(users, group)(groupKey.value)

    const node = createD3TreeChart(tTreeData, props.width)
    if (node && el) {
        el.childNodes.forEach(d => d.remove())
        el.appendChild(node)
    }
})
</script>

<template>
    <div>
        <nav>
            <label for="">
                <span class="mr-2">Device Group By:</span>
                <select v-model="groupKey">
                    <option v-for="opt in options" :key="opt" :value="opt" :label="opt" />
                </select>
            </label>
        </nav>
        <div ref="rootRef" class="overflow-y-auto" :style="{ height: chartHeight || '400px' }" />
    </div>
</template>
