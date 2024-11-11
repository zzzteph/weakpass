import hashcat from 'crack-js';
self.onmessage = (event) => {
    if (event.data.action === 'start') {
        const testCases = [
            { type: "jwt", password: "hashcat", hash: "eyJhbGciOiJIUzI1NiJ9.eyIzNDM2MzQyMCI6NTc2ODc1NDd9.f1nXZ3V_Hrr6ee-AFCTLaHRnrkiKmio2t3JqwL32guY" },
            { type: "sha512crypt", password: "hashcat", hash: "$6$52450745$k5ka2p8bFuSmoVT1tzOyyuaREkkKBcCNqoDKzYiJL9RaE8yMnPgh2XzzF0NDrUhgrcLwg78xs1w5pJiypEdFX/" },
            { type: "sha256crypt", password: "hashcat", hash: "$5$rounds=5000$GX7BopJZJxPc/KEK$le16UF8I2Anb.rOrn22AUPWvzUETDGefUmAV8AZkGcD" },
            { type: "ntlm", password: "hashcat", hash: "b4b9b02e6f09a9bd760f388b67351e2b" },
            { type: "md5", password: "hashcat", hash: "8743b52063cd84097a65d1633f5c74f5" },
            { type: "sha1", password: "hashcat", hash: "b89eaac7e61417341b710b727768294d0e6a277b" },
            { type: "sha256", password: "hashcat", hash: "127e6fbfe24a750e72930c220a8e138275656b8e5d8f48a98c3c92df2caba935" },
            { type: "sha512", password: "hashcat", hash: "82a9dda829eb7f8ffe9fbe49e45d47d2dad9664fbb7adf72492e3c81ebd3e29134d9bc12212bf83c6840f10e8246b9db54a4859b7ccd0123d86e5872c1e5082f" },
            { type: "bcrypt", password: "hashcat", hash: "$2a$05$LhayLxezLhK1LhWvKxCyLOj0j1u.Kj0jZ0pEmm134uzrQlFvQJLF6" },
            { type: "netntlmv2", password: "hashcat", hash: "admin::N46iSNekpT:08ca45b7d7ea58ee:88dcbe4446168966a153a0064958dac6:5c7830315c7830310000000000000b45c67103d07d7b95acd12ffa11230e0000000052920b85f78d013c31cdb3b92f5d765c783030" },
            { type: "hmac-md5", password: "hashcat", hash: "bfd280436f45fa38eaacac3b00518f29:1234" },
            { type: "hmac-sha1", password: "hashcat", hash: "d89c92b4400b15c39e462a8caa939ab40c3aeeea:1234" },
            { type: "hmac-sha256", password: "hashcat", hash: "8efbef4cec28f228fa948daaf4893ac3638fbae81358ff9020be1d7a9a509fc6:1234" },
            { type: "hmac-sha512", password: "hashcat", hash: "7cce966f5503e292a51381f238d071971ad5442488f340f98e379b3aeae2f33778e3e732fcc2f7bdc04f3d460eebf6f8cb77da32df25500c09160dd3bf7d2a6b:1234" },
            { type: "mysql323", password: "hashcat", hash: "7196759210defdc0" },
          ];

          const duration = 10000;
          for (const { type, password, hash } of testCases) {
            const startTime = Date.now();
            let count = 0;
            while (Date.now() - startTime < duration) {
              hashcat.verifyHash(password, hash, type);
              count++;
            }
            postMessage({ hashtype: type, speed:Math.floor( count / (duration / 1000))  });
          }
          postMessage({ status: "done"});
          
    }
  };