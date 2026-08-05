# Lookup - Range Hash lookup Tool

Perform secure password hash lookups using the Range API without submitting sensitive data to the server.

**Try it online:** [Lookup](https://tools.weakpass.com/tools/lookup/dist/)


<p align="center">
  <img src="https://github.com/zzzteph/weakpass/blob/main/tools/lookup/lookup.PNG?raw=true"  height="250">
</p>



Reveal passwords for MD5, NTLM, SHA1, or SHA256 hashes using the precomputed wordlist without sending your hash to the backend. The primary advantage is that all hash checks are done client-side, ensuring that your data remains secure and private.

Additionally, you can host and build the database for this tool locally and in-house. To do so, use one of the precomputed tables available [here](https://weakpass.com/pre-computed) and set up an API to serve hash ranges by value.


## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```













