<script setup>
import { ref, computed } from 'vue';
const API_URL="https://weakpass.com/api/v1/range/";

let hashes = ref([]);
let revealed = ref([]);
let isProcessing = ref(false);
let content = ref("");
const activeTab = ref('found');
const setActiveTab = (tab) => {
  activeTab.value = tab;
};
const reversedRevealed = computed(() => {
  return [...revealed.value].reverse();
});


const filteredRows = computed(() => {
  if (activeTab.value === 'found') {

    return reversedRevealed.value.filter(item => item.match !== false);
  } else {

    return reversedRevealed.value.filter(item => item.match === false);
  }
});




const strictCount = computed(() => {
  return revealed.value.filter(item => item.match === "strict").length;
});


const partialCount = computed(() => {
  return revealed.value.filter(item => item.match === "partial").length;
});


const lastCount = computed(() => {
  return revealed.value.filter(item => item.match === "last").length;
});
const noMatchCount = computed(() => {
  return revealed.value.filter(item => item.match === false).length;
});


const cleanUp = async() =>{
  hashes.value.forEach(hash => {

    revealed.value.push({hash: hash,pass: false,type:false,match:false});
});
hashes.value=[];
content.value="";

}


const buildHashDB = async () => {
  let explodedArray = content.value.split(/[\n\s:;]+/);
  explodedArray = explodedArray.filter(item => item.trim() !== "");
  hashes.value=[...new Set(explodedArray)];

};



const fullMatch= async (results,hashtype) => {

let matchedHashes = [];
hashes.value.forEach(hash => {
  results.flat().forEach(item => {

      if(item.hash==hash.toLowerCase())
      {
        revealed.value.push({hash: item.hash,pass: item.pass,type:hashtype,match:"strict"});
        matchedHashes.push(hash.toLowerCase());
      }

  });
});
hashes.value = hashes.value.filter(h => !matchedHashes.includes(h.toLowerCase()));


};

const partialMatch= async (results,hashtype) => {

let matchedHashes = [];
hashes.value.forEach(hash => {
  results.flat().forEach(item => {

   if(item.hash.length-hash.length<item.hash.length/2)
    {
      
      if(item.hash.startsWith(hash.toLowerCase()))
        {
          revealed.value.push({hash: item.hash,pass: item.pass,type:hashtype,match:"partial",original:hash});
          matchedHashes.push(hash.toLowerCase());
        }

    }

  });
});
hashes.value = hashes.value.filter(h => !matchedHashes.includes(h.toLowerCase()));


};

const lastBytes= async (results,hashtype) => {

let matchedHashes = [];
hashes.value.forEach(hash => {
  let entry=hash.slice(0, -2);

  results.flat().forEach(item => {

   if(item.hash.length-entry.length<item.hash.length/2)
    {
      
      if(item.hash.startsWith(entry.toLowerCase()))
        {
          revealed.value.push({hash: item.hash,pass: item.pass,type:hashtype,match:"last",original:hash});
          matchedHashes.push(hash.toLowerCase());
        }

    }

  });
});
hashes.value = hashes.value.filter(h => !matchedHashes.includes(h.toLowerCase()));


};


const parseResults= async (results,hashtype) => {
  

await fullMatch(results,hashtype);
await partialMatch(results,hashtype);
await lastBytes(results,hashtype);
}

const handleLookupSHA256 = async () => {

  let processedLines = new Set ();

  hashes.value.forEach((line) => {
   
    if (line.length >= 60 &&  line.length <= 64 && /^[0-9a-fA-F]+$/i.test(line)) {
      processedLines.add(line.substring(0, 6));
    }
  });

  const fetchData = async (hash) => {
    const response = await fetch(`${API_URL}${hash}.json?type=sha256`);
    return response.json();
  };

  // Loop through the processed lines and fetch & parse results one by one
  for (let hash of processedLines) {
    try {
      let data = await fetchData(hash); 
     await parseResults([data], "sha256");
    } catch (error) {
      console.error(`Error fetching data for hash ${hash}:`, error);
    }
  }
};



