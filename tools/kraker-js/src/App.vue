<script setup>
import { ref,onMounted,computed,onBeforeUnmount,watch   } from 'vue';
import hashcat from 'crack-js';

const availableHashTypes = ref([]);
const selectedHashType = ref('');

const crackWorker = ref(null);
//online actions
const useRules = ref(false);
const ruleUrl = ref('');
const wordlistUrl=ref('https://weakpass.com/api/v1/wordlists/rockyou.txt');
const mainTab = ref('hashes');
const attackTab = ref('files');




const wordlistFile = ref(null);
const wordlistName = ref('');


const rulesFile = ref(null);
const rulesName = ref('');


const benchmarkWorker = ref(null);

const isBenchmarkWorkerRunning = computed(() => {
    return benchmarkWorker.value !== null;
});
const isCrackWorkerRunning = computed(() => {
    return crackWorker.value !== null;
});



const speedMeasureResults = ref([]);

const logMessages = ref('');


const logMessage = (message) => {

   const timestamp = new Date().toLocaleString();
   logMessages.value += `[${timestamp}] ${message}\n`;


};


const hashesInput = ref('');


const hashEntries = computed(() => {
  return hashesInput.value.split('\n').map(entry => entry.trim()).filter(entry => entry !== '');
});
const foundEntries = ref([]);




const runCrackWorker = () => {
    if (crackWorker.value) {
        let shouldRestart = confirm("A worker is already running. Do you want to restart it?");
        if (!shouldRestart) return;
        stopCrackWorker();
    }

    if (!crackWorker.value) {

      if(attackTab.value=="files")
            crackWorker.value = new Worker(new URL('./workers/files.js', import.meta.url), { type: 'module' });
      else if(attackTab.value=="online")
            crackWorker.value = new Worker(new URL('./workers/online.js', import.meta.url), { type: 'module' });
      else if(attackTab.value=="text")
           crackWorker.value = new Worker(new URL('./workers/text.js', import.meta.url), { type: 'module' });
      else
      {
         stopCrackWorker();
         logMessage("undefined attackType="+attackTab.value);
         return;
      }
      

         
      crackWorker.value.onmessage = (event) => {

         if(event.data.type=="status")
            {
               if(event.data.status=="done" || event.data.status=="stop" )
               {
                  stopCrackWorker();
                  return;
               }
            }

            if(event.data.type=="found")
            {
               foundEntries.value.push({ hash:event.data.hash, password:event.data.password, type: event.data.type });

            }

            if(event.data.type=="log")
            {
               logMessage("crackWorker "+event.data.message);
            }
        };
    }



      if(attackTab.value=="online")
      {
       crackWorker.value.postMessage({    action: 'start',    useRules: useRules.value,    ruleUrl: ruleUrl.value,    wordlistUrl: wordlistUrl.value,    hashEntries: hashEntries.value,    selectedHashType:selectedHashType.value});
      }    
      else if(attackTab.value=="files")
      {
       crackWorker.value.postMessage({    action: 'start',    useRules: useRules.value,    wordlistFile: wordlistFile.value,   hashEntries: hashEntries.value, rulesFile: rulesFile.value,    selectedHashType:selectedHashType.value});
      }  
      else
      {
         stopCrackWorker();
         logMessage("undefined attackType="+attackTab.value);
         return;
      }


   logMessage("crackWorker started");

};






const benchmarkRun = () => {
    if (benchmarkWorker.value) {
        let shouldRestart = confirm("A worker is already running. Do you want to restart it?");
        if (!shouldRestart) return;
        stopBenchMarkWorker();
    }

    if (!benchmarkWorker.value) {
      benchmarkWorker.value = new Worker(new URL('./workers/speed.js', import.meta.url), { type: 'module' });
        
      benchmarkWorker.value.onmessage = (event) => {

            if(event.data.status=="done")
            {
               stopBenchMarkWorker();
                return;
            }
            logMessage("benchMarkWorker - "+JSON.stringify(event.data));
            const newResult = event.data;
            let index = speedMeasureResults.value.findIndex(result => result.hashtype === newResult.hashtype);
            if (index !== -1) {
                speedMeasureResults.value[index] = newResult;
            } else {
                speedMeasureResults.value.push(newResult);
            }
        };
    }
    benchmarkWorker.value.postMessage({ action: 'start' });

   logMessage("benchMarkWorker started");

};





