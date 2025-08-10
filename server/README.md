# Weakpass – Sample API Server

<p align="center">
  <img src="https://github.com/zzzteph/weakpass/blob/readme/cracker.png?raw=true" height="250">
</p>

This is an example server and build scripts for the Weakpass API.

## Build & Run

```bash
docker build . -t weakpass_api
docker run -p 8000:8000 weakpass_api
```

Navigate to:

- API root: [http://127.0.0.1/](http://127.0.0.1/)
- Swagger docs: [http://127.0.0.1/api/](http://127.0.0.1/api/)
- Example API test: [http://127.0.0.1/api/v1/range/0000009?type=md5](http://127.0.0.1/api/v1/range/0000009?type=md5)

## Scripts

In the `/app/Console` folder, you can find scripts to build your own database or filter wordlists.

### Filter Wordlist

```bash
php artisan app:filter-wordlist {input-file} {output-file} {--sort}
```

Removes junk data from a wordlist.

**Arguments:**
- `input-file` – path to the wordlist you want to filter
- `output-file` – path where the filtered list will be saved
- `--sort` – optional flag to sort the results alphabetically

### Examples

```bash
cd /weakpass/
php artisan app:filter-wordlist /download/rockyou.txt /download/rockyou.txt.filtered
```
Creates `/download/rockyou.txt.filtered` with junk data removed.

```bash
cd /weakpass/
php artisan app:filter-wordlist /download/rockyou.txt /download/rockyou.txt.filtered --sort
```
Creates `/download/rockyou.txt.filtered` with junk data removed **and** sorted alphabetically.
