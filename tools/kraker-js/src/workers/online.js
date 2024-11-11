import hashcat from 'crack-js';
self.onmessage = async  (event) => {
    if (event.data.action === 'start') {
        console.log("START");

            //a3dcb4d229de6fde0db5686dee47145d

            postMessage({ type:"log", message: "useRules:"+event.data.useRules});
            postMessage({ type:"log", message: "ruleUrl:"+event.data.ruleUrl});
            postMessage({ type:"log", message: "wordlistUrl:"+event.data.wordlistUrl});
            postMessage({ type:"log", message: "hashEntries:"+event.data.hashEntries});
            postMessage({ type:"log", message: "selectedHashType:"+event.data.selectedHashType});

          const selectedHashType=event.data.selectedHashType;
          const useRules=event.data.useRules;
          const ruleUrl=event.data.ruleUrl;
          const wordlistUrl=event.data.wordlistUrl;
          const hashEntries=event.data.hashEntries;

          







            if(!hashcat.availableHashTypes.includes(selectedHashType))
            {
              postMessage({ type:"log", message: 'Undefined hashtype - ('+selectedHashType+')' });
              postMessage({ type:"status", status: "done"});
              return;
            }

            if (!Array.isArray(hashEntries) || hashEntries.length == 0) {
              postMessage({ type:"log", message: 'Hash entries is empty  - ('+hashEntries+')' });
              postMessage({ type:"status", status: "done"});
              return;
            } 


            console.log(event.data);
            const content = await downloadFile(wordlistUrl);

            if (!content) {
              console.log("Failed to donwload");
              postMessage({ status: 'error', message: 'Failed to download the file' });
              return;
            }
            console.log("OOOOK");
            let lines = content.split('\n');
            for (const line of lines) {
              console.log(line);
              return;
              for (let i = 0; i < hashEntries.length; i++) {
                const hash = hashEntries[i];
                    console.log(hash);
                if (hashcat.verifyHash(line, hash, selectedHashType) === true) {
                  postMessage({ type:"found", hash: hash,password:line,type:selectedHashType});
                  console.log(line);
                  hashEntries.splice(i, 1);
                  i--;
                }
              }
              if(hashEntries.length==0)break;
            }
            lines=null;
            postMessage({ type:"status", status: "done"});
            
    }
  };







  async function downloadFile(fileUrl) {
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) return false;
      return await response.text();
    } catch (error) {
      return false;
    }
  }