const handleLookupSHA1 = async () => {
  let processedLines = new Set ();

  hashes.value.forEach((line) => {
   
    if (line.length >= 38 && line.length <= 40 && /^[0-9a-fA-F]+$/i.test(line)) {
      processedLines.add(line.substring(0, 6));
    }
  });

  const fetchData = async (hash) => {
    const response = await fetch(`${API_URL}${hash}.json?type=sha1`);
    return response.json();
  };

  for (let hash of processedLines) {
    try {
      let data = await fetchData(hash); 
     await parseResults([data], "sha1");
    } catch (error) {
      console.error(`Error fetching data for hash ${hash}:`, error);
    }
  }
};



const handleLookupMD5 = async () => {
  let processedLines = new Set ();
  
  hashes.value.forEach((line) => {
   
    if (line.length >= 30 &&  line.length <= 32 && /^[0-9a-fA-F]+$/i.test(line)) {
      processedLines.add(line.substring(0, 6));
    }
  });

  const fetchData = async (hash) => {
    const response = await fetch(`${API_URL}${hash}.json?type=md5`);
    return response.json();
  };


  for (let hash of processedLines) {
    try {
      console.log(hash);
      let data = await fetchData(hash); 
     await parseResults([data], "md5");
    } catch (error) {
      console.error(`Error fetching data for hash ${hash}:`, error);
    }
  }
};


const handleLookupNTLM = async () => {
  let processedLines = new Set ();

  hashes.value.forEach((line) => {
   
    if (line.length >= 30 &&   line.length <= 32 && /^[0-9a-fA-F]+$/i.test(line)) {
      processedLines.add(line.substring(0, 6));
    }
  });

  const fetchData = async (hash) => {
    const response = await fetch(`${API_URL}${hash}.json?type=ntlm`);
    return response.json();
  };


  for (let hash of processedLines) {
    try {
      let data = await fetchData(hash); 
     await parseResults([data], "ntlm");
    } catch (error) {
      console.error(`Error fetching data for hash ${hash}:`, error);
    }
  }
};




const handleLookup = async () => {
  isProcessing.value=true;


  await buildHashDB();



  try {
    await handleLookupMD5();
  } catch (error) {
    console.error("Error during MD5 lookup:", error);
  }

  try {
  await handleLookupNTLM();
  }
  catch (error) {
    console.error("Error during NTLM lookup:", error);
  }
  try {
  await handleLookupSHA1();  
}
  catch (error) {
    console.error("Error during SHA1 lookup:", error);
  }
  try {
  await handleLookupSHA256();  
}
  catch (error) {
    console.error("Error during SHA256 lookup:", error);
  }


  try {
  await cleanUp();  
}
  catch (error) {
    console.error("Cleanup failed:", error);
  }

  isProcessing.value=false;
};



const generateFullCSV = () => {
  const csvContent = generateCSVContent([
    ['Hash', 'Match','Type','Password'], 
    ...revealed.value.map(item => [
      item.hash,
      item.match !== false ? item.match : 'no match',
      item.type,
      item.pass

    ])
  ]);

  downloadCSV(csvContent, 'all_hashes.csv');
};


const generateFilteredCSV = () => {
  const csvContent = generateCSVContent([
    ['Hash', 'Match',  'Type','Password'], 
    ...revealed.value
      .filter(item => item.match !== false)
      .map(item => [
        item.hash,
        item.match,
        
        item.type,
        item.pass,
      ])
  ]);

  downloadCSV(csvContent, 'found_hashes.csv');
};


const generateCSVContent = (rows) => {
  return rows.map(row => row.join(',')).join('\n');
};


const downloadCSV = (csvContent, filename) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>



<template>