const stopCrackWorker = () => {

    if (crackWorker!=null && crackWorker.value!=null) {
      crackWorker.value.terminate();
      crackWorker.value = null; 
        logMessage("crackWorker terminated");
    }
};

const stopBenchMarkWorker = () => {

if (benchmarkWorker!=null && benchmarkWorker.value!=null) {
  benchmarkWorker.value.terminate();
  benchmarkWorker.value = null; 
    logMessage("benchmarkWorker terminated");
}
};



onMounted(() => {
   availableHashTypes.value = hashcat.availableHashTypes;
   logMessage("Available types")
   hashcat.availableHashTypes.forEach((type, index) => {
      logMessage(` ${type}`);
});


  benchmarkRun();
});



onBeforeUnmount(() => {
   stopBenchMarkWorker();
});


const fileSizeDisplay = computed(() => {
  if (fileSize.value < 1024) return `${fileSize.value} bytes`;
  if (fileSize.value < 1024 * 1024) return `${(fileSize.value / 1024).toFixed(2)} KB`;
  return `${(fileSize.value / (1024 * 1024)).toFixed(2)} MB`;
});

function handleWordlistSelect(event) {
   wordlistFile.value = event.target.files[0];
   wordlistName.value = wordlistFile.value ? wordlistFile.value.name : '';
}

function handleRulesSelect(event) {
   rulesFile.value = event.target.files[0];
   console.log(rulesFile.value.name );
   rulesName.value = rulesFile.value ? rulesFile.value.name : '';
}



   const changeMainTab = (tab) => {
       mainTab.value = tab;
   };
   const changeAttackTab = (tab) => {
    attackTab.value = tab;
   };
   
   
