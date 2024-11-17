# Passcheck - Range Hash Lookup Tool

Discover if your password is in the weakpass_4 wordlist or vulnerable to advanced rule-based attacks.

**Tool Link:** [https://weakpass.com/tools/passcheck](https://weakpass.com/tools/passcheck)

This tool checks if your password exists in the **weakpass_4.merged** wordlist using a range lookup API. 

**But what if someone decided to use rule-based attack? Is your password safe for rule-based attacks?**
Beyond that, it simulates rule-based attacks by applying "reverse" hashcat rules to identify potential candidates that could crack your password.

## Key Features
- **Wordlist Check** - Verifies if your password is found in the weakpass_4.merged wordlist.
- **Rule-Based Attack Simulation** - Generates candidates and tests if your password is vulnerable to rule-based cracking techniques.


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















