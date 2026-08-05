# Weakpass

<p align="center">
  <img src="https://github.com/zzzteph/weakpass/blob/readme/cracker.png?raw=true"  height="250">
</p>

Here, you can find the list of tools and example of API server from [weakpass.com](https://weakpass.com/) for password and hash cracking in one place.

### 📂 Folder Structure


- **tools**
  - A collection of password and hash cracking tools. **Check them out:**
    - ⭐ **[weakpass tools](https://tools.weakpass.com/tools/weakpass-tools/dist/) — all tools in one place** (wordlist generator · password check · lookup · identify · generate · benchmark · crack · extract)
    - [Lookup](https://tools.weakpass.com/tools/lookup/dist/)
    - [Passcheck](https://tools.weakpass.com/tools/passcheck/dist/)
    - [Passgen](https://tools.weakpass.com/tools/passgen/dist/)

- **libs**
  - Links to the libraries used in this project.

- **rules**
  - Archive of cracking rules for advanced attacks.

---


All of the tools and libraries you can find in separate folders, a quick overview of the tools if you want to try them right now

## 🚀 Tools Overview

### Passgen - passwords generator

Generate a wordlist based on user-provided keywords for targeted password testing.

**Try it online:** [Passgen](https://tools.weakpass.com/tools/passgen/dist/)

<p align="center">
  <img src="https://github.com/zzzteph/weakpass/blob/main/tools/passgen/sample.png?raw=true"  height="250">
</p>


For example, during penetration testing, you need to gain access to some service, device, account, or Wi-Fi network that is password protected. For example, let it be the _Wi-Fi_ network of **EvilCorp**. Sometimes, a password is a combination of _device/network/organization_ name with some date, special character, etc. Therefore, it is simpler and easier to test some combinations before launching more complex and time-consuming checks. For example, cracking a _Wi-Fi_ password with a wordlist can take several hours and can fail, even if you choose a [great wordlist](https://weakpass.com/wordlist/1950) because there was no such password in it like **Evilcorp2019**. 

---

### Lookup - Range Hash Lookup Tool

Perform secure hash lookups without submitting sensitive data to a server using the Range API.

**Try it online:** [Lookup](https://tools.weakpass.com/tools/lookup/dist/)


<p align="center">
  <img src="https://github.com/zzzteph/weakpass/blob/main/tools/lookup/lookup.PNG?raw=true"  height="250">
</p>

Reveal passwords for MD5, NTLM, SHA1, or SHA256 hashes using the precomputed wordlist without sending your hash to the backend. The primary advantage is that all hash checks are done client-side, ensuring that your data remains secure and private.

Additionally, you can host and build the database for this tool locally and in-house. To do so, use one of the precomputed tables available [here](https://weakpass.com/pre-computed) and set up an API to serve hash ranges by value.


---

### Passcheck - Has your password been compromised?

Determine if your password **has been compromised** or is vulnerable to rule-based attacks.

Online: [Passcheck](https://tools.weakpass.com/tools/passcheck/dist/)

<p align="center">
  <img src="https://github.com/zzzteph/weakpass/blob/main/tools/passcheck/passcheck.PNG?raw=true"  height="250">
</p>


This tool checks if your password exists in the precomputed wordlist using a range lookup API. 

**But what if someone decided to use a rule-based attack? Is your password safe for rule-based attacks?**
Beyond that, it simulates rule-based attacks by applying "reverse" hashcat rules to identify potential candidates that could be used with the rules to crack your password.

## Key Features
- **Wordlist check** - Verifies if your password is found in the weakpass_4.merged wordlist.
- **Rule-Based attack simulation** - Generates candidates and tests if your password is vulnerable to rule-based cracking techniques.

---

The client-side hash cracker (formerly the standalone **Kraker-JS**) now lives as the **Crack** and **Benchmark** tabs inside the [weakpass tools](https://tools.weakpass.com/tools/weakpass-tools/dist/).








