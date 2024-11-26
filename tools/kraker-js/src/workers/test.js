
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

self.onmessage = async  (event) => {
    if (event.data.action === 'start') {
        console.log("START");
        const id = event.data.id;
        let i=0;
        for(i=0;i<100;i++)
        {
            console.log(id+"  "+i);
            postMessage({ type: "status", status: "running", id:id, progress:i });
            await sleep(1000);
        }

    }
  };

