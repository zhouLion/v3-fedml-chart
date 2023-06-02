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

function loadLogs() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(getCode())
        }, Math.random() * 3000)
    })
}
function getCode() {
    return [
        '[FedML-Mobile-Client @device-id-188576] [Thu, 01 Jun 2023 02:45:36 +0800] [WARNING] [thread-434-(EdgeCommunicator.java:163)] FedMLDebug. EdgeCommunicator subscribe topic:fedml_3975_188559_188576',
        '[FedML-Mobile-Client @device-id-188576] [Thu, 01 Jun 2023 02:45:46 +0800] [WARNING] [thread-438-(HttpUtils.java:159)] doPost urlString:https://open-dev.fedml.ai/fedmlLogsServer/logs/update',
        '[FedML-Mobile-Client @device-id-188576] [Thu, 01 Jun 2023 02:45:47 +0800] [DEBUG] [thread-438-(EdgeCommunicator.java:202)] FedMLDebug. sendMessage(fl_client/mlops/system_performance)',
        '[FedML-Mobile-Client @device-id-188576] [Thu, 01 Jun 2023 02:45:47 +0800] [DEBUG] [thread-439-(RequestManager.java:135)] uploadLog result: {"message":"Succeeded to process request","code":"SUCCESS","data":{"logs_num_updated":3}}',
        '[FedML-Mobile-Client @device-id-188576] [Thu, 01 Jun 2023 02:45:47 +0800] [INFO] [thread-434-(OnMLOpsMsgListener.java:10)] OnMLOpsMsgListener',
        '[FedML-Mobile-Client @device-id-188576] [Thu, 01 Jun 2023 02:45:47 +0800] [INFO] [thread-434-(ClientAgentManager.java:141)] handleTrainException :{"threshold":"20""status":0,"is_retain":0}',
        '[FedML-Mobile-Client @device-id-188576] [Thu, 01 Jun 2023 02:45:47 +0800] [INFO] [thread-434-(EdgeCommunicator.java:202)] FedMLDebug. sendMessage(fl_client/mlops/status)',
        '[FedML-Mobile-Client @device-id-188576] [Thu, 01 Jun 2023 02:45:48 +0800] [CRITICAL] [thread-434-(EdgeCommunicator.java:202)] FedMLDebug. sendMessage(fl_run/fl_client/mlops/status)',
        '[FedML-Mobile-Client @device-id-188576] [Thu, 01 Jun 2023 02:45:49 +0800] [ERROR] [thread-434-(EdgeCommunicator.java:202)] FedMLDebug. sendMessage(flserver_agent/3975/client_exit_train_with_exception)',
        '[FedML-Mobile-Client @device-id-188576] [Thu, 01 Jun 2023 02:45:49 +0800] [ERROR] [thread-434-(ClientManager.java:389)] FedMLDebug. stop train without status reporting.',
    ].join('\n')
}
</script>

<template>
    <div class="flex flex-col gap-2">
        <!-- <div class="border border-gray rounded">
            <CollapsibleTree :data="treeData" />
        </div>
        <div class="border border-gray rounded">
            <SvgTree :data="treeData" />
        </div> -->
        <div class="border border-gray rounded">
            <LogViewer :load-logs="loadLogs" :log-count="1000" />
        </div>
    </div>
</template>
