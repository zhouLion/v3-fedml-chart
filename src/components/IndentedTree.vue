<script lang="ts" setup>
import { uniqueBy } from '../utils/array'

const props = defineProps<{
    groupData: any
}>()

const emits = defineEmits(['update:group-data'])

const shadowGroupData = computed({
    get() {
        const data = Object.assign({}, props.groupData)
        data.group.__is_open = true
        return data
    },
    set(val) {
        emits('update:group-data', val)
    },
})

const dynamicColumns = ref([
    {
        label: 'memory',
        key: 'memory',
        visible: true,
        icon: 'i-tabler:camera-check',
    },
    { label: 'os_ver', key: 'os_ver', visible: true, icon: 'i-tabler:versions' },
    { label: 'role', key: 'role', visible: true, icon: 'i-tabler:accessible' },
    { label: 'ip', key: 'ip', visible: true, icon: 'i-tabler:address-book' },
    { label: 'type', key: 'type', visible: true, icon: 'i-tabler:brand-apple' },
    {
        label: 'deviceid',
        key: 'deviceid',
        visible: true,
        icon: 'i-tabler:id-badge-2',
    },
    { label: 'gpu', key: 'gpu', visible: true, icon: 'i-bi:gpu-card' },
    { label: 'processor', key: 'processor', visible: true, icon: 'i-tabler:cpu' },
    { label: 'network', key: 'network', visible: true, icon: 'i-tabler:network' },
    {
        label: 'core_type',
        key: 'core_type',
        visible: true,
        icon: 'i-tabler:cpu-2',
    },
    { label: 'accountid', key: 'accountid', visible: true, icon: 'i-tabler:id' },
    {
        label: 'update_time',
        key: 'update_time',
        visible: true,
        icon: 'i-tabler:file-time',
    },
    { label: 'id', key: 'id', visible: true, icon: 'i-tabler:id' },
    {
        label: 'state',
        key: 'state',
        visible: true,
        icon: 'i-tabler:status-change',
    },
    { label: 'logUrl', key: 'logUrl', visible: true, icon: 'i-tabler:note' },
])

const theadColumns = computed(() => {
    const defaultColumns = [{ label: '', key: 'col1', visible: true, icon: '' }]
    const visibleDynamicColumns = dynamicColumns.value.filter((col) => {
        return col.visible
    })
    return defaultColumns.concat(visibleDynamicColumns)
})

const EdgeTrs = defineComponent({
    props: {
        edges: Array,
        theadColumns: Array,
        visible: Boolean,
    },
    setup(props) {
        const uniqued = computed(() => uniqueBy(props.edges as any[], 'deviceid'))
        const { partialList } = usePartialLoad(uniqued, 10, true)
        return {
            partialList,
        }
    },
    render() {
        return this.partialList.map((edge) => {
            return h('tr', {
                key: edge.deviceid,
                style: {
                    display: this.visible ? '' : 'none',
                },
            }, (this.theadColumns as any[]).map((col, cIndex) => {
                return h('td', {
                    key: col.key,
                },
                cIndex === 0
                    ? h('span', null, edge.name)
                    : h('span', null, edge[col.key]),
                )
            }))
        })
    },
})
</script>

<template>
    <div class="flex">
        <table class="border-collapse border-gray-900 border border-1 w-full">
            <thead>
                <tr>
                    <th
                        v-for="col in theadColumns" :key="col.key"
                        class="border-gray-900 border border-1 sticky top-0 align-bottom bg-white z-10 w-1/10"
                    >
                        <span class="flex justify-start items-center">
                            <i v-if="col.icon" :class="col.icon" />
                            {{ col.label }}
                        </span>
                    </th>
                </tr>
            </thead>

            <tbody>
                <tr>
                    <td @click="shadowGroupData.group.__is_open = !shadowGroupData.group.__is_open">
                        {{ shadowGroupData.group.name || '--' }}
                    </td>
                </tr>
                <template v-for="user in shadowGroupData.users" :key="user.id">
                    <tr v-show="shadowGroupData.group.__is_open">
                        <td v-for="(_, index) in theadColumns" :key="_.key" class="border-gray-900 border border-1">
                            <span
                                v-if="index === 0" class="flex justify-start items-center hover:cursor-pointer"
                                @click="user.__is_open = !!!user.__is_open"
                            >
                                <i
                                    :class="[
                                        user.__is_open
                                            ? 'i-tabler:layout-navbar-expand'
                                            : 'i-tabler:layout-navbar-collapse',
                                    ]"
                                />{{ user.account }}
                            </span>
                        </td>
                    </tr>
                    <template v-if="user && user.edges && user.edges.length > 0">
                        <EdgeTrs
                            :visible="user.__is_open && shadowGroupData.group.__is_open" :edges="user.edges"
                            :thead-columns="theadColumns"
                        />
                    </template>
                </template>
            </tbody>
        </table>
    </div>
</template>
