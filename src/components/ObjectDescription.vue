<script lang="ts" setup>
import { isHrefLink, isPrimaryType } from '../utils/text'

const props = defineProps<{
    data: Record<string, any>
    excludes?: string[]
}>()

interface Result {
    key: string
    isJSON: boolean
    isLink: boolean
    originValue: string
    parsedValue: any
}

const formatData = computed(() => {
    const tData = Object.entries(props.data || {}).reduce<Result[]>((acc, [key, value]) => {
        if (props.excludes && props.excludes.includes(key) && !isPrimaryType(value)) {
            return acc
        }
        const result: Result = {
            key,
            isJSON: false,
            isLink: false,
            originValue: value,
            parsedValue: '',
        }
        try {
            const v = JSON.parse(value)
            if (isPrimaryType(v)) {
                result.parsedValue = v
                result.isLink = isHrefLink(String(v))
            }
            else {
                result.parsedValue = v
                // JSON.stringify(v, null, 2)
                result.isJSON = true
            }
        }
        catch (error) {
            result.isLink = isHrefLink(value)
            result.parsedValue = value
        }
        return acc.concat(result)
    }, [])

    return tData
})
</script>

<template>
    <ul class="w-full ml-0 pl-0">
        <li v-for="item in formatData" :key="item.key" class="ml-0 pl-0 hover:bg-gray-200">
            <span class="font-bold mr-2">{{ item.key }}:</span>
            <span v-if="!item.isJSON">
                <a v-if="item.isLink" :href="item.parsedValue" target="_blank">
                    {{ item.parsedValue }}
                </a>
                <template v-else>
                    {{ item.parsedValue }}
                </template>
            </span>

            <div v-else class="pl-4">
                <ObjectDescription :data="item.parsedValue" :excludes="props.excludes" />
            </div>
        </li>
    </ul>
</template>
