<script setup>
import { ref,onMounted,computed,onBeforeUnmount,watch   } from 'vue';
import hashcat from 'crack-js';

const itemsPerPage = ref(5);
const currentPage = ref(1);

const sortedTasks = computed(() => [...tasks.value].sort((a, b) => b.id - a.id));


const paginatedTasks = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;
  return sortedTasks.value.slice(startIndex, endIndex);
});

function saveDataToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks.value));
  localStorage.setItem("speedMeasureResults", JSON.stringify(speedMeasureResults.value));
}
function monitorTasks() {
  const now = new Date();

  tasks.value .filter(task => task.status !== 'done' && task.status !== 'error').forEach((task) => {
   const lastSeen = task.lastSeen instanceof Date ? task.lastSeen : new Date(task.lastSeen);
    const elapsedTime = now - lastSeen;
    if (elapsedTime > 5 * 60 * 1000) { //5 mins will be enough

      task.error = "Killed due to unresponse. Probably error or too long task";
      task.status = "error";
      if (task.worker != null && task.worker instanceof Worker) {
        task.worker.terminate();
        task.worker = null;
      }
    }
  });
}

const totalPages = computed(() => Math.ceil(tasks.value.length / itemsPerPage.value));
function timeConverter(seconds) {
  const days = Math.floor(seconds / (24 * 60 * 60));
  seconds %= (24 * 60 * 60);

  const hours = Math.floor(seconds / (60 * 60));
  seconds %= (60 * 60);

  const minutes = Math.floor(seconds / 60);
  seconds %= 60;

  const parts = [];
  if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);
  if (hours > 0) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds} second${seconds > 1 ? 's' : ''}`);

  return parts.join(', ');
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}

function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}

function setPage(page) {
  currentPage.value = page;
}

const adjectives = [
  'Brave',
  'Clever',
  'Quick',
  'Happy',
  'Bold',
  'Bright',
  'Strong',
  'Quiet',
  'Wise',
  'Jolly'
];

const nouns = [
  'Tiger',
  'Eagle',
  'Fox',
  'Lion',
  'Hawk',
  'Bear',
  'Wolf',
  'Shark',
  'Panther',
  'Dragon'
];

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateRandomName() {
  const adjective = getRandomElement(adjectives);
  const noun = getRandomElement(nouns);
  taskName.value = `${adjective} ${noun}`;
}

let taskId = ref(1);
const tasks = ref([]);


const availableHashTypes = ref([]);
const selectedHashType = ref('');


let intervalId;
let monitorId;
const taskName=ref('');
const isVerified=ref(false);
const errorMessage=ref('');
const isError=ref(false);
const time=ref(0);
const keyspace=ref(0);
const hashFile = ref(null);
const hashFileName = ref('');
const speed=ref(0);
const isAlive=ref(0);
const wordlistFile = ref(null);
const wordlistName = ref('');


const rulesFile = ref(null);
const rulesName = ref('');


const benchmarkWorker = ref(null);
const verifyWorker = ref(null);
const isBenchmarkWorkerRunning = computed(() => {
    return benchmarkWorker.value !== null;
});

const isVerifyWorkerRunning = computed(() => {
    return verifyWorker.value !== null;
});




const speedMeasureResults = ref([]);



const deleteTask = (taskID) => {
   const confirmed = confirm(`Do you want to delete task ${taskID}?`);
   if (!confirmed) return;


  const index = tasks.value.findIndex(task => task.id === taskID);
  if (index !== -1) {

   if (getTaskByID(taskID).worker!=null && getTaskByID(taskID).worker instanceof Worker) {
        getTaskByID(taskID).worker.terminate();
         getTaskByID(taskID).worker = null; 

   }


    tasks.value.splice(index, 1); 
    localStorage.setItem('tasks', JSON.stringify(tasks.value));
  }
  
};



const getTaskByID = (taskID) => {
  return tasks.value.find((task) => task.id === taskID) || null;
};
const runCrackWorker = () => {


   if (selectedHashType.value && hashFile.value && wordlistFile.value) {
      const crackWorker = new Worker(new URL('./workers/files.js', import.meta.url), { type: 'module' });

      crackWorker.onmessage = (event) => {
         if(event.data.worker="crack")
         {
      if(event.data.type=="status")
         {
            if(event.data.status=="running" )
            {
               getTaskByID(event.data.id).progress=event.data.progress;
               getTaskByID(event.data.id).lastSeen=new Date();
            }
            if(event.data.status=="done" )
            {
               getTaskByID(event.data.id).timeleft=false;
               if (getTaskByID(event.data.id).worker!=null && getTaskByID(event.data.id).worker instanceof Worker) {
                  getTaskByID(event.data.id).worker.terminate();
                  getTaskByID(event.data.id).worker = null; 

               }



            }
            getTaskByID(event.data.id).status=event.data.status;
            

         }
         if(event.data.type=="error")
         {
            getTaskByID(event.data.id).error=event.data.message;
            if (getTaskByID(event.data.id).worker!=null && getTaskByID(event.data.id).worker instanceof Worker) {
                  getTaskByID(event.data.id).worker.terminate();
                  getTaskByID(event.data.id).worker = null; 

               }
         }

         if(event.data.type=="parsedHashes")
         {

            getTaskByID(event.data.id).hashes=event.data.hashes;
            getTaskByID(event.data.id).lastSeen=new Date();

         }
         if(event.data.type=="keyspace")
         {

            getTaskByID(event.data.id).keyspace=event.data.keyspace;
            getTaskByID(event.data.id).lastSeen=new Date();

         }
         if(event.data.type=="progress")
         {

            getTaskByID(event.data.id).progress=event.data.progress;
            getTaskByID(event.data.id).lastSeen=new Date();

         }
         if(event.data.type=="tmpkeyspace")
         {
            getTaskByID(event.data.id).skipspace=event.data.skipspace;
            getTaskByID(event.data.id).tmpkeyspace=event.data.tmpkeyspace;
            if(getTaskByID(event.data.id).speed!==0)
            getTaskByID(event.data.id).timeleft=timeConverter( Math.floor(getTaskByID(event.data.id).tmpkeyspace/ getTaskByID(event.data.id).speed));
            getTaskByID(event.data.id).lastSeen=new Date();

         }
         if(event.data.type=="update")
         {
           

            getTaskByID(event.data.id).cleartext.push((String)(event.data.hash)+":"+(String)(event.data.password));
            getTaskByID(event.data.id).lastSeen=new Date();

         }
         if(event.data.type=="ping")
         {
         
            getTaskByID(event.data.id).lastSeen=new Date();
         }
        
      }
      };


    tasks.value.push({
      id: taskId.value,
      date:new Date(),
      name:taskName.value,
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
      skipspace:0,
      keyspace:keyspace.value,
      timeleft:false,
      tmpkeyspace:0,
      time:time.value,
      speed:speed.value,
      hashes:[],
      cleartext:[],
      error:"",
      keyspace:0,
      lastSeen:new Date()
    });

    const task = getTaskByID(taskId.value);
    task.worker.postMessage({    action: 'start',  id:task.id,   wordlistFile: task.wordlistFile,   hashFile: task.hashFile, rulesFile: task.rulesFile,    selectedHashType:task.selectedHashType});
    localStorage.setItem('tasks', JSON.stringify(tasks.value));
    taskId.value++;
    isVerified.value=false;
    isError.value=false;
    /* selectedHashType.value = '';
   hashFileName.value='';
    hashFile.value=null;
    rulesName.value='';
    wordlistName.value='';
    wordlistFile.value=null;
    rulesFile.value=null;
    selectedHashType.value=null;*/



    generateRandomName();
  } else {
    alert('Please fill in all fields!');
    return;
  }


};








const verify = () => {
   if (verifyWorker.value) {
        let shouldRestart = confirm("A worker is already running. Do you want to restart it?");
        if (!shouldRestart) return;
        stopVerify();
    }


if (selectedHashType.value && hashFile.value && wordlistFile.value) {

   errorMessage.value='';
   isError.value=false;

    verifyWorker.value = new Worker(new URL('./workers/test.js', import.meta.url), { type: 'module' });

    verifyWorker.value.onmessage = (event) => {
      if(event.data.worker="verify")
    {
      if(event.data.type=="status")
         {
            if(event.data.status=="done" )
            {
               isVerified.value=true;
               stopVerify();
            }

         }
         if(event.data.type=="error")
         {
            isVerified.value=false;
            errorMessage.value=event.data.message;
            isError.value=true;
            
            stopVerify();
         }

         if(event.data.type=="keyspace")
         {
            keyspace.value=event.data.keyspace;

         }

         if(event.data.type=="speed")
         {
            speed.value=event.data.speed;

         }

         if(event.data.type=="ping")
         {
             isAlive.value=0;

         }

         if(event.data.type=="time")
         {
         time.value=Math.floor(event.data.time);

         }

      }
   };

   verifyWorker.value.postMessage({    action: 'start',   wordlistFile: wordlistFile.value,   hashFile: hashFile.value, rulesFile:rulesFile.value,    selectedHashType:selectedHashType.value});



} else {
 alert('Please fill in all fields!');
 return;
}


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
         if(event.data.worker="speed")
         {
            if(event.data.status=="done")
            {
               stopBenchMarkWorker();
                return;
            }

            const newResult = event.data;
            let index = speedMeasureResults.value.findIndex(result => result.hashtype === newResult.hashtype);
            if (index !== -1) {
                speedMeasureResults.value[index] = newResult;
            } else {
                speedMeasureResults.value.push(newResult);
            }
         }
        };
    }
    benchmarkWorker.value.postMessage({ action: 'start' });



};


const stopVerify= () => {

if (verifyWorker!=null && verifyWorker.value!=null) {
   verifyWorker.value.terminate();
   verifyWorker.value = null; 

}
};




const stopBenchMarkWorker = () => {

if (benchmarkWorker!=null && benchmarkWorker.value!=null) {
  benchmarkWorker.value.terminate();
  benchmarkWorker.value = null; 

}
};



onMounted(() => {
   loadTasksFromLocalStorage();
   loadBenchMarkFromLocalStorage();
   generateRandomName();
   availableHashTypes.value = hashcat.availableHashTypes;
   benchmarkRun();

   intervalId = setInterval(() => {    saveDataToLocalStorage();  }, 10000); 
   monitorId = setInterval(() => {    monitorTasks();  }, 10000); 
  

});



onBeforeUnmount(() => {
   stopBenchMarkWorker();
   stopVerify();
   clearInterval(intervalId);
   clearInterval(monitorId);
});



function handleHashFileSelect(event) {

   const selectedFile = event.target.files[0];

   if (selectedFile !== hashFile.value) {
   hashFile.value = event.target.files[0];
   hashFileName.value = hashFile.value ? hashFile.value.name : '';
   isVerified.value=false;
   isError.value=false;
   }

}

function handleWordlistSelect(event) {

   const selectedFile = event.target.files[0];

if (selectedFile !== wordlistFile.value) {
   wordlistFile.value = event.target.files[0];
   wordlistName.value = wordlistFile.value ? wordlistFile.value.name : '';
   isVerified.value=false;
   isError.value=false;
}


}


function handleRulesSelect(event) {
   rulesFile.value = event.target.files[0];
   rulesName.value = rulesFile.value ? rulesFile.value.name : '';
   isVerified.value=false;
   isError.value=false;
}



function onHashTypeChange() {
  isVerified.value = false;
  isError.value = false;
}


function downloadCleartext(id)
{

  const fileContent = getTaskByID(id).cleartext.join('\n');

  const blob = new Blob([fileContent], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = getTaskByID(id).hashFileName+"_cleartext.txt";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);


   
}

function downloadHashes(id)
{

  const fileContent = getTaskByID(id).hashes.join('\n');

  const blob = new Blob([fileContent], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = getTaskByID(id).hashFileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);


   
}
function loadBenchMarkFromLocalStorage() {
  const savedTasks = localStorage.getItem('tasks');
  if (savedTasks) {
    try {
      const parsedTasks = JSON.parse(savedTasks);


      tasks.value = parsedTasks.map(task => ({
        ...task,
        date: new Date(task.date), 
        status: task.status === 'running' ? 'terminated' : task.status, 
        timeleft: false, 
      }));

      if (tasks.value.length > 0) {
        const maxTaskId = Math.max(...tasks.value.map(task => task.id));
        taskId.value = maxTaskId + 1;
      }
    } catch (error) {
      console.error("Failed to parse tasks from localStorage", error);
    }
  }
}

function loadTasksFromLocalStorage() {
  const benchTable = localStorage.getItem('speedMeasureResults');
  if (benchTable) {
    try {
      speedMeasureResults.value = JSON.parse(benchTable);
    } catch (error) {
      console.error("Failed to parse benchTable from localStorage", error);
    }
  }
}

</script>
<template>
   <section class="section">
      <div class="container">
         <div class="columns is-multiline is-align-items-center">
            <div class="column is-12 ml-auto">
               <h1 class="mb-5 is-size-1 is-size-3-mobile has-text-weight-bold">Kracker-JS</h1>
            </div>
            <div class="column is-12 ml-auto">
            <p><strong>Pure client-side</strong> javascript tool that allows to crack hashes and get cleartext passwords <strong>right</strong> <strong>from</strong> <strong>your</strong> <strong>browser</strong> just in 3-clicks. </p>
            <p>Download more wordlists at <a href="https://weakpass.com" target="_blank">https://weakpass.com</a>. <strong>How-to: </strong>select a hashfile, choose the wordlist, crack it!</p>


            
            </div>




            <div class="column is-12 ml-auto">

<h2 class="title">New task</h2>

<div class="box">

   <div class="field">


            <div class="control">
               <div class="file has-name">
               <label class="file-label">
                  <input class="file-input" type="file"  @change="handleHashFileSelect" :disabled="isVerifyWorkerRunning"/>
                  <span class="file-cta">
                     
                     <span class="file-label">(*) Choose a hashfile … </span>
                     
                  </span>
                  <span class="file-name" v-if="hashFileName">{{ hashFileName }}</span>
               </label>
               </div>
            </div>
   </div>    

   <div class="field">

         
                  <div class="control" v-if="hashFile">
               <div class="file has-name">
               <label class="file-label">
                  <input class="file-input" type="file"  @change="handleWordlistSelect" :disabled="isVerifyWorkerRunning"/>
                  <span class="file-cta">
                     
                     <span class="file-label">(*) Choose a wordlist … </span>
                     
                  </span>
                  <span class="file-name" v-if="wordlistName">{{ wordlistName }}</span>
               </label>
               </div>
            </div>
             
         </div> <div class="field">
            <div class="control" v-if="wordlistName">
               <div class="file has-name">
               <label class="file-label">
                  <input class="file-input" type="file"  @change="handleRulesSelect" :disabled="isVerifyWorkerRunning"/>
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
            <select v-model="selectedHashType" class="is-focused" :disabled="isVerifyWorkerRunning"  @change="onHashTypeChange">
               <option disabled value="">(*)Select hash type</option>
               <option v-for="(type, index) in availableHashTypes" :key="index" :value="type">
                  {{ type }}
               </option>
            </select>
            </div>
         </div>

         <div v-if="!isVerified && isVerifyWorkerRunning==false" class="control">
               <button class="button is-link" @click="verify">Verify</button>
            </div>
            <div v-if="isVerifyWorkerRunning==true" class="control">
               <button class="button is-danger" @click="stopVerify">

                  <span class="icon">
                           <i class="fa-solid fa-pause"></i>
                     </span>


               </button>
            </div>


            <div v-if="selectedHashType&&isVerified==true&&isVerifyWorkerRunning==false" class="control">
               <button class="button is-success" @click="runCrackWorker">Crack</button>
            </div>




         </div>


         <div class="notification is-info" v-if="isVerifyWorkerRunning==true">
           
            <span class="icon-text">

  <span> Task verification in process, please wait</span>
  <span class="icon">
                           <i class="fa-solid fa-spinner fa-spin"></i>
                     </span>
</span>



            </div>


         <div class="notification is-danger" v-if="isError">
            {{ errorMessage }}
            </div>
            <div class="notification is-success" v-if="isVerified">
              <strong> {{ timeConverter(time) }}</strong> to complete
            </div>

</div>
</div>

<hr/>

<div class="column is-12 ml-auto">

            <nav class="pagination is-centered" role="navigation" aria-label="pagination">
      <button class="pagination-previous" :disabled="currentPage === 1" @click="previousPage">
        Previous
      </button>
      <button class="pagination-next" :disabled="currentPage === totalPages" @click="nextPage">
        Next
      </button>
      <ul class="pagination-list">
        <li v-for="page in totalPages" :key="page">
          <a
            class="pagination-link"
            :class="{ 'is-current': currentPage === page }"
            @click="setPage(page)"
          >
            {{ page }}
          </a>
        </li>
      </ul>
    </nav>

   </div>

            <div class="column is-12 ml-auto"  v-for="(task, index) in paginatedTasks " :key="index" >


               <div class="card">
               <header class="card-header  ">
                  <p class="card-header-title ">
                     
                     <span class="icon-text">
                     # {{ task.id }} - {{ task.name }}                 
                      <span class="icon">
                           <i class="fa-solid fa-spinner fa-spin has-text-info" v-if="task.status=='running'"></i>
                           <i class="fa-solid fa-circle-check has-text-success"  v-if="task.status=='done'"></i>
                           <i class="fa-solid fa-bug has-text-danger" v-if="task.status=='error'"></i>
                           <i class="fa-solid fa-ban has-text-info"  v-if="task.status=='terminated'"></i>
                     </span>
                  </span>
                  </p>                     

                  <button    class="card-header-icon" @click="deleteTask(task.id)">
                     <span class="icon">
                        <i class="fa-solid fa-trash"></i>
                     </span>
                  </button>
               </header>
               <div class="card-content is-success">
                  <div class="content">
                     <ul>
                        <li v-if="task.rulesFile!==null"><strong>Type:</strong>  {{ task.selectedHashType }}</li>
                              <li v-if="task.hashFile!==null"><strong>Hashfile:</strong> {{ task.hashFileName }}</li>
                              <li v-if="task.wordlistFile!==null"><strong>Wordlist:</strong>  {{ task.wordlistName }}</li>
                              <li v-if="task.rulesFile!==null"><strong>Rules:</strong>  {{ task.rulesName }}</li>
                              <li v-if="task.timeleft!==false">
                                 
                                                                  <span class="icon-text">
                                 <span class="icon">
                                    <i class="fa-regular fa-clock fa-beat"></i>   
                                 </span>
                                 <span>{{ task.timeleft }}</span>
                                 </span>


                              
                              </li>
                              <li><time :datetime=task.date>{{ task.date.toLocaleDateString() }}</time></li>
                           </ul>



                           <p v-if="task.status=='error'">{{ task.error }}</p>
                          
                          <progress v-if="task.status=='running'" class="progress" :value=task.progress max="100">{{ task.progress }}</progress>
                     
                  </div>
               </div>
               <footer class="card-footer" v-if="task.hashes.length>0" >

                  <a class="card-footer-item" aria-label="reply" @click="downloadHashes(task.id)">
                              <span class="icon-text">
                                    <span class="icon">
                                       <i class="fa-solid fa-download"></i>
                                    </span>
                                    <span>Hashes  {{ task.hashes.length }}</span>
                                    </span>
                           </a>


                           <a class="card-footer-item" aria-label="retweet" v-if="task.cleartext.length > 0" @click="downloadCleartext(task.id)">
                              <span class="icon-text">
                                    <span class="icon">
                                       <i class="fa-solid fa-download"></i>
                                    </span>
                                    <span>Cleartext {{ task.cleartext.length }}</span>
                                    </span>
                           </a>            

               </footer>
               </div>

            </div>






            <div class="column is-12 ml-auto">
               <h2 class="title">Benchmark 
                  <button v-if="!isBenchmarkWorkerRunning" class="button is-primary is-small" @click="benchmarkRun">
                     
                     <span class="icon">
                        <i class="fa-solid fa-play"></i>

                     </span>


                  </button>
                  <button v-else class="button is-danger is-small" @click="stopBenchMarkWorker">
                     
                     <span class="icon">
                        <i class="fa-solid fa-stop"></i>

                     </span>


                  </button>
               </h2>
               






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






               
            </div>


         </div>



         

      </div>
   </section>
</template>