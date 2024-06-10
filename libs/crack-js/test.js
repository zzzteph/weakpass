import { calculateHash, verifyHash,availableHashTypes } from './dist/crack.js';

console.log(availableHashTypes);
console.log(calculateHash("hashcat", 'sha512crypt'));
console.log(calculateHash("hashcat", 'ntlm'));
console.log(calculateHash("hashcat", 'md5'));
console.log(calculateHash("hashcat", 'sha1'));
console.log(calculateHash("hashcat", 'bcrypt'));
console.log(verifyHash("hashcat","eyJhbGciOiJIUzI1NiJ9.eyIzNDM2MzQyMCI6NTc2ODc1NDd9.f1nXZ3V_Hrr6ee-AFCTLaHRnrkiKmio2t3JqwL32guY","jwt"))
console.log(verifyHash("hashcat","$6$52450745$k5ka2p8bFuSmoVT1tzOyyuaREkkKBcCNqoDKzYiJL9RaE8yMnPgh2XzzF0NDrUhgrcLwg78xs1w5pJiypEdFX/","sha512crypt"));
console.log(verifyHash("hashcat","$5$rounds=5000$GX7BopJZJxPc/KEK$le16UF8I2Anb.rOrn22AUPWvzUETDGefUmAV8AZkGcD","sha256crypt"));
console.log(verifyHash("hashcat","b4b9b02e6f09a9bd760f388b67351e2b","ntlm"));
console.log(verifyHash("hashcat","8743b52063cd84097a65d1633f5c74f5","md5"));
console.log(verifyHash("hashcat","b89eaac7e61417341b710b727768294d0e6a277b","sha1"));
console.log(verifyHash("hashcat","127e6fbfe24a750e72930c220a8e138275656b8e5d8f48a98c3c92df2caba935","sha256"));
console.log(verifyHash("hashcat","82a9dda829eb7f8ffe9fbe49e45d47d2dad9664fbb7adf72492e3c81ebd3e29134d9bc12212bf83c6840f10e8246b9db54a4859b7ccd0123d86e5872c1e5082f","sha512"));
console.log(verifyHash("hashcat","$2a$05$LhayLxezLhK1LhWvKxCyLOj0j1u.Kj0jZ0pEmm134uzrQlFvQJLF6","bcrypt"));
console.log(verifyHash("hashcat","admin::N46iSNekpT:08ca45b7d7ea58ee:88dcbe4446168966a153a0064958dac6:5c7830315c7830310000000000000b45c67103d07d7b95acd12ffa11230e0000000052920b85f78d013c31cdb3b92f5d765c783030","netntlmv2"));