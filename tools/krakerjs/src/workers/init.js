import hashcat from 'crack-js';
console.log(hashcat.availableHashTypes);
self.onmessage = (event) => {
    if (event.data.action === 'start') {

          const duration = 10000;

          postMessage({ status: "done"});
          
    }
  };