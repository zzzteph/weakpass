import hashcat from 'crack-js';
import hashcatRule from 'hashcat-rules-js';
self.onmessage = async  (event) => {
    if (event.data.action === 'start') {
        console.log("START");

            const wordlistFile = event.data.wordlistFile;
            const useRules = event.data.useRules;
            const rulesFile = event.data.rulesFile;
            const selectedHashType=event.data.selectedHashType;
            let hashEntries=event.data.hashEntries;

            if(!hashcat.availableHashTypes.includes(selectedHashType))
            {
                postMessage({ type:"log", message: 'Undefined hashtype - ('+selectedHashType+')' });
                postMessage({ type:"status", status: "done"});
                self.close();
                return;
            }
  
            if (!Array.isArray(hashEntries) || hashEntries.length == 0) {
                postMessage({ type:"log", message: 'Hash entries is empty  - ('+hashEntries+')' });
                postMessage({ type:"status", status: "done"});
                self.close();
                return;
            } 
  
            








            const chunkSize=64 * 1024;
            let countLines=0;
            postMessage({ type:"log", message: "wordlistFile to use:"+wordlistFile.name});

            let offset = 0;
            let remainder = '';
          
            let fileContent =false;
            if(useRules) fileContent=await loadRules(rulesFile);

            let reader = new FileReader();
            while (offset < wordlistFile.size) {
              let blob = wordlistFile.slice(offset, offset + chunkSize);
              
                const readPromise = new Promise((resolve) => {
                reader.onload = (event) => {
                  const text = remainder + event.target.result;
                  const lines = text.split('\n');
                  remainder = lines.pop();
                  
                  lines.forEach((line) => {
                    console.log(line);
                    if(useRules)
                  {
                    
                    for (const rule of fileContent) {
                      let modifiedLine=hashcatRule.applyRule(line.trim(),rule);
                      processHashes(hashEntries,modifiedLine,selectedHashType)
                    }
                  }
                  else
                  {
                    processHashes(hashEntries,line.trim(),selectedHashType)
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

            console.log(countLines);
      

            postMessage({ type:"status", status: "done"});
            
    }
  };

  function loadRules(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = (event) => {
        const content = event.target.result;
        const lines = content.split('\n').map(line => line.trim()).filter(line => line !== '');//trim and skip empty lines
        const uniqueLines = Array.from(new Set(lines));
        resolve(uniqueLines); // return only uniq rules
      };
  
      reader.onerror = (error) => {
        reject(error);
      };
  
      reader.readAsText(file);
    });
  }
  function processHashes(hashEntries, line, selectedHashType) {
    for (let i = 0; i < hashEntries.length; i++) {
      const hash = hashEntries[i];
      console.log(hash);
      console.log(line);
      console.log(selectedHashType);
      console.log(hashcat.verifyHash(line, hash, selectedHashType));
      if (hashcat.verifyHash(line, hash, selectedHashType) === true) {
        postMessage({
          type: "found",
          hash: hash,
          password: line,
          type: selectedHashType
        });
        console.log(line);
        hashEntries.splice(i, 1);
        i--;
      }
    }
  }