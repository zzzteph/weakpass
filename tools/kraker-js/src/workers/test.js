import hashcat from 'crack-js';

self.onmessage = async  (event) => {
    if (event.data.action === 'start') {
      processChecking(event);
    } 
  };



async function processChecking(event)
{
  

  let hashes=new Set();
  const wordlistFile = event.data.wordlistFile;
  const rulesFile = event.data.rulesFile;
  const selectedHashType=event.data.selectedHashType;
  const hashFile=event.data.hashFile;


  if(!hashcat.availableHashTypes.includes(selectedHashType))
    {
        postMessage({ worker:"vetify",type:"error", message: 'Undefined hashtype' });
        postMessage({worker:"vetify",type:"status", status: "error"});
        
        self.close();
        return;
    }



  let fileContent =false;
  fileContent=await readFile(hashFile);
  if(fileContent==false)
  {
    postMessage({worker:"vetify",type:"error", message: 'Unable to read hash file '});
    postMessage({ worker:"vetify",type:"status", status: "error"});
    
    self.close();
    return;
  } 
    
  for (const hashEntry of fileContent) {

    if(hashcat.isValidHash(hashEntry,selectedHashType))
    {
      hashes.add(hashEntry);
    }

  }




  if (hashes.size == 0) {
    postMessage({ worker:"vetify",type:"error", message: 'Zero hashes loaded for '+selectedHashType });
    postMessage({worker:"vetify",type:"status", status: "error"});
    
    self.close();
    return;
} 
let hashEntries = [...hashes];
postMessage({ worker:"vetify",type:"parsedHashes", hashes: hashEntries });
  


let wordListCount = await getFileLinesCount(wordlistFile);
if(wordListCount==false || wordListCount==0)
{
    postMessage({worker:"vetify",type:"error", message: 'Wordlist file could not be read or empty' });
    postMessage({ worker:"vetify",type:"status", status: "error"});
    self.close();
    return;
}
postMessage({ worker:"vetify",type:"wordlist", keySpace: wordListCount });
let rulesCount = await getFileLinesCount(rulesFile);

if(rulesCount==false || rulesCount==0)rulesCount=1;
let keySpace=hashes.size*wordListCount*rulesCount;

postMessage({ worker:"vetify",type:"keyspace", keyspace: keySpace });

let speed=false;
 speed=hashcat.measureSpeed(selectedHashType);

if(speed==false || speed==0)
{
    postMessage({ worker:"vetify",type:"error", message: 'Unable to measure the speed' });
    postMessage({ worker:"vetify",type:"status", status: "error"});
    self.close();
    return;

}
postMessage({ worker:"vetify",type:"speed", speed: speed});
postMessage({ worker:"vetify",type:"time", time: keySpace/speed});

postMessage({ worker:"vetify",type:"status", status: "done"});
}


  function readFile(file) {
    return new Promise((resolve) => {

      if (!(file instanceof File)) {
        resolve(false); 
        return;
      }

      let reader = new FileReader();
  
      reader.onload = (event) => {
        let content = event.target.result;
        let lines = content.split('\n').map(line => line.trim()).filter(line => line !== '');
        let uniqueLines = Array.from(new Set(lines));
        resolve(uniqueLines);
      };
  
      reader.onerror = () => resolve(false);
  
      reader.readAsText(file);
    });
  }


  function getFileLinesCount(file) {
    return new Promise((resolve) => {
      if (!(file instanceof File)) {
        resolve(false); 
        return;
      }
  
      let reader = new FileReader();
      let offset = 0;
      const chunkSize = 1024 * 1024; 
      let remainder = '';
      let lineCount = 0;
  
      function readChunk() {
        if (offset >= file.size) {
          if (remainder.trim()) {
            lineCount++;
          }
          resolve(lineCount);
          return;
        }
  
        const blob = file.slice(offset, offset + chunkSize);
        reader.onload = (event) => {
          const text = remainder + event.target.result;
          const lines = text.split('\n');
          remainder = lines.pop();
          lineCount += lines.length;
          offset += chunkSize;
          readChunk();
        };
  
        reader.onerror = () => resolve(false); 
  
        reader.readAsText(blob);
      }
  
      try {
        readChunk();
      } catch (error) {
        resolve(false);
      }
    });
  }

