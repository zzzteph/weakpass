# Weakpass

<p align="center">
  <img src="https://github.com/zzzteph/weakpass/blob/main/cracker.png?raw=true" height="250">
</p>

Password &amp; hash cracking tools from [weakpass.com](https://weakpass.com/) — everything in one place, **100% client-side**.

## ➡️ [tools.weakpass.com](https://tools.weakpass.com/)

One app, every tool as a tab. No server, nothing uploaded — it all runs in your browser.

### 📂 Structure

- **tools/weakpass-tools** — the app (Vue 3 + Vite + the [crack-js](https://github.com/zzzteph/crack-js) engine), deployed to [tools.weakpass.com](https://tools.weakpass.com/):
  - [wordlist generator](https://tools.weakpass.com/#passgen) · [password check](https://tools.weakpass.com/#passcheck) · [range hash lookup](https://tools.weakpass.com/#lookup)
  - [identify](https://tools.weakpass.com/#identify) · [generate](https://tools.weakpass.com/#generate) · [benchmark](https://tools.weakpass.com/#benchmark) · [crack](https://tools.weakpass.com/#crack) · [extract](https://tools.weakpass.com/#extract)
- **rules** — archive of hashcat cracking rules for advanced attacks.
- **weakpass.py** — CLI to look up hashes against the weakpass API.

---

## 🚀 Tools

### Passgen — wordlist generator · [open →](https://tools.weakpass.com/#passgen)

Generate a targeted wordlist from your keywords using [hashcat rules](https://hashcat.net/wiki/doku.php?id=rule_based_attack). During a pentest a password is often a device/network/organisation name plus a year or special character (e.g. **Evilcorp2019**) — Passgen builds those candidates so you can try them before a long wordlist attack.

### Passcheck — has your password been compromised? · [open →](https://tools.weakpass.com/#passcheck)

Checks whether your password is in the **weakpass_4.merged** wordlist (via a range lookup — only a hash prefix leaves your browser) **and** simulates rule-based attacks by applying "reverse" hashcat rules to see if a common rule could reach it.

### Lookup — range hash lookup · [open →](https://tools.weakpass.com/#lookup)

Reveal the password behind an MD5 / NTLM / SHA1 / SHA256 hash using the precomputed wordlist — all client-side, only a 6-char prefix is sent. You can self-host the range API against a [precomputed table](https://weakpass.com/pre-computed).

### Crack toolkit — identify · generate · benchmark · crack · extract

Powered by [crack-js](https://github.com/zzzteph/crack-js) (330 hash modes): [identify](https://tools.weakpass.com/#identify) an unknown hash, [generate](https://tools.weakpass.com/#generate) a hash from a password, [benchmark](https://tools.weakpass.com/#benchmark) hashes/sec per mode, run an in-browser [dictionary + rules crack](https://tools.weakpass.com/#crack), or [extract](https://tools.weakpass.com/#extract) a hashcat hash from an encrypted zip/7z/office/rar or Wi-Fi capture.

---

Built with [crack-js](https://github.com/zzzteph/crack-js), [hashcat-rules-js](https://github.com/zzzteph/hashcat-rules-js) and [hashcat-reverse-rules-js](https://github.com/zzzteph/hashcat-reverse-rules-js).
