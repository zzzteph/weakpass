import { calculateHash, verifyHash,availableHashTypes } from './dist/cracker-lib.js';

console.log(availableHashTypes);

//    console.log(calculateHash("hashcat", 'sha256crypt'));

//console.log(calculateHash("hashcat", 'md5crypt'));

console.log(calculateHash("hashcat", 'sha512crypt'));
console.log(calculateHash("hashcat", 'ntlm'));
console.log(calculateHash("hashcat", 'md5'));
console.log(calculateHash("hashcat", 'sha1'));
console.log(calculateHash("hashcat", 'bcrypt'));
   


console.log(verifyHash("hashcat","$6$52450745$k5ka2p8bFuSmoVT1tzOyyuaREkkKBcCNqoDKzYiJL9RaE8yMnPgh2XzzF0NDrUhgrcLwg78xs1w5pJiypEdFX/","sha512crypt"));
console.log(verifyHash("hashcat","$5$rounds=5000$GX7BopJZJxPc/KEK$le16UF8I2Anb.rOrn22AUPWvzUETDGefUmAV8AZkGcD","sha256crypt"));
console.log(verifyHash("hashcat","b4b9b02e6f09a9bd760f388b67351e2b","ntlm"));
console.log(verifyHash("hashcat","8743b52063cd84097a65d1633f5c74f5","md5"));
console.log(verifyHash("hashcat","b89eaac7e61417341b710b727768294d0e6a277b","sha1"));
console.log(verifyHash("hashcat","$2a$05$LhayLxezLhK1LhWvKxCyLOj0j1u.Kj0jZ0pEmm134uzrQlFvQJLF6","bcrypt"));
