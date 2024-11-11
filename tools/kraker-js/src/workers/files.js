import hashcat from 'crack-js';
self.onmessage = async  (event) => {
    if (event.data.action === 'start') {
        console.log("START");

            const wordlistFile = event.data.wordlistFile;
            const useRules = event.data.useRules;
            const rulesFile = event.data.wordlistFile;

            let countLines=0;
            postMessage({ type:"log", message: "wordlistFile:"+wordlistFile.name});


              readChunk(wordlistFile,0,'');
        console.log(countLines);


            postMessage({ type:"status", status: "done"});
            
    }
  };

  function readChunk(wordlistFile,offset, remainder) {
    const chunkSize=64 * 1024;
    console.log(wordlistFile.size);
    console.log(wordlistFile.name);
    if (offset >= wordlistFile.size) {
      self.close();
      return;
    }

    const blob = wordlistFile.slice(offset, offset + chunkSize);
    const reader = new FileReader();

    reader.onload = (event) => {
      const text = remainder + event.target.result;
      const lines = text.split('\n');
      remainder = lines.pop();
        
      lines.forEach((line) => {
        console.log(line);
      });

      offset += chunkSize;
      readChunk(wordlistFile,offset, remainder); 
    };

    reader.readAsText(blob);
  }