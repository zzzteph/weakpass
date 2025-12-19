#!/usr/bin/env python
import sys
import argparse
import os
import re
import time
import json
import socket
from urllib.request import urlopen, Request
from urllib.error import  HTTPError
from dataclasses import dataclass
SEARCH_API = "https://weakpass.com/api/v1/search/{}.json"


@dataclass
class HashResponse:
    type: str
    hash: str
    value: str
    def __str__(self):
        return f"{self.type}:{self.hash}:{self.value}"

def parse_args():
    parser = argparse.ArgumentParser(description="Universal script for hash search/lookup")
    parser.add_argument("value", nargs="?", help="Hash or string if file is not provided")
    return parser.parse_args()





def fetch_search(input, retries=3, timeout=10):
    url = SEARCH_API.format(input)
    attempt = 0
    while attempt < retries:
        attempt += 1
        try:
            req = Request(url)
            with urlopen(req, timeout=timeout) as resp:
                raw = resp.read().decode()
                data = json.loads(raw)
                return HashResponse(
                    type=data.get("type", ""),
                    hash=data.get("hash", ""),
                    value=data.get("pass")
                )
        except HTTPError as e:
            return None
        except (socket.timeout, socket.error) as net_err:
            if attempt >= retries:
                return None
            time.sleep(1)
            continue
        except Exception:
            print("Exception")
            if attempt >= retries:
                return None
            time.sleep(1)
            continue
    return None


def append_to_pot(hashrspn:HashResponse, filename: str = "weakpass.pot"):
    try:
        with open(filename, "a", encoding="utf-8") as f:
            f.write(str(hashrspn) + "\n")
            f.flush()
            os.fsync(f.fileno())
        return True
    except Exception as e:
        print(f"Write error: {e}")
        return False






def detect_hash_type(hashstring):
    if not re.match(r'^[0-9A-Fa-f]+$', hashstring):
        return None

    length = len(hashstring)

    if length == 32:
         return "NTLMD5"
    elif length == 40:
        return "SHA1"
    elif length == 64:
        return "SHA256"
    elif length == 128:
        return "SHA512"
    else:
        return None

def process_string(hashstring):
    hashstring = hashstring.strip().lower()
    if detect_hash_type(hashstring) == None:
        sys.exit(1)
    result=fetch_search(hashstring)
    if result is not None:
        print(result)
        append_to_pot(result)



def process_file(filename):
    with open(filename, "r", encoding="utf-8") as f:
        total = sum(1 for _ in f)

    bar_length = 30
    processed = 0
    with open(filename, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            processed += 1
            if not line:
                continue
            else:
                if detect_hash_type(line.lower()) is not None:
                    result=fetch_search(line.lower())
                    if result is not None:
                        print(result)
                        append_to_pot(result)
            filled = int(bar_length * processed / total)
            bar = "█" * filled + "-" * (bar_length - filled)
            percent = (processed / total) * 100
            sys.stdout.write(f"\r[{bar}] {percent:5.1f}% ({processed}/{total})")
            sys.stdout.flush()
    print("Done!")




def main():
    args = parse_args()
    if not args.value:
        print("Error: requires file with hashes or hashstring")
        sys.exit(1)
    if not os.path.exists(args.value):   
        process_string(args.value) 
    else:
        process_file(args.value)         
            
if __name__ == "__main__":
    main()