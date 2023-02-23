<template>
    <NuxtLayout name="cms">
        <Alert type="danger" :text="state.error && state.error.message" v-if="state.error" />
        <template #header>Logs</template>
        <div>
            <div class="table-responsive">
                <Table :columnHeaders="state.columnHeaders" :data="state.logs" :isLoading="state.isTableLoading"
                    :sortData="state.sortData" @sort="sort">
                    <template #body v-if="!(state.isTableLoading || (state.logs.data && state.logs.data.length === 0))">
                        <tr v-for="(log, index) in state.logs.data" :key="index">
                            <td>
                                <p>
                                    {{ log.id }}
                                </p>
                            </td>
                            <td>
                                <p>
                                    {{ log.log_name }}
                                </p>
                            </td>
                            <td>
                                <p>
                                    {{ log.description }}
                                </p>
                            </td>
                            <td>
                                <p>
                                    {{ log.causer_type }}
                                </p>
                            </td>
                            <td>
                                <p>
                                    {{ log.causer_id }}
                                </p>
                            </td>
                            <td>
                                <p>
                                    {{ formatDateTimeToReadable(log.created_at) }}
                                </p>
                            </td>
                        </tr>
                    </template>
                </Table>
            </div>
            <Pagination :data="state.logs" @previous="previous" @next="next" class="mt-5" />
        </div>
    </NuxtLayout>
</template>

<script setup>
import moment from 'moment'
import { onMounted } from 'vue'
import { useLogsStore } from '@/store/logs'
import { logService } from '@/components/api/LogService'

definePageMeta({
    middleware: ["authenticated"]
})

const logsStore = useLogsStore()
let currentTablePage = logsStore.getCurrentLogsPage

const state = reactive({
    columnHeaders: [
        { name: 'Id', sorter: true, key: 'id' },
        { name: 'Name' },
        { name: 'Description' },
        { name: 'Causer Type' },
        { name: 'Causer ID' },
        { name: 'Timestamp' },
    ],
    error: null,
    isTableLoading: false,
    logs: [],
    sortData: {
        sortField: null,
        sortOrder: null,
    }
})

onMounted(() => {
    fetchLogs()
})

async function fetchLogs() {
    state.isTableLoading = true
    state.error = null
    try {
        const params = {
            page: currentTablePage,
            sortField: state.sortData.sortField,
            sortOrder: state.sortData.sortOrder,
        }
        const response = await logService.getLogs(params)
        if (response) {
            state.logs = response
        }
    } catch (error) {
        state.error = error
    }
    state.isTableLoading = false
}

function previous() {
    currentTablePage--
    logsStore.setCurrentLogsPage(currentTablePage)
    fetchLogs()
}

function next() {
    currentTablePage++
    logsStore.setCurrentLogsPage(currentTablePage)
    fetchLogs()
}

function sort(sortingData) {
    currentTablePage = 1
    logsStore.setCurrentLogsPage(currentTablePage)
    state.sortData = {
        sortField: sortingData.column,
        sortOrder: sortingData.sort,
    }
    fetchLogs()
}

function formatDateTimeToReadable(datetime) {
    return moment(datetime).format('LLL')
}
</script>