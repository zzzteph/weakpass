import hashcat from 'crack-js';
self.onmessage = async  (event) => {
    if (event.data.action === 'start') {
        console.log("START");
            let fileUrl = event.data.wordlistUrl;
        
            const content = await downloadFile(fileUrl);

            if (!content) {
              // Send an error message back if the download failed
              postMessage({ status: 'error', message: 'Failed to download the file' });
              return; // Exit the function if download failed
            }
            
            let lines = content.split('\n');
            let i=0;
            // Step 3: Process each line (for example, send each line back to the main thread)
            for (const line of lines) {
              if((i++)%100000==0)console.log(i);
            }
            console.log("DONE");
            lines=null;
    }
  };







  async function downloadFile(fileUrl) {
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) return false; // Return false if the response is not OK
      
      // Return the entire content of the file as a single string
      return await response.text();
    } catch (error) {
      // Return false if there was a network or other fetch-related error
      return false;
    }
  }