<section class="section">
    <div class="container is-box">
      <div class="columns is-multiline is-align-items-center">

        <div class="column is-12 ml-auto">
            <h2 class="mb-5 is-size-1 is-size-3-mobile has-text-weight-bold">Password lookup</h2>
            <h2 class="subtitle">Reveal password for MD5, NTLM, SHA1 or SHA256 hash with precomputed <strong>weakpass4.merged.txt</strong> without sending it to the backend</h2>
        </div>

        <div class="column is-12 ml-auto">
            <form @submit.prevent="handleLookup">
            <div class="field">
  <div class="control">
    <textarea class="textarea"   
    placeholder="bef58f652fddb1c20ecbfdb7cf31d932
One hash per line"  rows="7" v-model="content"></textarea>
  </div>
</div>
   
  <div class="field">
  <div class="control">
    <button type="submit" class="button is-link" :disabled="isProcessing">

<span v-if="isProcessing" >
  Running...
</span>

<span v-if="!isProcessing">
  Search
</span>



</button>
  </div>
</div>
</form>

        </div>


        <div class="column is-12" v-if="revealed.length">
    <div class=" px-0">
      <div>
        <div class="mb-4 px-5 is-flex is-justify-content-space-between is-align-items-center">
          <h4 class="title mb-0 is-size-4 is-hidden-mobile ">Revealed hashes</h4>

          <div class="field is-grouped">
  <div class="control">
    <button class="button is-link" @click="generateFilteredCSV" > 
      
      <span class="icon-text">

        <span>Found ({{ strictCount+partialCount + lastCount }})</span>

      </span>
      
      </button>
  </div>
  <div class="control">
    <button class="button is-link" @click="generateFullCSV"> 
      
      <span class="icon-text">

        <span>All ({{ strictCount+partialCount + lastCount+noMatchCount }})</span>

      </span>
      
      </button>
  </div>
</div>
        </div>

        <div class="tabs">
          <ul class="px-5">
            <li :class="{ 'is-active': activeTab === 'found' }"><a class="is-size-6 px-3 pb-2" :style="{'border-bottom: solid 2px;':activeTab === 'found'}"   @click="setActiveTab('found')">Found {{ strictCount+partialCount + lastCount }}</a></li>
            <li :class="{ 'is-active': activeTab === 'unknown' }"><a class="is-size-6 px-3 pb-2" :style="{'border-bottom: solid 2px;':activeTab === 'found'}"   @click="setActiveTab('unknown')">Unknown {{ noMatchCount }}</a></li>
          </ul>
        </div>


      </div>
      <div>
        <div class="mb-4 is-justify-content-space-between is-align-items-center">
      <div class="table-container">
        <table class="table is-fullwidth mt-3">
          <thead>
            <tr>
              <th >Hash</th>
              <th v-if="activeTab==='found'">Password</th>
              <th v-if="activeTab==='found'">Type  </th>

            </tr>
          </thead>
          <tbody>
            <tr  v-for="(item, index) in filteredRows" :key="index">
              <td             
            :class="{
            'is-primary': item.match === 'strict',
            'is-success': item.match === 'partial' || item.match === 'last',
            'is-warning': item.match !== 'strict' && item.match !== 'partial' && item.match !== 'last'
          }">

                {{ item.hash }}
              </td>
              <td v-if="activeTab==='found'"><span v-if="item.match!=false">{{ item.pass }}</span></td>
              <td v-if="activeTab==='found'"><span v-if="item.match!=false">{{ item.type }}</span></td>

            </tr>




          </tbody>
        </table>
      </div>
    </div>
  </div>
    </div>
  </div>




        <div class="column is-12 is-12-desktop ml-auto">
          <div>


            <div class="is-flex">
              <div>

                <p class="has-text-grey-dark">In the <code>/db/</code> folder, you'll find an example structure of the database. Currently, this tool uses <code>https://weakpass.com/api/v1/range</code> as the primary tool URL. However, you can implement your own and change the <code>API_URL</code> value to use it.</p>
              </div>
            </div>

          </div>
        </div>












      </div>
    </div>





    
    <br/>

</section>


</template>





