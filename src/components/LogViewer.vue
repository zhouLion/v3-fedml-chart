<script lang="ts" setup>
import { editor, languages } from 'monaco-editor'

const props = defineProps<{
    loadLogs: () => Promise<string[]>
    logCount: number
}>()

const langID = 'fedml-log'

const containerRef = ref<HTMLDivElement>()

const isLoading = ref(false)

let fedmlLogEditor: editor.IStandaloneCodeEditor

// useResizeObserver(containerRef, ([{contentRect}]) => {
//     contentRect.width
//     if (fedmlLogEditor) {
//         fedmlLogEditor.getContainerDomNode()
//     }
// })

// Register a new language
languages.register({ id: langID })

// Register a tokens provider for the language
languages.setMonarchTokensProvider(langID, {
    tokenizer: {
        root: [
            [/\[FedML.*?\]/, 'custom-scope'],
            [/\[ERROR.*/, 'custom-error'],
            [/\[CRITICAL.*/, 'custom-error'],
            [/\[WARNING.*/, 'custom-warning'],
            [/\[DEBUG.*?\]/, 'custom-info'],
            [/\[INFO.*?\]/, 'custom-info'],
            [/\{.*\}/, 'custom-json'],
            [/\[\w{3}, \d{2} \w{3} \d{4} \d{2}:\d{2}:\d{2} \+\d{4}\]/, 'custom-date'],
        ],
    },
})

// Define a new theme that contains only rules that match this language
editor.defineTheme('fedml-log-theme', {
    base: 'vs-dark',
    inherit: false,
    rules: [
        { token: 'custom-scope', foreground: '#6e63a3', fontStyle: 'bold' },
        { token: 'custom-info', foreground: '#808080' },
        { token: 'custom-error', foreground: '#ff0000', fontStyle: 'bold' },
        { token: 'custom-warning', foreground: '#FFA500' },
        { token: 'custom-date', foreground: '#61b852' },
        { token: 'custom-json', foreground: '#61b852', fontStyle: 'bold' },
    ],
    colors: {
        'editor.foreground': 'eeeeee',
    },
})

onMounted(() => {
    fedmlLogEditor = editor.create(containerRef.value!, {
        theme: 'fedml-log-theme',
        value: '',
        wordWrap: 'on',
        // readOnly: true,
        language: langID,
    })

    executeLoadLogs()

    fedmlLogEditor.onDidScrollChange((e) => {
        if (e.scrollTop < 20 && isLoading.value === false) {
            executeLoadLogs()
        }
    })

    fedmlLogEditor.setScrollTop(fedmlLogEditor.getScrollHeight() / 400)
})

function executeLoadLogs() {
    if (!fedmlLogEditor) {
        return
    }
    isLoading.value = true
    const oValue = fedmlLogEditor.getValue()
    props.loadLogs()
        .then((newLogs) => {
            if (!fedmlLogEditor) {
                throw new Error('editor is not created')
            }
            fedmlLogEditor.setValue(`${newLogs}\n${oValue}`)
        }).finally(() => {
            isLoading.value = false
        })
}
</script>

<template>
    <div ref="containerRef" class="h-80vh w-ful" />
</template>
