<script setup>
import { ref,onMounted,computed,onBeforeUnmount,watch   } from 'vue';
import hashcat from 'crack-js';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
let taskId = ref(1);
const tasks = ref([]);


const availableHashTypes = ref([]);
const selectedHashType = ref('');

const crackWorker = ref(null);

const mainTab = ref('hashes');
const attackTab = ref('files');



const hashFile = ref(null);
const hashFileName = ref('');


const wordlistFile = ref(null);
const wordlistName = ref('');


const rulesFile = ref(null);
const rulesName = ref('');


const benchmarkWorker = ref(null);

const isBenchmarkWorkerRunning = computed(() => {
    return benchmarkWorker.value !== null;
});




const speedMeasureResults = ref([]);

const logMessages = ref('');


const logMessage = (message) => {

   const timestamp = new Date().toLocaleString();
   logMessages.value += `[${timestamp}] ${message}\n`;


};


const hashesInput = ref('');



const getTaskByID = (taskID) => {
  return tasks.value.find((task) => task.id === taskID) || null;
};
const runCrackWorker = () => {


   if (selectedHashType.value && hashFile.value && wordlistFile.value) {
      const crackWorker = new Worker(new URL('./workers/files.js', import.meta.url), { type: 'module' });

      crackWorker.onmessage = (event) => {
      if(event.data.type=="status")
         {
            if(event.data.status=="running" )
            {
               getTaskByID(event.data.id).progress=event.data.progress;
            }
            getTaskByID(event.data.id).status=event.data.status;

         }
         if(event.data.type=="error")
         {
            getTaskByID(event.data.id).error=event.data.message;
         }

         if(event.data.type=="parsedHashes")
         {

            getTaskByID(event.data.id).hashes=event.data.hashes;

         }
         if(event.data.type=="keyspace")
         {

            getTaskByID(event.data.id).keyspace=event.data.keyspace;

         }
         if(event.data.type=="progress")
         {

            getTaskByID(event.data.id).progress=event.data.progress;

         }

         if(event.data.type=="update")
         {
           

            getTaskByID(event.data.id).cleartext.push((String)(event.data.hash)+":"+(String)(event.data.hash));
        
            

         }


      };


    tasks.value.push({
      id: taskId.value,
      worker: crackWorker,
      hashFile: hashFile.value,
      wordlistFile: wordlistFile.value,
      rulesFile: rulesFile.value,
      hashFileName:hashFileName.value,
      wordlistName:wordlistName.value,
      rulesName:rulesName.value,
      selectedHashType: selectedHashType.value,
      progress: 0, 
      status:"todo",


      hashes:[],
      cleartext:[],
      error:"",
      keyspace:0
    });

    const task = getTaskByID(taskId.value);
    task.worker.postMessage({    action: 'start',  id:task.id,   wordlistFile: task.wordlistFile,   hashFile: task.hashFile, rulesFile: task.rulesFile,    selectedHashType:task.selectedHashType});
  
    taskId.value++;

    selectedHashType.value = '';
    hashFileName.value='';
    hashFile.value=null;
    rulesName.value='';
    wordlistName.value='';
    wordlistFile.value=null;
    rulesFile.value=null;
    selectedHashType.value=null;
    
  } else {
    alert('Please fill in all fields!');
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

function handleHashFileSelect(event) {
   hashFile.value = event.target.files[0];
   hashFileName.value = hashFile.value ? hashFile.value.name : '';
}

function handleWordlistSelect(event) {
   wordlistFile.value = event.target.files[0];
   wordlistName.value = wordlistFile.value ? wordlistFile.value.name : '';
}


function handleRulesSelect(event) {
   rulesFile.value = event.target.files[0];
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

            <div class="column is-12 ml-auto"  v-for="(task, index) in tasks" :key="index" >
               <div class="box">




                  <article class="media">
                     <div class="media-left">
                        <span class="icon">
                           <i class="fa-solid fa-spinner fa-spin" v-if="task.status=='running'"></i>
                           <i class="fa-solid fa-circle-check"  v-if="task.status=='done'"></i>
                           <i class="fa-solid fa-bug" v-if="task.status=='error'"></i>
                              </span>
                     </div>
                     <div class="media-content">
                        <div class="content">
                        <p>
                           <strong># {{ task.id }}</strong>
                           <small>&nbsp;{{ task.error }}</small>
                           <br />

                           <progress v-if="task.status!=='done'" class="progress" :value=task.progress max="100">{{ task.progress }}</progress>
                        </p>
                        </div>
                        <nav class="level is-mobile" v-if="task.hashes.length>0" >
                        <div class="level-left">
                           <a class="level-item" aria-label="reply">
                              <span class="icon-text">
                                    <span class="icon">
                                       <i class="fa-solid fa-download"></i>
                                    </span>
                                    <span>Hashes  {{ task.hashes.length }}</span>
                                    </span>
                           </a>
                           <a class="level-item" aria-label="retweet" v-if="task.cleartext.length > 0">
                              <span class="icon-text">
                                    <span class="icon">
                                       <i class="fa-solid fa-download"></i>
                                    </span>
                                    <span>Cleartext {{ task.cleartext.length }}</span>
                                    </span>
                           </a>

                        </div>
                        </nav>
                     </div>
                  </article>




                


               </div>
            </div>



            <div class="column is-12 ml-auto">
               <div class="box">
                  

                  
                  <div class="field is-grouped">
                                 <div class="control">
                              <div class="file has-name">
                              <label class="file-label">
                                 <input class="file-input" type="file"  @change="handleHashFileSelect" />
                                 <span class="file-cta">
                                    
                                    <span class="file-label"> Choose a hashfile … </span>
                                    
                                 </span>
                                 <span class="file-name" v-if="hashFileName">{{ hashFileName }}</span>
                              </label>
                              </div>
                           </div>
                      


                        
                                 <div class="control" v-if="hashFile">
                              <div class="file has-name">
                              <label class="file-label">
                                 <input class="file-input" type="file"  @change="handleWordlistSelect" />
                                 <span class="file-cta">
                                    
                                    <span class="file-label"> Choose a wordlist … </span>
                                    
                                 </span>
                                 <span class="file-name" v-if="wordlistName">{{ wordlistName }}</span>
                              </label>
                              </div>
                           </div>
                            

                           <div class="control" v-if="wordlistName">
                              <div class="file has-name">
                              <label class="file-label">
                                 <input class="file-input" type="file"  @change="handleRulesSelect" />
                                 <span class="file-cta">
                                    
                                    <span class="file-label" > Choose a rules... </span>
                                    
                                 </span>
                                 <span class="file-name" v-if="rulesName">{{ rulesName }}</span>
                              </label>
                              </div>
                           </div>
                     


                          

                         


                        </div>  


                        <div class="field is-grouped"  v-if="wordlistName">
                        <div class="control is-expanded">
                           <div class="select is-fullwidth">
                           <select v-model="selectedHashType" class="is-focused">
                              <option disabled value="">Select hash type</option>
                              <option v-for="(type, index) in availableHashTypes" :key="index" :value="type">
                                 {{ type }}
                              </option>
                           </select>
                           </div>
                        </div>


                           <div v-if="selectedHashType" class="control">
                              <button class="button is-link" @click="runCrackWorker">Crack</button>
                           </div>




                        </div>





               </div>
            </div>



            <div class="column is-12 ml-auto">
               <div class="tabs is-boxed">
                  <ul>
                     <li :class="{ 'is-active': mainTab === 'hashes' }"><a  @click="changeMainTab('hashes')">Hashes</a></li>
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



         

      </div>
   </section>
</template>