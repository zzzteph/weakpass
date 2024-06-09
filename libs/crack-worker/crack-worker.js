onmessage = function(e) {


        var action = e.data[0];
        if (e.data[0] == "benchmark") {
            var speedstats = [];
            speedstats.push({
                'type': 'md5',
                'id': 0,
                'speed': measure_speed_m0()
            });
            speedstats.push({
                'type': 'sha1',
                'id': 100,
                'speed': measure_speed_m100()
            });
            speedstats.push({
                'type': 'sha256',
                'id': 1400,
                'speed': measure_speed_m1400()
            });
            speedstats.push({
                'type': 'sha512',
                'id': 1700,
                'speed': measure_speed_m1700()
            });
            speedstats.push({
                'type': 'ntlm',
                'id': 1000,
                'speed': measure_speed_m1000()
            });
            speedstats.push({
                'type': 'md5crypt',
                'id': 500,
                'speed': measure_speed_m500()
            });
            speedstats.push({
                'type': 'sha512crypt',
                'id': 1800,
                'speed': measure_speed_m1800()
            });
            speedstats.push({
                'type': 'sha256crypt',
                'id': 7400,
                'speed': measure_speed_m7400()
            });
        speedstats.push({
                'type': 'jwt',
                'id': 16500,
                'speed': measure_speed_m16500()
            });
            postMessage(speedstats);
            return;
        }
    
        if (e.data[0] == "magic") {
            var hashes = e.data[1];
            var hashesData = hashes.split(/[\s,]+/).filter((v, i, a) => a.indexOf(v) === i).filter(function(e) {
                return e === 0 || e
            });
    
    
    
            var types = [0, 100, 1400, 1700, 2600, 3500, 1000, 10, 500, 1800, 7400,16500];
    
    
    
            for (let type of types) {
                let hashDictionary = new Map();
                for (let hash of hashesData) {
                    if (validate_hash(String(hash), type) == true) {
    
                        if (type == 0 || type == 100 || type == 1400 || type == 1700 || type == 2600 || type == 3500) {
                            hashDictionary.set(String(hash).toLowerCase(), false);
                        } else if (type == 1000) {
                            hashDictionary.set(String(hash).toUpperCase(), false);
                        } else {
                            hashDictionary.set(String(hash), false);
                        }
                    }
                }
                switch (type) {
                    case 0:
                        crack_unsalted(hashDictionary, wordlist_big, rules_list, type);
                        break;
                    case 100:
                        crack_unsalted(hashDictionary, wordlist_big, rules_list, type);
                        break;
                    case 1400:
                        crack_unsalted(hashDictionary, wordlist_big, rules_list, type);
                        break;
                    case 1700:
                        crack_unsalted(hashDictionary, wordlist_big, rules_list, type);
                        break;
                    case 2600:
                        crack_unsalted(hashDictionary, wordlist_big, rules_list, type);
                        break;
                    case 3500:
                        crack_unsalted(hashDictionary, wordlist_big, rules_list, type);
                        break;
                    case 1000:
                        crack_unsalted(hashDictionary, wordlist_big, rules_list, type);
                        break;
                    case 10:
                        crack_salted(hashDictionary, wordlist_big, rules_list, type);
                        break;
                    case 500:
                        crack_salted(hashDictionary, wordlist_small, [], type);
                        break;
                    case 1800:
                        crack_salted(hashDictionary, wordlist_small, [], type);
                        break;
                    case 7400:
                        crack_salted(hashDictionary, wordlist_small, [], type);
                        break;
                     case 16500:
                        crack_salted(hashDictionary, wordlist_big, rules_list, type);
                        break;
    
                }
    
    
    
    
            }
    
            postMessage({
                'status': "finish"
            });
    
    
        }
    
        if (e.data[0] == "custom" && parseInt(e.data[2]) != 9999) {
            var hashes = e.data[1];
            var type = parseInt(e.data[2]);
            var passwords = e.data[3];
            var rules = e.data[4];
            var use_rules = e.data[5];
            var hashesData = hashes.split(/[\s,]+/).filter((v, i, a) => a.indexOf(v) === i).filter(function(e) {
                return e === 0 || e
            });
    
            let hashDictionary = new Map();
            for (let hash of hashesData) {
                if (validate_hash(String(hash), type) == true) {
                    console.log(hash);
                    if (type == 0 || type == 100 || type == 1400 || type == 1700 || type == 2600 || type == 3500) {
                        hashDictionary.set(String(hash).toLowerCase(), false);
                    } else if (type == 1000) {
                        hashDictionary.set(String(hash).toUpperCase(), false);
                    } else {
                        hashDictionary.set(String(hash), false);
                    }
    
                }
            }
            var passwordsData = passwords.split("\n");
            var rulesData = [];
            if (use_rules == true)
                rulesData = rules.split("\n");
    
    
            if (type == 0 || type == 100 || type == 1400 || type == 1700 || type == 2600 || type == 3500 || type == 1000) {
                crack_unsalted(hashDictionary, passwordsData, rulesData, type);
            } else if (type == 10 || type == 500 || type == 1800 || type == 7400 || type ==16500) {
                crack_salted(hashDictionary, passwordsData, rulesData, type);
            }
    
            postMessage({
                'status': "finish"
            });
        }
    
    
    
        if (e.data[0] == "custom" && parseInt(e.data[2]) == 9999) {
            var hashes = e.data[1];
            var passwords = e.data[3];
            var rules = e.data[4];
            var use_rules = e.data[5];
            var hashesData = hashes.split(/[\s,]+/).filter((v, i, a) => a.indexOf(v) === i).filter(function(e) {
                return e === 0 || e
            });
            var types = [0, 100, 1400, 1700, 2600, 3500, 1000, 10, 500, 1800, 7400,16500];
            var passwordsData = passwords.split("\n");
            var rulesData = [];
            if (use_rules == true)
                rulesData = rules.split("\n");
    
    
    
            for (let type of types) {
                let hashDictionary = new Map();
                for (let hash of hashesData) {
                    if (validate_hash(String(hash), type) == true) {
    
                        if (type == 0 || type == 100 || type == 1400 || type == 1700 || type == 2600 || type == 3500) {
                            hashDictionary.set(String(hash).toLowerCase(), false);
                        } else if (type == 1000) {
                            hashDictionary.set(String(hash).toUpperCase(), false);
                        } else {
                            hashDictionary.set(String(hash), false);
                        }
                    }
                }
                if (type == 0 || type == 100 || type == 1400 || type == 1700 || type == 2600 || type == 3500 || type == 1000) {
                    crack_unsalted(hashDictionary, passwordsData, rulesData, type);
                } else if (type == 10 || type == 500 || type == 1800 || type == 7400 || type==16500) {
                    crack_salted(hashDictionary, passwordsData, rulesData, type);
                }
            }
    
            postMessage({
                'status': "finish"
            });
    
    
    
    
        }
    
    
    
        return;
    
    
    
    
    }