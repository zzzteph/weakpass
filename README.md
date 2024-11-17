# Weakpass

Here you can find the list of tools from weakpass.com for password and hash cracking in one place.

Curious about the folder structure?

- **tools** - list of tools from weakpass.com for password and hash cracking in one place.
- online.rule
- TBA


# Passgen - passwords generator
- Link: https://zzzteph.github.io/weakpass/tools/passgen/dist/
- Secondary: https://weakpass.com/tools/passgen

<p align="center">
  <img src="https://github.com/zzzteph/weakpass/blob/main/tools/passgen/sample.png?raw=true"  height="350">
</p>

The tool generates a wordlist based on a set of words entered by the user.
For example, during penetration testing, you need to gain access to some service, device, account, or Wi-Fi network that is password protected. For example, let it be the _Wi-Fi_ network of **EvilCorp**. Sometimes, a password is a combination of _device/network/organization_ name with some date, special character, etc. Therefore, it is simpler and easier to test some combinations before launching more complex and time-consuming checks. For example, cracking a _Wi-Fi_ password with a wordlist can take several hours and can fail, even if you choose a [great wordlist](https://weakpass.com/wordlist/1950) because there was no such password in it like **Evilcorp2019**. 

Therefore, using the generated wordlist, it is possible to organize a targeted and effective online password check.


# Lookup - Range Hash lookup Tool

Perform secure password hash lookups using the Range API without submitting sensitive data to the server.

- https://zzzteph.github.io/weakpass/tools/lookup/dist/
- [https://weakpass.com/tools/lookup](https://weakpass.com/tools/lookup)

<p align="center">
  <img src="https://github.com/zzzteph/weakpass/blob/main/tools/lookup/lookup.PNG?raw=true"  height="350">
</p>


Reveal passwords for MD5, NTLM, SHA1, or SHA256 hashes using the precomputed `weakpass4.merged.txt` file without sending your hash to the backend. The primary advantage is that all hash checks are done client-side, ensuring that your data remains secure and private.

Additionally, you can host and build the database for this tool locally and in-house. To do so, use one of the precomputed tables available [here](https://weakpass.com/pre-computed) and set up an API to serve hash ranges by value.

A server example that "works" with this database structure can be found in the repository.




# Passcheck - Has your password been compromised?


Discover if your password is in the weakpass_4 wordlist or vulnerable to advanced rule-based attacks.

**Tool Link:** [https://weakpass.com/tools/passcheck](https://weakpass.com/tools/passcheck)

<p align="center">
  <img src="https://github.com/zzzteph/weakpass/blob/main/tools/passcheck/passcheck.PNG?raw=true"  height="350">
</p>


This tool checks if your password exists in the **weakpass_4.merged** wordlist using a range lookup API. 

**But what if someone decided to use rule-based attack? Is your password safe for rule-based attacks?**
Beyond that, it simulates rule-based attacks by applying "reverse" hashcat rules to identify potential candidates that could be used with the rules to crack your password.

## Key Features
- **Wordlist check** - Verifies if your password is found in the weakpass_4.merged wordlist.
- **Rule-Based attack simulation** - Generates candidates and tests if your password is vulnerable to rule-based cracking techniques.
