<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { eventBus } from '../eventBus';
const logMessages = ref('');
onMounted(() => {
    eventBus.on('workerMessage', (message) => {

        logMessages.value += `${message}\n`;
    });
});

onUnmounted(() => {
    eventBus.off('workerMessage'); 
});
</script>
<template>

       
<div class="control">
                     <textarea class="textarea is-primary" rows="10"  placeholder="Logs...">{{ logMessages }}</textarea> 
                  </div>


</template>

