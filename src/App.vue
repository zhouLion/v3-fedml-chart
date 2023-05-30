<script setup lang="ts">
const dataUrl = `${import.meta.env.BASE_URL}group-data.json`
// const treeDatadataUrl = `${import.meta.env.BASE_URL}tree-data.json`

// const groupData = ref({})
const treeData = ref({})

fetch(dataUrl).then(d => d.json()).then((data) => {
    // groupData.value = data
    treeData.value = data
})
// fetch(treeDatadataUrl).then(d => d.json()).then((data) => {
//     treeData.value = data
// })
</script>

<template>
    <!-- <IndentedTree :group-data="treeData" /> -->
    <!-- <DeviceAsFiletree :data="treeData" /> -->
    <SvgTree :data="treeData" />
    <!-- <CollapsibleTree :data="treeData" /> -->
</template>
