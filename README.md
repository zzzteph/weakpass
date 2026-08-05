# weakpass

<p align="center">
  <img src="https://github.com/zzzteph/weakpass/blob/main/cracker.png?raw=true" height="220">
</p>

Client-side password and hash cracking tools from [weakpass.com](https://weakpass.com).
Everything runs in the browser, nothing is uploaded.

Live at https://tools.weakpass.com

## Tools

It is one app, each tool is a tab. Open one directly at `tools.weakpass.com/#<name>`.

- `passgen`: wordlist generator using hashcat rules
- `passcheck`: check if a password is in the wordlist or crackable by common rules
- `lookup`: reveal the password for an MD5, NTLM, SHA1 or SHA256 hash (range API, only a prefix is sent)
- `identify`: identify a hash type
- `generate`: turn a password into a hash, 330 modes
- `benchmark`: hashes per second per mode
- `crack`: dictionary, rules, bruteforce and saved workflows
- `workflows`: preconfigure a chained attack for the crack tab
- `extract`: pull a hashcat hash out of a zip, 7z, office, rar or Wi-Fi capture

## Also in this repo

- `rules/`: hashcat rule sets
- `weakpass.py`: command line hash lookup against the weakpass API

Built on [crack-js](https://github.com/zzzteph/crack-js), [hashcat-rules-js](https://github.com/zzzteph/hashcat-rules-js) and [hashcat-reverse-rules-js](https://github.com/zzzteph/hashcat-reverse-rules-js).
