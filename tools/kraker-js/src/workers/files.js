import hashcat from 'crack-js';
import hashcatRule from 'hashcat-rules-js';
self.onmessage = async  (event) => {
    if (event.data.action === 'start') {
        console.log("START");



            let hashes=new Set();
            const wordlistFile = event.data.wordlistFile;
            const taskId = event.data.id;
            const rulesFile = event.data.rulesFile;
            const selectedHashType=event.data.selectedHashType;
            const hashFile=event.data.hashFile;


            if(!hashcat.availableHashTypes.includes(selectedHashType))
              {
                  postMessage({ id:taskId,type:"error", message: 'Undefined hashtype' });
                  postMessage({ id:taskId,type:"status", status: "error"});
                  
                  self.close();
                  return;
              }


            //first parse the file and return number of hashes
            //
            let fileContent =false;
            fileContent=await readFile(hashFile);
            if(fileContent==false)
            {
              postMessage({ id:taskId,type:"error", message: 'Unable to read hash file '});
              postMessage({ id:taskId,type:"status", status: "error"});
              
              self.close();
              return;
            } 
              
            for (const hashEntry of fileContent) {

              if(hashcat.isValidHash(hashEntry,selectedHashType))
              {
                hashes.add(hashEntry);
              }

            }

          console.log(hashes)



            if (hashes.size == 0) {
              postMessage({ id:taskId,type:"error", message: 'Zero hashes loaded for '+selectedHashType });
              postMessage({ id:taskId,type:"status", status: "error"});
              
              self.close();
              return;
          } 

          postMessage({ id:taskId,type:"parsedHashes", hashes: hashes });
            

        //calculate possible ammount of time
         let wordListCount = await getFileLinesCount(wordlistFile);
         console.log(wordListCount);

          let rulesCount = await getFileLinesCount(rulesFile);
          console.log(rulesCount);
          if(rulesCount==false || rulesCount==0)rulesCount=1;
          let keySpace=hashes.size*wordListCount*rulesCount;
          console.log(keySpace);
          postMessage({ id:taskId,type:"keyspace", keySpace: keySpace });
          //adjusted keyspace
          keySpace=hashes.size*wordListCount;
          let previousStatus=0;   
          let currentProgress=0;
          postMessage({ id:taskId,type:"status", status: "running"});
          let hashEntries = [...hashes];

            let countLine=0;
            const chunkSize=64 * 1024;

            let offset = 0;
            let remainder = '';
          
            let rulesContent =false;
            rulesContent=await readFile(rulesFile);

            let reader = new FileReader();
            while (offset < wordlistFile.size) {
              let blob = wordlistFile.slice(offset, offset + chunkSize);
              
                const readPromise = new Promise((resolve) => {
                reader.onload = (event) => {
                  const text = remainder + event.target.result;
                  const lines = text.split('\n');
                  remainder = lines.pop();
                  
                  lines.forEach((line) => {
                    countLine++;
                    currentProgress=calcProgress(keySpace,countLine,hashEntries);
                    if(currentProgress!==previousStatus)
                    {
                      postMessage({ id:taskId,type:"progress", progress: currentProgress});
                      previousStatus=currentProgress;
                    }
                  if(rulesContent!==false)
                  {
                    
                    for (const rule of rulesContent) {
                      let modifiedLine=hashcatRule.applyRule(line.trim(),rule);
                      processHashes(hashEntries,modifiedLine,selectedHashType,taskId)
                    }
                  }
                  else
                  {
                    processHashes(hashEntries,line.trim(),selectedHashType,taskId)
                  }

                  });
          
                  resolve(); 
                };
              });
          
        
              reader.readAsText(blob);
              await readPromise;
              offset += chunkSize;
            }
            if (remainder) {
              console.log(remainder);
            }


      
            postMessage({ id:taskId,type:"progress", progress: 100});
            postMessage({ id:taskId,type:"status", status: "done"});
        
    }
           
  };
function calcProgress(keyspace,count,hashes)
{
  if(hashes.length==0)return 100;
  
  

  return Math.round(100*(count*hashes.length)/keyspace);
}
  function readFile(file) {
    return new Promise((resolve, reject) => {

      if (!(file instanceof File)) {
        resolve(false); // Return false if the input is not a File object
        return;
      }

      let reader = new FileReader();
  
      reader.onload = (event) => {
        let content = event.target.result;
        let lines = content.split('\n').map(line => line.trim()).filter(line => line !== '');//trim and skip empty lines
        let uniqueLines = Array.from(new Set(lines));
        resolve(uniqueLines); // return only uniq rules
      };
  
      reader.onerror = () => resolve(false); // Return false if the file cannot be read
  
      reader.readAsText(file);
    });
  }


  function getFileLinesCount(file) {
    return new Promise((resolve) => {
      if (!(file instanceof File)) {
        resolve(false); // Return false if the input is not a File object
        return;
      }
  
      let reader = new FileReader();
      let offset = 0;
      const chunkSize = 1024 * 1024; // Read in chunks (e.g., 1 MB)
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
  
        reader.onerror = () => resolve(false); // Return false if the file cannot be read
  
        reader.readAsText(blob);
      }
  
      try {
        readChunk();
      } catch (error) {
        resolve(false); // Handle any unexpected errors gracefully
      }
    });
  }

  function processHashes(hashEntries, line, selectedHashType, taskId) {
    for (let i = 0; i < hashEntries.length; i++) {
      const hash = hashEntries[i];
      if (hashcat.verifyHash(line, hash, selectedHashType) === true) {
        console.log(line);
        postMessage({  
          id:taskId,        
          type: "found",
          hash: hash,
          password: line
        });
        hashEntries.splice(i, 1);
        i--;
      }
    }
  }