</script>
<template>
   <section class="section">
      <div class="container">
         <div class="columns is-multiline is-align-items-center">
            <div class="column is-12 ml-auto">
               <h1 class="mb-5 is-size-1 is-size-3-mobile has-text-weight-bold">CRACK-JS</h1>
            </div>

            <div class="column is-12 ml-auto">
               <div class="tabs is-boxed">
                  <ul>
                     <li :class="{ 'is-active': mainTab === 'hashes' }"><a  @click="changeMainTab('hashes')">Hashes</a></li>
                     <li :class="{ 'is-active': mainTab === 'results' }" ><a  @click="changeMainTab('results')">Results</a></li>
                     <li :class="{ 'is-active': mainTab === 'benchmark' }" ><a  @click="changeMainTab('benchmark')">Benchmark</a></li>
                     <li :class="{ 'is-active': mainTab === 'logs' }" ><a  @click="changeMainTab('logs')">Logs</a></li>
                     <li :class="{ 'is-active': mainTab === 'status' }" ><a  @click="changeMainTab('status')">Status</a></li>
                  </ul>
               </div>
               <div  v-show="mainTab === 'hashes'">
                  <div class="control">
                     <textarea class="textarea is-primary"  v-model="hashesInput"  rows="10"  placeholder="Each hash on new line"></textarea> 
                  </div>
               </div>
               <div   v-show="mainTab === 'results'">
                  <table>
                     <thead>
                     <tr>
                        <th>Hash</th>
                        <th>Password</th>
                        <th>Type</th>
                     </tr>
                     </thead>
                     <tbody>
                     <tr v-for="(entry, index) in foundEntries" :key="index">
                        <td>{{ entry.hash }}</td>
                        <td>{{ entry.password }}</td>
                        <td>{{ entry.type }}</td>
                     </tr>
                     </tbody>
                  </table>
               </div>

               <div v-show="mainTab === 'benchmark'">
                    
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
                     <button v-if="!isBenchmarkWorkerRunning" class="button is-primary" @click="benchmarkRun">Launch Benchmark</button>

                     <button v-else class="button is-danger" @click="stopBenchMarkWorker">Stop Benchmark</button>
                </div>


                <div v-show="mainTab === 'logs'">
                  <div class="control">
                     <textarea class="textarea is-primary" rows="10"  placeholder="Logs...">{{ logMessages }}</textarea> 
                  </div>

                </div>

                <div v-show="mainTab === 'status'">

                  <table class="table is-fullwidth mt-4">
                           <thead>
                              <tr>
                                 <th>Worker</th>
                                 <th>Status</th>
                                 <th></th>
                              </tr>
                           </thead>
                           <tbody>
                              <tr>
                                 <td>benchmark</td>
                                 <td>
                                    <span v-if="isBenchmarkWorkerRunning" class="tag is-success">Running</span>
                                    <span v-else class="tag is-danger">Terminated</span>
                                 </td>
                                 <td> <button v-if="isBenchmarkWorkerRunning" class="delete is-danger is-small" @click="stopBenchMarkWorker"></button></td>
                              </tr>






                           </tbody>
                     </table>


                  
                </div>


               
            </div>


         </div>


         <div class="columns is-multiline is-align-items-center">

            <div class="column is-12 ml-auto">
                <div class="field is-grouped">

                    <div class="control is-expanded">
                        <div class="select is-fullwidth">
                        <select v-model="selectedHashType" class="is-focused">
                           <option v-for="(type, index) in availableHashTypes" :key="index" :value="type">
                              {{ type }}
                           </option>
                        </select>
                        </div>
                    </div>

                   
                        <div v-if="!isCrackWorkerRunning" class="control">
                           <button class="button is-link" @click="runCrackWorker">Crack</button>
                        </div>
                        <div v-if="isCrackWorkerRunning" class="control" id="button_stop">
                              <button class="button is-danger" @click="stopCrackWorker">Stop</button>
                        </div>
                </div>
            </div>

        </div>

         
         <div id="settings_panel">

            <div class="columns">
               <div class="column">
                  <div class="tabs is-boxed">
                     <ul>
                        <li :class="{ 'is-active': attackTab === 'files' }"><a  @click="changeAttackTab('files')">Files</a></li>
                        <li :class="{ 'is-active': attackTab === 'text' }"><a  @click="changeAttackTab('text')">Text</a></li>
                        <li :class="{ 'is-active': attackTab === 'online' }" ><a  @click="changeAttackTab('online')">Online</a></li>
                     </ul>
                  </div>



                  <div  v-if="attackTab === 'files'">
                     <div class="field">
                        <label class="label">Wordlist file</label>
                        <div class="control">
                     <div class="file">
                     <label class="file-label">
                        <input class="file-input" type="file"  @change="handleWordlistSelect" />
                        <span class="file-cta">
                           <span class="file-label" v-if="wordlistName">{{ wordlistName }}</span>
                           <span class="file-label" v-else> Choose a file… </span>
                           
                        </span>
                       
                     </label>
                     </div>
                  </div>
               </div>
               <div class="field">
                        <label class="checkbox">
                        <input type="checkbox" v-model="useRules">
                        Use Rules
                        </label>
                     </div>

                     <div class="field" v-if="useRules">
                        <label class="label">Rules file</label>
                        <div class="control">
                     <div class="file">
                     <label class="file-label">
                        <input class="file-input" type="file"  @change="handleRulesSelect" />
                        <span class="file-cta">
                           <span class="file-label" v-if="rulesName">{{ rulesName }}</span>
                           <span class="file-label" v-else> Choose a file… </span>
                           
                        </span>
                       
                     </label>
                     </div>
                  </div>
               </div>



               
                  </div>




                  <div  v-if="attackTab === 'text'">
                     <div class="field">
                        <div class="control">
                           <label class="checkbox">
                           <input type="checkbox" id="use_rules">
                           Use rules
                           </label>
                        </div>
                     </div>
                     <div class="columns">
                        <div class="column is-half">
                           Wordlist
                           <textarea class="textarea is-primary"  id="passwords" rows="25" placeholder="Passwords"></textarea> 
                        </div>
                        <div class="column is-half">
                           Rules
                           <textarea class="textarea is-primary"  id="rules" rows="25" placeholder="Rules"></textarea> 
                        </div>
                     </div>
                  </div>

                  <div  v-if="attackTab === 'online'">

                     <div class="field">
                        <label class="checkbox">
                        <input type="checkbox" v-model="useRules">
                        Use Rules
                        </label>
                     </div>


                     <div class="field" v-if="useRules">
                        <label class="label">Rules URL</label>
                        <div class="control">
                        <input v-model="ruleUrl" class="input" type="text" placeholder="Enter Rule URL">
                        </div>
                     </div>
                     <div class="field">
                        <label class="label">Wordlists URL</label>
                        <div class="control">
                        <input v-model="wordlistUrl" class="input" type="text" placeholder="Enter Wordlist URL">
                        </div>
                     </div>




                  </div>













               </div>
            </div>
         </div>
      </div>
   </section>
</template>