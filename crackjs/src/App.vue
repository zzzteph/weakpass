<script setup>
   import { ref,onBeforeUnmount,onMounted   } from 'vue';

let worker;
const workerMessage = ref('');
const speedMeasureResults = ref([]);

const benchmarkRun = () => {


    if (worker) {
    let shouldRestart = confirm("A worker is already running. Do you want to restart it?");
    if (!shouldRestart) return;
    worker.terminate();
    worker = null; 
  }




  if (!worker) {
    worker = new Worker(new URL('./workers/speed.js', import.meta.url), { type: 'module' });
    worker.onmessage = (event) => {      
        const newResult = event.data; 
        console.log(workerMessage.value);
        let index = speedMeasureResults.value.findIndex(result => result.hashtype === newResult.hashtype);
        if (index !== -1) {

            speedMeasureResults.value[index] = newResult;
        } else {

            speedMeasureResults.value.push(newResult);
        }
    };
  }
  worker.postMessage({ action: 'start'});
};

onBeforeUnmount(() => {
  if (worker) {
    worker.terminate();
  }
});

onMounted(() => {
  benchmarkRun();
});












   const mainTab = ref('hashes');
   const attackTab = ref('text');
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
                  </ul>
               </div>
               <div  v-if="mainTab === 'hashes'">
                  <div class="control">
                     <textarea class="textarea is-primary"  id="hashes" rows="10"  placeholder="Each hash on new line"></textarea> 
                  </div>
               </div>
               <div   v-if="mainTab === 'results'">
                  <div class="control">
                     <textarea class="textarea is-primary"  id="hashes" rows="10"  placeholder="This is a results"></textarea> 
                  </div>
               </div>

               <div v-if="mainTab === 'benchmark'">
                <table class="table is-fullwidth">
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


         <div class="columns is-multiline is-align-items-center">

            <div class="column is-12 ml-auto">
                <div class="field is-grouped">

                    <div class="control is-expanded">
                        <div class="select is-fullwidth">
                            <select id="hashtype">
                                <option value="0">MD5</option>
                                <option value="2600">MD5(MD5(PASS))</option>
                                <option value="3500">MD5(MD5(MD5(PASS)))</option>
                                <option value="10">md5($pass.$salt)</option>
                                <option value="100">sha1</option>
                                <option value="1400">sha256</option>
                                <option value="1700">sha512</option>
                                <option value="1000">ntlm</option>
                                <option value="500">md5crypt</option>
                                <option value="1800">sha512crypt</option>
                                <option value="7400">sha256crypt</option>
                                <option value="16500">JWT</option>
                            </select>
                        </div>
                    </div>
                    <div class="control">
                        <button class="button is-link" @click="benchmarkRun">Crack</button>
                    </div>
                    <div class="control" id="button_stop">
                        <button class="button is-danger">Stop</button>
                    </div>
                </div>
            </div>


            <div class="column is-12 ml-auto">
                <div class="notification is-primary" id="notify">Done!</div>
            </div>
            <div class="column is-12 ml-auto">
                <div class="field has-addons" id="div_progress">
                    <p class="control is-expanded">
                        <progress class="progress is-medium" id="progress" value="0" max="100"></progress>
                    </p>
                </div>
            </div>

        </div>

         
         <div id="settings_panel">

            <div class="columns">
               <div class="column">
                  <div class="tabs is-boxed">
                     <ul>
                        <li :class="{ 'is-active': attackTab === 'text' }"><a  @click="changeAttackTab('text')">Text</a></li>
                        <li :class="{ 'is-active': attackTab === 'online' }" ><a  @click="changeAttackTab('online')">Online</a></li>
                     </ul>
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
                           <textarea class="textarea is-primary"  id="passwords" rows="25" placeholder="Passwords">
                           !QAZxsw2
                           !root
                           0123456789
                           0392a0
                           0987654321
                           102030
                           10203040
                           112233
                           </textarea> 
                        </div>
                        <div class="column is-half">
                           Rules
                           <textarea class="textarea is-primary"  id="rules" rows="25" placeholder="Rules">
                           :
                           c
                           u
                           C
                           </textarea> 
                        </div>
                     </div>
                  </div>

                  <div  v-if="attackTab === 'online'">
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
                           <textarea class="textarea is-primary"  id="passwords" rows="25" placeholder="Passwords">
                           !QAZxsw2
                           !root
                           0123456789
                           0392a0
                           0987654321
                           102030
                           10203040
                           112233
                           </textarea> 
                        </div>
                        <div class="column is-half">
                           Rules
                           <textarea class="textarea is-primary"  id="rules" rows="25" placeholder="Rules">
                           :
                           c
                           u
                           C
                           </textarea> 
                        </div>
                     </div>
                  </div>













               </div>
            </div>
         </div>
      </div>
   </section>
</template>