<script setup>
import { ref,computed, onBeforeUnmount,onMounted   } from 'vue';
import { eventBus } from '../eventBus';
const benchMarkWorker = ref(null);
const speedMeasureResults = ref([]);
const isWorkerRunning = computed(() => benchMarkWorker.value !== null);

const benchmarkRun = () => {
    if (benchMarkWorker.value) {
        let shouldRestart = confirm("A worker is already running. Do you want to restart it?");
        if (!shouldRestart) return;
        stopWorker();
    }

    if (!benchMarkWorker.value) {
        benchMarkWorker.value = new Worker(new URL('../workers/speed.js', import.meta.url), { type: 'module' });
        
        benchMarkWorker.value.onmessage = (event) => {
            eventBus.emit('workerMessage', "benchMarkWorker - "+JSON.stringify(event.data));
            const newResult = event.data;
            let index = speedMeasureResults.value.findIndex(result => result.hashtype === newResult.hashtype);
            if (index !== -1) {
                speedMeasureResults.value[index] = newResult;
            } else {
                speedMeasureResults.value.push(newResult);
            }
        };
    }
    benchMarkWorker.value.postMessage({ action: 'start' });

    eventBus.emit('workerMessage', "benchMarkWorker started");

};


const stopWorker = () => {
    if (benchMarkWorker.value) {
        benchMarkWorker.value.terminate();
        benchMarkWorker.value = null; 


        eventBus.emit('workerMessage', "benchMarkWorker terminated");
    }
};


onMounted(() => {
  benchmarkRun();
});




// Ensure the worker is terminated when the component is unmounted
onBeforeUnmount(() => {
    stopWorker();
});

defineExpose({
    benchMarkWorker,
    stopWorker,
    isWorkerRunning,
});
</script>
<template>

       
        <table class="table is-fullwidth mt-4">
            <thead>
                <tr>
                    <th>Hash Type</th>
                    <th>Speed (hashes/sec)</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="result in speedMeasureResults" :key="result.hashtype">
                    <td>{{ result.hashtype }}</td>
                    <td>{{ result.speed }}</td>
                </tr>
            </tbody>
        </table>
        <button v-if="!isWorkerRunning" class="button is-primary" @click="benchmarkRun">Launch Benchmark</button>
        <button v-else class="button is-danger" @click="stopWorker">Stop Benchmark</button>




</template>

