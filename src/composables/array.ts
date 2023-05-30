// partial load list
export function usePartialLoad(list: Ref<any[]>, chunks = 5, auto = false) {
    const loaded = ref(false)
    const partialList = ref<any[]>([])
    const timer = ref()
    const idleTimer = ref()

    const loadMore = () => {
        if (partialList.value.length === list.value.length) {
            loaded.value = true
            return
        }
        const currentLength = partialList.value.length
        const listToLoad = list.value.slice(currentLength, currentLength + chunks)
        partialList.value.push(...listToLoad)
    }

    watch(
        list,
        () => {
            if (timer.value) {
                window.clearInterval(timer.value)
            }
            if (idleTimer.value) {
                window.cancelIdleCallback(idleTimer.value)
            }
            loaded.value = false
            partialList.value = []
            loadMore()
            if (auto) {
                timer.value = window.setInterval(() => {
                    idleTimer.value = window.requestIdleCallback(loadMore)
                }, 60)
            }
        },
        {
            immediate: true,
            deep: false,
        },
    )

    return {
        loadMore,
        partialList,
        loaded,
    }
}
