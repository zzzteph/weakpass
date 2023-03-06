importScripts('//cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js');


var wordlist_big = ["!QAZxsw2", "!root", "0123456789", "0392a0", "0987654321", "102030", "10203040", "112233", "121212", "123", "123123", "123123123", "12321", "123321", "1234", "12344321", "12345", "123456", "1234567", "12345678", "123456789", "1234567890", "1234abcd", "1234qwer", "123654", "123654789", "123abc", "123asd", "123asdf", "123qwe", "123qweASD", "123qweasd", "131313", "159357", "159753", "1q2w3e", "1q2w3e4r", "1qaz!QAZ", "1qaz2wsx", "1qaz@WSX", "1qazxsw2", "2000", "2003", "2008", "2009", "2010", "2011", "232323", "2read", "321321", "3edc$RFV", "4changes", "54321", "654321", "6969", "696969", "753951", "7654321", "789456", "789456123", "8675309", "87654321", "88888", "888888", "8888888", "88888888", "987654", "987654321", "99999", "999999", "9999999", "99999999", "999999999", "@dmin", "ANYCOM", "Admin", "Administrator", "Afghanistan", "Albania", "Algeria", "AmericanSamoa", "Andorra", "Angola", "Anguilla", "Antarctica", "Antigua", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia", "Botswana", "Brazil", "Brunei", "Bulgaria", "BurkinaFaso", "Burma", "Burundi", "C0de", "CISCO", "CR52401", "Cambodia", "Cameroon", "Canada", "CapeVerde", "Chad", "Chile", "China", "Cisco", "Colombia", "Comoros", "Congo", "CookIslands", "CostaRica", "Coted'Ivoire", "Croatia", "Cuba", "Cyprus", "CzechRepublic", "Denmark", "Djibouti", "Dominica", "Ecuador", "Egypt", "ElSalvador", "Eritrea", "Estonia", "Ethiopia", "FalklandIslands", "Fiji", "Finland", "France", "FrenchGuiana", "FrenchPolynesia", "Gabon", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Herzegovina", "Honduras", "HongKong", "Hungary", "IBM", "ILMI", "Iceland", "India", "Indonesia", "Intermec", "Internet", "Iran", "Iraq", "Ireland", "Israel", "Italy", "IvoryCoast", "Jamaica", "Japan", "Jordan", "KKKKKKK", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Login", "Luxembourg", "Macau", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "MarshallIslands", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Moldova", "Monaco", "Mongolia", "Montserrat", "Morocco", "Mozambique", "Namibia", "Nauru", "NeXT", "Nepal", "Netherlands", "NewCaledonia", "NewZealand", "Nicaragua", "Niger", "Nigeria", "NorthKorea", "Norway", "Oman", "P@55w0rd!", "P@ssw0rd", "P@ssw0rd!", "P@ssword!", "PRIVATE", "PUBLIC", "Pakistan", "Palau", "Panama", "PapuaNewGuinea", "Paraguay", "Password", "Password!", "Password1", "Password1!", "Password12", "Password2", "Peru", "Philippines", "PitcairnIslands", "Poland", "Portugal", "Private", "Public", "PuertoRico", "QNX", "QWErty123", "Qatar", "Qwer1234", "Qwerty1", "Qwerty12", "Qwerty123", "Qwerty12345", "ROOT500", "Reunion", "Romania", "Russia", "Rwanda", "SECRET", "SECURITY", "SNMP", "SNMP_trap", "SUN", "SWITCH", "SYSTEM", "SaintLucia", "Samoa", "SanMarino", "SaudiArabia", "Secret", "Security", "Senegal", "Seychelles", "SierraLeone", "Singapore", "Slovakia", "Slovenia", "SolomonIslands", "Somalia", "SouthAfrica", "SouthKorea", "Spain", "SqlServer", "Sqlserver", "SriLanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switch", "Switzerland", "Syria", "System", "TEST", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "TheGambia", "TheHolySee", "Togo", "Tonga", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "UnitedKingdom", "UnitedStates", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "WesternSahara", "Xadministartor", "Yemen", "Yugoslavia", "ZAQ!2wsx", "Zaire", "Zambia", "Zimbabwe", "a1b2c3", "aaaaa", "aaaaaa", "abc", "abc123", "abcd123", "abcd1234", "abcdef", "abgrtyu", "academia", "access", "access14", "account", "action", "adm", "admin", "admin1", "admin12", "admin123", "adminadmin", "administator", "administrator", "admins", "adobe1", "adobe123", "adobeadobe", "adrian", "adriana", "agent", "agent_steal", "air", "albert", "alberto", "alejandra", "alejandro", "alexander", "alexandra", "alexis", "all", "alpha", "alpine", "alyssa", "amanda", "amateur", "america", "andrea", "andres", "andrew", "angel", "angel1", "angela", "angelica", "angels", "animal", "anna", "anon", "anonymous", "anthony", "antonio", "anything", "aol123", "aolsuck", "aolsucks", "aolsuckz", "apc", "apollo", "apples", "apr", "arsenal", "arthur", "ascend", "asdasd", "asddsa", "asdf", "asdf123", "asdf1234", "asdfasdf", "asdfgh", "asdfghj", "asdfghjkl", "asdsa", "asdzxc", "ashley", "asshole", "attack", "august", "austin", "avg", "ax400", "azerty", "babygirl", "babygirl1", "babygurl", "backdoor", "backup", "backupexec", "badboy", "bagabu", "bailey", "banana", "bandit", "barbie", "barney", "baseball", "basketball", "batman", "beatriz", "beautiful", "beauty", "beaver", "beavis", "benjamin", "beta", "bigdaddy", "bigdog", "bin", "bintec", "bird", "birdie", "bisexual", "bitches", "biteme", "blablabla", "blahblah", "blazer", "blender", "blink182", "blonde", "blondes", "blue", "blue123", "blue22", "bluered", "bond007", "bonnie", "booboo", "booger", "boomer", "boss123", "boston", "brandon", "brandy", "braves", "brazil", "brightmail", "brittany", "bronco", "broncos", "bubbles", "bulldog", "burp", "business", "buster", "butter", "butterfly", "butthead", "cable-d", "calvin", "camaro", "cameron", "campus", "canada", "canon_admin", "captain", "carlos", "carolina", "caroline", "carter", "casper", "celtic", "change", "changelater", "changeme", "changethis", "charles", "charlie", "cheese", "chelsea", "cherry", "chester", "chicago", "chicken", "chocolate", "chris", "christian", "cisco", "claudia", "clinton", "clustadm", "cluster", "cms500", "cocacola", "codename", "codeword", "coffee", "college", "community", "company", "compaq", "complex", "complex1", "complex2", "complex3", "complexpassword", "computer", "controller", "cookie", "cooper", "corazon", "core", "corvette", "courtney", "cowboy", "cowboys", "creative", "crew", "cristina", "crystal", "cthdth", "customer", "cutie", "dakota", "dallas", "dancer", "daniel", "daniela", "danielle", "dasusr1", "database", "david", "davox", "db2admin", "db2fenc1", "db2inst1", "db2pass", "db2password", "db2pw", "dbps", "deathmetal", "debbie", "debug", "december", "default", "dell", "demo", "dennis", "desktop", "destiny", "dev", "dexter", "diablo", "diamond", "dilbert", "director", "dirt", "dmz", "doctor", "doggie", "dolphin", "dolphins", "domain", "domino", "donald", "dragon", "dreams", "dreamweaver", "driver", "eagle1", "eagles", "earth", "eduardo", "edward", "einstein", "elephant", "elite", "elizabeth", "eminem", "enable", "erotic", "estrella", "example", "exchadm", "exchange", "explorer", "extreme", "fagssuck", "falcon", "family", "fdsa", "fender", "fernando", "ferrari", "fibranne", "field", "files", "fire", "firebird", "fishing", "fivranne", "florida", "flower", "flvbybcnhfnjh", "flyers", "foobar", "foofoo", "football", "forever", "forum", "freddy", "freedom", "freekevin", "friend", "friends", "ftp", "fubar", "fuck", "fuckme", "fuckyou", "gabriel", "gabriela", "games", "gandalf", "garfield", "gateway", "gators", "gemini", "george", "gfhjkm", "giants", "ginger", "go", "goat", "god", "gold123", "golden", "golfer", "gordon", "greenday", "gregory", "guessme", "guest", "guitar", "gunner", "hammer", "hannah", "hardcore", "harley", "heather", "heaven", "hello", "hellokitty", "helpme", "hiphop", "hockey", "home123", "honey", "hooters", "horney", "horses", "hotdog", "hottie", "hp_admin", "hugs", "hunter", "hunting", "ibm", "iceman", "ihavenopass", "ilmi", "iloveme", "iloveu", "iloveyou", "iloveyou1", "iloveyou2", "install", "intermec", "internal", "internet", "intranet", "inuyasha", "iwantu", "jackie", "jackson", "jaguar", "james", "jasmine", "jasper", "jennifer", "jeremy", "jessica", "jessie", "jesus", "jesus1", "johnny", "johnson", "jonathan", "jordan", "jordan23", "joseph", "joshua", "jstwo", "jul", "jun", "junior", "justin", "killer", "kimberly", "kisses", "kissme", "klaster", "knight", "ladies", "lakers", "lauren", "leather", "legend", "lesbian", "letacla", "letitbe", "letmein", "little", "liverpool", "lkjhgf", "login", "london", "lotus", "louise", "love", "love123", "lovely", "loveme", "lovers", "loveyou", "macromedia", "maddog", "madison", "maggie", "magnum", "mahalkita", "mahalko", "mail", "manager", "manuel", "mar", "march2011", "maria", "mariana", "marine", "mariposa", "market", "marlboro", "martin", "marvin", "master", "matrix", "matrix123456", "matthew", "maverick", "maxwell", "melissa", "member", "mercedes", "merlin", "metallica", "michael", "michelle", "mickey", "microsoft", "midget", "midnight", "miguel", "miller", "mistress", "mnbvcxx", "mngt", "money", "monica", "monitor", "monkey", "monster", "morgan", "mother", "mountain", "mpegvideo", "muffin", "murphy", "mustang", "mylove", "mypass", "mypassword", "mypc123", "myspace", "naked", "naruto", "nascar", "natasha", "nathan", "naughty", "ncc1701", "netman", "network", "new", "newpass", "newyork", "nicholas", "nick", "nicole", "nimda", "nipple", "nipples", "nirvana", "nobody", "none", "nopass", "nopassword", "notes", "nothing", "nov", "november", "nsi", "number1", "oct", "october", "office", "oliver", "openview", "oracle", "orange", "owaspbwa", "owner", "packers", "pamela", "panther", "panties", "par0t", "parker", "pass", "pass1", "pass12", "pass123", "passport", "passw0rd", "passwd", "password", "password!", "password1", "password12", "password123", "password2", "passwordpassword", "patricia", "patrick", "peaches", "peanut", "pepper", "permit", "phantom", "phoenix", "photoshop", "pictures", "pixmet2003", "playboy", "player", "please", "poiuyt", "poiuytre", "pokemon", "poohbear", "pookie", "porsche", "powerapp", "ppmax2011", "pr1v4t3", "precious", "pretty", "prince", "princesa", "princess", "princess1", "print", "private", "proxy", "publ1c", "public", "purple", "pussies", "pussy", "pussyfuck", "pw123", "q1w2e3", "q1w2e3r4", "qa", "qaqaqa", "qazwsx", "qazwsxedc", "qqqqq", "querty", "qwaszx", "qwe123", "qweasd", "qweasdzxc", "qweewq", "qwer1234", "qwert", "qwerty", "qwerty1", "qwerty123", "qwerty12345", "qwertyui", "qwertyuiop", "qwewq", "rabbit", "racecar", "rachel", "racing", "raiders", "rain", "rainbow", "random", "ranger", "rangers", "read", "read-only", "read-write", "readwrite", "real", "rebecca", "rebelde", "red", "red123", "redblue", "redskins", "redsox", "redwings", "regional", "remote", "replicate", "resumix", "ricardo", "richard", "rmon", "rmon_admin", "ro", "robert", "roberto", "rocket", "ronaldo", "root", "root123", "rootme", "rootpass", "rootroot", "rosebud", "router", "ruler", "runner", "rush2112", "russia", "rw", "rwa", "sa", "sakura", "samantha", "sammy", "sample", "samson", "samsung", "samuel", "san-fran", "sandra", "sanfran", "sasa", "saturn", "sayang", "scooby", "scooter", "scorpio", "scorpion", "scotty", "seagate", "sebastian", "secret", "secuirty3", "secure", "security", "security1", "security3", "sep", "september", "seri", "server", "setup", "sexsex", "shadow", "shannon", "share", "shaved", "shit", "shorty", "sierra", "silver", "skippy", "slayer", "slipknot", "smokey", "snmp", "snmpd", "snmptrap", "snoopy", "snoopy1", "snow", "soccer", "softball", "solaris", "someday", "sophie", "spanky", "sparky", "spider", "spiderman", "spongebob", "sql", "sql2000", "sql2003", "sql2005", "sql2008", "sql2009", "sql2010", "sql2011", "sqlaccount", "sqlexec", "sqlpass", "sqlpass123", "sqlpassword", "sqlserver", "sqlserver2000", "sqlserver2005", "sqlsql", "sqlsvr", "squirt", "srinivas", "startrek", "starwars", "steelers", "stella", "stephanie", "steven", "sticky", "student", "stupid", "success", "summer", "sun", "sunshine", "super", "superman", "superuser", "supervisor", "surfer", "sweetie", "sweety", "swimming", "switch", "sydney", "sys", "sysadmin", "system", "t00lk1t", "taliban", "taylor", "teamo", "tech", "telnet", "temp", "temp!", "temp123", "temporary", "temptemp", "tennis", "tequiero", "teresa", "test", "test!", "test1", "test123", "test2", "tester", "testing", "testtest", "theman", "thomas", "thunder", "thx1138", "tiffany", "tigers", "tigger", "tini", "tinkerbell", "tiv0li", "tivoli", "tomcat", "toor", "topgun", "toyota", "trap", "travis", "trouble", "trust", "trustno1", "tslinux", "tucker", "turnkey", "turtle", "tweety", "twitter", "uClinux", "united", "unknown", "usa123", "user", "user1", "user2", "vagina", "vanessa", "veritas", "veronica", "vertex25", "victor", "victoria", "viking", "virus", "visitor", "vista", "voodoo", "voyager", "walter", "wampp", "warrior", "water", "web", "welcome", "welcome1", "welcome2", "westside", "whatever", "wicked", "william", "willie", "wilson", "windows", "winner", "winston", "winter", "wizard", "work123", "world", "write", "writer", "www", "xampp", "xavier", "xp", "xyzzy", "yamaha", "yankee", "yankees", "yellow", "zxccxz", "zxcvb", "zxcvbn", "zxcvbnm", "zxcxz", "zxczxc", "zzz", "spring", "winter", "autumn", "summer"];

var wordlist_small = ["!QAZ2wsx", "!QAZxsw2", "00000", "000000", "0000000", "00000000", "0123456789", "0987654321", "102030", "11111", "111111", "1111111", "11111111", "112233", "121212", "123123", "123123123", "12321", "123321", "1234", "12344321", "12345", "123456", "1234567", "12345678", "123456789", "1234567890", "1234abcd", "1234qwer", "123654", "123654789", "123abc", "123asd", "123qwe", "123qweASD", "123qweasd", "1q2w3e", "1q2w3e4r", "1qaz!QAZ", "1qaz2wsx", "1qaz@WSX", "1qazxsw2", "22222", "222222", "2222222", "22222222", "33333", "333333", "3333333", "33333333", "3edc$RFV", "44444", "444444", "4444444", "44444444", "54321", "55555", "555555", "5555555", "55555555", "654321", "66666", "666666", "6666666", "66666666", "753951", "7654321", "77777", "777777", "7777777", "77777777", "789456", "789456123", "87654321", "88888", "888888", "8888888", "88888888", "987654321", "99999", "999999", "9999999", "99999999", "Admin", "Internet", "Login", "P@ssw0rd", "Password", "Password1", "QWErty123", "Qwer1234", "Qwerty1", "Qwerty12", "Qwerty123", "Qwerty12345", "ZAQ!2wsx", "a1b2c3", "aaaaa", "aaaaaa", "abc", "abc123", "abcd1234", "abcdef", "academia", "access", "account", "admin", "admin1", "admin12", "admin123", "adminadmin", "administrator", "adobe1", "adobe123", "adobeadobe", "alexander", "andrea", "andrew", "anything", "asdasd", "asddsa", "asdfasdf", "asdfgh", "asdfghj", "asdfghjkl", "asdsa", "asdzxc", "azerty", "backup", "baseball", "boss123", "business", "buster", "campus", "changeme", "charlie", "chocolate", "cluster", "codename", "codeword", "coffee", "computer", "controller", "cookie", "customer", "daniel", "database", "default", "desktop", "domain", "dragon", "dreamweaver", "example", "exchange", "explorer", "fdsa", "files", "foobar", "foofoo", "football", "forever", "freedom", "fuckyou", "games", "ginger", "hannah", "home123", "ihavenopass", "iloveyou", "internet", "intranet", "jennifer", "jessica", "jordan", "joshua", "killer", "letitbe", "letmein", "liverpool", "login", "lotus", "love123", "macromedia", "maggie", "manager", "market", "master", "matrix", "michael", "michelle", "money", "monitor", "monkey", "mypass", "mypassword", "mypc123", "nicole", "nimda", "nobody", "nopass", "nopassword", "nothing", "office", "oracle", "owner", "pass1", "pass12", "pass123", "passwd", "password", "password1", "password12", "password123", "pepper", "photoshop", "princess", "private", "public", "purple", "pw123", "q1w2e3", "q1w2e3r4", "qazwsx", "qazwsxedc", "qqqqq", "qwe123", "qweasd", "qweasdzxc", "qweewq", "qwer1234", "qwerty", "qwerty123", "qwerty12345", "qwertyuiop", "qwewq", "root123", "rootroot", "sample", "samsung", "secret", "secure", "security", "server", "shadow", "share", "snoopy1", "soccer", "student", "summer", "sunshine", "super", "superman", "superuser", "supervisor", "system", "temp123", "temporary", "temptemp", "test", "test123", "testtest", "thomas", "tigger", "trustno1", "unknown", "welcome", "whatever", "windows", "work123", "xxxxx", "zxccxz", "zxcvb", "zxcvbn", "zxcvbnm", "zxcxz", "zzzzz"];


var rules_list = [":", "c", "u", "C", "$1", "$2", "$3", "$4", "$5", "$6", "$7", "$8", "$9", "$0", "$1 $2 $3", "$1 $2 $3 $4", "$1 $2 $3 $4 $5", "$1 $2 $3 $4 $5 $6", "$2 $0 $1 $8", "$2 $0 $1 $9", "$2 $0 $2 $0", "$2 $0 $2 $1", "$2 $0 $2 $2", "$2 $0 $2 $3", "$0 $1", "$0 $2", "$0 $3", "$0 $4", "$0 $5", "$0 $6", "$0 $7", "$0 $8", "$0 $9", "$1 $0", "$1 $1", "$1 $2", "$1 $3", "$1 $4", "$1 $5", "$1 $6", "$1 $7", "$1 $8", "$1 $9", "$2 $0", "$2 $1", "$2 $2", "$2 $3", "$2 $4", "$2 $5", "$2 $6", "$2 $7", "$2 $8", "$2 $9", "$3 $0", "$3 $1", "$!", "$@", "$#", "$$", "$! $@", "$! $@ $#", "$! $@ $# $$", "$1 $2 $3 $!", "$! $1 $2 $3", "$1 $@ !#", "$! $@ 1#", "$2 $0 $1 $8 $!", "$2 $0 $1 $9 $!", "$2 $0 $2 $0 $!", "$2 $0 $2 $1 $!", "$2 $0 $2 $2 $!", "$! $2 $0 $1 $8", "$! $2 $0 $1 $9", "$! $2 $0 $2 $0", "$! $2 $0 $2 $1", "$! $2 $0 $2 $2", "$2 $0 $1 $8 $! $@ $#", "$2 $0 $1 $9 $! $@ $#", "$2 $0 $2 $0 $! $@ $#", "$2 $0 $2 $1 $! $@ $#", "$2 $0 $2 $2 $! $@ $#", "$0 $1 $!", "$0 $2 $!", "$0 $3 $!", "$0 $4 $!", "$0 $5 $!", "$0 $6 $!", "$0 $7 $!", "$0 $8 $!", "$0 $9 $!", "$1 $0 $!", "$1 $1 $!", "$1 $2 $!", "$1 $3 $!", "$1 $4 $!", "$1 $5 $!", "$1 $6 $!", "$1 $7 $!", "$1 $8 $!", "$1 $9 $!", "$2 $0 $!", "$2 $1 $!", "$2 $2 $!", "$2 $3 $!", "$2 $4 $!", "$2 $5 $!", "$2 $6 $!", "$2 $7 $!", "$2 $8 $!", "$2 $9 $!", "$3 $0 $!", "$3 $1 $!", "c $1", "c $2", "c $3", "c $4", "c $5", "c $6", "c $7", "c $8", "c $9", "c $0", "c $1 $2 $3", "c $1 $2 $3 $4", "c $1 $2 $3 $4 $5", "c $1 $2 $3 $4 $5 $6", "c $2 $0 $1 $8", "c $2 $0 $1 $9", "c $2 $0 $2 $0", "c $2 $0 $2 $1", "c $2 $0 $2 $2", "c $!", "c $@", "c $#", "c $$", "c $! $@", "c $! $@ $#", "c $! $@ $# $$", "c $1 $2 $3 $!", "c $! $1 $2 $3", "c $1 $@ !#", "c $! $@ 1#", "c $2 $0 $1 $8 $!", "c $2 $0 $1 $9 $!", "c $2 $0 $2 $0 $!", "c $2 $0 $2 $1 $!", "c $2 $0 $2 $2 $!", "c $! $2 $0 $1 $8", "c $! $2 $0 $1 $9", "c $! $2 $0 $2 $0", "c $! $2 $0 $2 $1", "c $! $2 $0 $2 $2", "c $2 $0 $1 $8 $! $@ $#", "c $2 $0 $1 $9 $! $@ $#", "c $2 $0 $2 $0 $! $@ $#", "c $2 $0 $2 $1 $! $@ $#", "c $2 $0 $2 $2 $! $@ $#", "c $0 $1 $!", "c $0 $2 $!", "c $0 $3 $!", "c $0 $4 $!", "c $0 $5 $!", "c $0 $6 $!", "c $0 $7 $!", "c $0 $8 $!", "c $0 $9 $!", "c $1 $0 $!", "c $1 $1 $!", "c $1 $2 $!", "c $1 $3 $!", "c $1 $4 $!", "c $1 $5 $!", "c $1 $6 $!", "c $1 $7 $!", "c $1 $8 $!", "c $1 $9 $!", "c $2 $0 $!", "c $2 $1 $!", "c $2 $2 $!", "c $2 $3 $!", "c $2 $4 $!", "c $2 $5 $!", "c $2 $6 $!", "c $2 $7 $!", "c $2 $8 $!", "c $2 $9 $!", "c $3 $0 $!", "c $3 $1 $!", "c $0 $1", "c $0 $2", "c $0 $3", "c $0 $4", "c $0 $5", "c $0 $6", "c $0 $7", "c $0 $8", "c $0 $9", "c $1 $0", "c $1 $1", "c $1 $2", "c $1 $3", "c $1 $4", "c $1 $5", "c $1 $6", "c $1 $7", "c $1 $8", "c $1 $9", "c $2 $0", "c $2 $1", "c $2 $2", "c $2 $3", "c $2 $4", "c $2 $5", "c $2 $6", "c $2 $7", "c $2 $8", "c $2 $9", "c $3 $0", "c $3 $1"];

//https://github.com/tomyun/crypto-js/issues/1 MD4 CryptoJS impl
(function(Math) {
    // Shortcuts
    var C = CryptoJS;
    var C_lib = C.lib;
    var WordArray = C_lib.WordArray;
    var Hasher = C_lib.Hasher;
    var C_algo = C.algo;

    // Constants table
    var S = [
        [3, 7, 11, 19],
        [3, 5, 9, 13],
        [3, 9, 11, 15]
    ];
    var FF = 0x00000000;
    var GG = 0x5a827999;
    var HH = 0x6ed9eba1;

    /**
     * MD4 hash algorithm.
     */
    var MD4 = C_algo.MD4 = Hasher.extend({
        _doReset: function() {
            this._hash = new WordArray.init([
                0x67452301, 0xefcdab89,
                0x98badcfe, 0x10325476
            ]);
        },

        _doProcessBlock: function(M, offset) {
            // Swap endian
            for (var i = 0; i < 16; i++) {
                // Shortcuts
                var offset_i = offset + i;
                var M_offset_i = M[offset_i];

                M[offset_i] = (
                    (((M_offset_i << 8) | (M_offset_i >>> 24)) & 0x00ff00ff) |
                    (((M_offset_i << 24) | (M_offset_i >>> 8)) & 0xff00ff00)
                );
            }

            // Shortcuts
            var H = this._hash.words;

            var M_offset_0 = M[offset + 0];
            var M_offset_1 = M[offset + 1];
            var M_offset_2 = M[offset + 2];
            var M_offset_3 = M[offset + 3];
            var M_offset_4 = M[offset + 4];
            var M_offset_5 = M[offset + 5];
            var M_offset_6 = M[offset + 6];
            var M_offset_7 = M[offset + 7];
            var M_offset_8 = M[offset + 8];
            var M_offset_9 = M[offset + 9];
            var M_offset_10 = M[offset + 10];
            var M_offset_11 = M[offset + 11];
            var M_offset_12 = M[offset + 12];
            var M_offset_13 = M[offset + 13];
            var M_offset_14 = M[offset + 14];
            var M_offset_15 = M[offset + 15];

            // Working varialbes
            var a = H[0];
            var b = H[1];
            var c = H[2];
            var d = H[3];

            // Computation
            a = CC(FFF, FF, a, b, c, d, M_offset_0, S[0][0]);
            d = CC(FFF, FF, d, a, b, c, M_offset_1, S[0][1]);
            c = CC(FFF, FF, c, d, a, b, M_offset_2, S[0][2]);
            b = CC(FFF, FF, b, c, d, a, M_offset_3, S[0][3]);
            a = CC(FFF, FF, a, b, c, d, M_offset_4, S[0][0]);
            d = CC(FFF, FF, d, a, b, c, M_offset_5, S[0][1]);
            c = CC(FFF, FF, c, d, a, b, M_offset_6, S[0][2]);
            b = CC(FFF, FF, b, c, d, a, M_offset_7, S[0][3]);
            a = CC(FFF, FF, a, b, c, d, M_offset_8, S[0][0]);
            d = CC(FFF, FF, d, a, b, c, M_offset_9, S[0][1]);
            c = CC(FFF, FF, c, d, a, b, M_offset_10, S[0][2]);
            b = CC(FFF, FF, b, c, d, a, M_offset_11, S[0][3]);
            a = CC(FFF, FF, a, b, c, d, M_offset_12, S[0][0]);
            d = CC(FFF, FF, d, a, b, c, M_offset_13, S[0][1]);
            c = CC(FFF, FF, c, d, a, b, M_offset_14, S[0][2]);
            b = CC(FFF, FF, b, c, d, a, M_offset_15, S[0][3]);

            a = CC(GGG, GG, a, b, c, d, M_offset_0, S[1][0]);
            d = CC(GGG, GG, d, a, b, c, M_offset_4, S[1][1]);
            c = CC(GGG, GG, c, d, a, b, M_offset_8, S[1][2]);
            b = CC(GGG, GG, b, c, d, a, M_offset_12, S[1][3]);
            a = CC(GGG, GG, a, b, c, d, M_offset_1, S[1][0]);
            d = CC(GGG, GG, d, a, b, c, M_offset_5, S[1][1]);
            c = CC(GGG, GG, c, d, a, b, M_offset_9, S[1][2]);
            b = CC(GGG, GG, b, c, d, a, M_offset_13, S[1][3]);
            a = CC(GGG, GG, a, b, c, d, M_offset_2, S[1][0]);
            d = CC(GGG, GG, d, a, b, c, M_offset_6, S[1][1]);
            c = CC(GGG, GG, c, d, a, b, M_offset_10, S[1][2]);
            b = CC(GGG, GG, b, c, d, a, M_offset_14, S[1][3]);
            a = CC(GGG, GG, a, b, c, d, M_offset_3, S[1][0]);
            d = CC(GGG, GG, d, a, b, c, M_offset_7, S[1][1]);
            c = CC(GGG, GG, c, d, a, b, M_offset_11, S[1][2]);
            b = CC(GGG, GG, b, c, d, a, M_offset_15, S[1][3]);

            a = CC(HHH, HH, a, b, c, d, M_offset_0, S[2][0]);
            d = CC(HHH, HH, d, a, b, c, M_offset_8, S[2][1]);
            c = CC(HHH, HH, c, d, a, b, M_offset_4, S[2][2]);
            b = CC(HHH, HH, b, c, d, a, M_offset_12, S[2][3]);
            a = CC(HHH, HH, a, b, c, d, M_offset_2, S[2][0]);
            d = CC(HHH, HH, d, a, b, c, M_offset_10, S[2][1]);
            c = CC(HHH, HH, c, d, a, b, M_offset_6, S[2][2]);
            b = CC(HHH, HH, b, c, d, a, M_offset_14, S[2][3]);
            a = CC(HHH, HH, a, b, c, d, M_offset_1, S[2][0]);
            d = CC(HHH, HH, d, a, b, c, M_offset_9, S[2][1]);
            c = CC(HHH, HH, c, d, a, b, M_offset_5, S[2][2]);
            b = CC(HHH, HH, b, c, d, a, M_offset_13, S[2][3]);
            a = CC(HHH, HH, a, b, c, d, M_offset_3, S[2][0]);
            d = CC(HHH, HH, d, a, b, c, M_offset_11, S[2][1]);
            c = CC(HHH, HH, c, d, a, b, M_offset_7, S[2][2]);
            b = CC(HHH, HH, b, c, d, a, M_offset_15, S[2][3]);

            // Intermediate hash value
            H[0] = (H[0] + a) | 0;
            H[1] = (H[1] + b) | 0;
            H[2] = (H[2] + c) | 0;
            H[3] = (H[3] + d) | 0;
        },
        _doFinalize: function() {
            // Shortcuts
            var data = this._data;
            var dataWords = data.words;

            var nBitsTotal = this._nDataBytes * 8;
            var nBitsLeft = data.sigBytes * 8;

            // Add padding
            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);

            var nBitsTotalH = Math.floor(nBitsTotal / 0x100000000);
            var nBitsTotalL = nBitsTotal;
            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = (
                (((nBitsTotalH << 8) | (nBitsTotalH >>> 24)) & 0x00ff00ff) |
                (((nBitsTotalH << 24) | (nBitsTotalH >>> 8)) & 0xff00ff00)
            );
            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = (
                (((nBitsTotalL << 8) | (nBitsTotalL >>> 24)) & 0x00ff00ff) |
                (((nBitsTotalL << 24) | (nBitsTotalL >>> 8)) & 0xff00ff00)
            );

            data.sigBytes = (dataWords.length + 1) * 4;

            // Hash final blocks
            this._process();

            // Shortcuts
            var hash = this._hash;
            var H = hash.words;

            // Swap endian
            for (var i = 0; i < 4; i++) {
                // Shortcut
                var H_i = H[i];

                H[i] = (((H_i << 8) | (H_i >>> 24)) & 0x00ff00ff) |
                    (((H_i << 24) | (H_i >>> 8)) & 0xff00ff00);
            }

            // Return final computed hash
            return hash;
        },
        clone: function() {
            var clone = Hasher.clone.call(this);
            clone._hash = this._hash.clone();

            return clone;
        }
    });

    function ROTL(num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    }

    function CC(f, k, a, b, c, d, x, s) {
        return ROTL((a + f(b, c, d) + x + k), s);
    }

    function FFF(x, y, z) {
        return ((x & y) | ((~x) & z));
    }

    function GGG(x, y, z) {
        return ((x & y) | (x & z) | (y & z));
    }

    function HHH(x, y, z) {
        return (x ^ y ^ z);
    }

    /**
     * Shortcut function to the hasher's object interface.
     *
     * @param {WordArray|string} message The message to hash.
     *
     * @return {WordArray} The hash.
     *
     * @static
     *
     * @example
     *
     *     var hash = CryptoJS.MD4('message');
     *     var hash = CryptoJS.MD4(wordArray);
     */
    C.MD4 = Hasher._createHelper(MD4);

    /**
     * Shortcut function to the HMAC's object interface.
     *
     * @param {WordArray|string} message The message to hash.
     * @param {WordArray|string} key The secret key.
     *
     * @return {WordArray} The HMAC.
     *
     * @static
     *
     * @example
     *
     *     var hmac = CryptoJS.HmacMD4(message, key);
     */
    C.HmacMD4 = Hasher._createHmacHelper(MD4);
})(Math);


/////https://github.com/tomyun/crypto-js/issues/1 MD4 CryptoJS impl




function rstr_sha512(s) {

    return CryptoJS.SHA512(CryptoJS.enc.Latin1.parse(s)).toString(CryptoJS.enc.Latin1);


}


function rstr_sha256(s) {

    return CryptoJS.SHA256(CryptoJS.enc.Latin1.parse(s)).toString(CryptoJS.enc.Latin1);


}

function _extend_256(source, size_ref) {
    var extended = "";
    for (var i = 0; i < Math.floor(size_ref / 32); i++)
        extended += source;
    extended += source.substr(0, size_ref % 32);
    return extended;
}



function _extend_512(source, size_ref) {
    var extended = "";
    for (var i = 0; i < Math.floor(size_ref / 64); i++)
        extended += source;
    extended += source.substr(0, size_ref % 64);
    return extended;
}

// steps 1-12 
function _sha512crypt_intermediate(password, salt) {
    var digest_b = rstr_sha512(password + salt + password);
    var key_len = password.length;

    // extend digest b so that it has the same size as password
    var digest_b_extended = _extend_512(digest_b, password.length);

    var intermediate_input = password + salt + digest_b_extended;
    for (var cnt = key_len; cnt > 0; cnt >>= 1) {
        if ((cnt & 1) != 0)
            intermediate_input += digest_b
        else
            intermediate_input += password;
    }
    var intermediate = rstr_sha512(intermediate_input);

    return intermediate;
}



function _sha256crypt_intermediate(password, salt) {
    var digest_b = rstr_sha256(password + salt + password);
    var key_len = password.length;

    // extend digest b so that it has the same size as password
    var digest_b_extended = _extend_256(digest_b, password.length);

    var intermediate_input = password + salt + digest_b_extended;
    for (var cnt = key_len; cnt > 0; cnt >>= 1) {
        if ((cnt & 1) != 0)
            intermediate_input += digest_b
        else
            intermediate_input += password;
    }
    var intermediate = rstr_sha256(intermediate_input);

    return intermediate;
}



function _rstr_sha256crypt(password, salt, rounds) {
    // steps 1-12
    var digest_a = _sha256crypt_intermediate(password, salt);

    // step 13-15
    var dp_input = "";
    for (var i = 0; i < password.length; i++)
        dp_input += password;
    var dp = rstr_sha256(dp_input);
    // step 16
    var p = _extend_256(dp, password.length);

    // step 17-19
    var ds_input = "";
    for (var i = 0; i < (16 + digest_a.charCodeAt(0)); i++)
        ds_input += salt;
    var ds = rstr_sha256(ds_input);
    // step 20
    var s = _extend_256(ds, salt.length);

    // step 21
    var digest = digest_a;
    var c_input = "";
    for (var i = 0; i < rounds; i++) {
        c_input = "";

        if (i & 1)
            c_input += p;
        else
            c_input += digest;

        if (i % 3)
            c_input += s;

        if (i % 7)
            c_input += p;

        if (i & 1)
            c_input += digest;
        else
            c_input += p;

        digest = rstr_sha256(c_input);
    }

    return digest;
}


function _rstr_sha512crypt(password, salt, rounds) {
    // steps 1-12
    var digest_a = _sha512crypt_intermediate(password, salt);

    // step 13-15
    var dp_input = "";
    for (var i = 0; i < password.length; i++)
        dp_input += password;
    var dp = rstr_sha512(dp_input);
    // step 16
    var p = _extend_512(dp, password.length);

    // step 17-19
    var ds_input = "";
    for (var i = 0; i < (16 + digest_a.charCodeAt(0)); i++)
        ds_input += salt;
    var ds = rstr_sha512(ds_input);
    // step 20
    var s = _extend_512(ds, salt.length);

    // step 21
    var digest = digest_a;
    var c_input = "";
    for (var i = 0; i < rounds; i++) {
        c_input = "";

        if (i & 1)
            c_input += p;
        else
            c_input += digest;

        if (i % 3)
            c_input += s;

        if (i % 7)
            c_input += p;

        if (i & 1)
            c_input += digest;
        else
            c_input += p;

        digest = rstr_sha512(c_input);
    }

    return digest;
};

function sha512crypt(password, salt) {

    //sha256 and 512 have similar algorithms than md5

    var magic = "$6$";
    var rounds;

    // parse the magic "$" stuff
    var magic_array = salt.split("$");
    if (magic_array.length > 1) {
        rounds = parseInt(magic_array[2].split("=")[1]);
        if (rounds) {
            if (rounds < 1000)
                rounds = 1000;
            if (rounds > 999999999)
                rounds = 999999999;
            salt = magic_array[3] || salt;
        } else {
            salt = magic_array[2] || salt;
        }
    }
    console.log(salt);
    // salt is max 16 chars long
    salt = salt.substr(0, 16);
    var hash = "";
    var result = "";
    hash = _rstr_sha512crypt(password, salt, rounds || 5000);


    result =
        to64_triplet(hash, 0, 21, 42) +
        to64_triplet(hash, 22, 43, 1) +
        to64_triplet(hash, 44, 2, 23) +
        to64_triplet(hash, 3, 24, 45) +
        to64_triplet(hash, 25, 46, 4) +
        to64_triplet(hash, 47, 5, 26) +
        to64_triplet(hash, 6, 27, 48) +
        to64_triplet(hash, 28, 49, 7) +
        to64_triplet(hash, 50, 8, 29) +
        to64_triplet(hash, 9, 30, 51) +
        to64_triplet(hash, 31, 52, 10) +
        to64_triplet(hash, 53, 11, 32) +
        to64_triplet(hash, 12, 33, 54) +
        to64_triplet(hash, 34, 55, 13) +
        to64_triplet(hash, 56, 14, 35) +
        to64_triplet(hash, 15, 36, 57) +
        to64_triplet(hash, 37, 58, 16) +
        to64_triplet(hash, 59, 17, 38) +
        to64_triplet(hash, 18, 39, 60) +
        to64_triplet(hash, 40, 61, 19) +
        to64_triplet(hash, 62, 20, 41) +
        to64_single(hash, 63);




    return magic + salt + "$" + result;
}


function sha256crypt(password, salt) {

    //sha256 and 512 have similar algorithms than md5

    var magic = "$5$";
    var rounds;

    // parse the magic "$" stuff
    var magic_array = salt.split("$");
    if (magic_array.length > 1) {
        rounds = parseInt(magic_array[2].split("=")[1]);
        if (rounds) {
            if (rounds < 1000)
                rounds = 1000;
            if (rounds > 999999999)
                rounds = 999999999;
            salt = magic_array[3] || salt;
        } else {
            salt = magic_array[2] || salt;
        }
    }

    // salt is max 16 chars long
    salt = salt.substr(0, 16);
    var hash = "";
    var result = "";
    hash = _rstr_sha256crypt(password, salt, rounds || 5000);

    var result =
        to64_triplet(hash, 0, 10, 20) +
        to64_triplet(hash, 21, 1, 11) +
        to64_triplet(hash, 12, 22, 2) +
        to64_triplet(hash, 3, 13, 23) +
        to64_triplet(hash, 24, 4, 14) +
        to64_triplet(hash, 15, 25, 5) +
        to64_triplet(hash, 6, 16, 26) +
        to64_triplet(hash, 27, 7, 17) +
        to64_triplet(hash, 18, 28, 8) +
        to64_triplet(hash, 9, 19, 29) +
        to64_double(hash, 31, 30);




    return magic + salt + "$" + result;
}




function to64(v, n) {
    const ascii64 = "./0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var s = "";
    while (--n >= 0) {
        s += ascii64.charAt(v & 0x3f);
        v >>= 6;
    }
    return s;
}

function to64_triplet(str, idx0, idx1, idx2) {
    var v = (str.charCodeAt(idx0) << 16) |
        (str.charCodeAt(idx1) << 8) |
        (str.charCodeAt(idx2));
    return to64(v, 4);
}

function to64_double(str, idx0, idx1) {
    var v = (str.charCodeAt(idx0) << 8) |
        str.charCodeAt(idx1);
    return to64(v, 3);
}


function to64_single(str, idx0) {
    var v = str.charCodeAt(idx0);
    return to64(v, 2);
}




function md5crypt(password, salt) {
    var pwlen = password.length;

    var da = password + "$1$" + salt;
    var db = password + salt + password;

    var db_digest = CryptoJS.MD5(db);


    for (pwlen; pwlen > 0; pwlen -= 16) {
        if (pwlen > 16)
            da = da.concat(db_digest.toString(CryptoJS.enc.Latin1));
        else
            da = da.concat(db_digest.toString(CryptoJS.enc.Latin1).substring(0, pwlen));
    }



    for (var i = password.length; i != 0; i >>= 1) {

        if (i % 2 == 1)
            da += '\0';
        else
            da += password.charAt(0);

    }

    var dc_digest = CryptoJS.MD5(CryptoJS.enc.Latin1.parse(da));


    for (i = 0; i < 1000; i++) {
        var tmp = "";

        if (i & 1)
            tmp += password;
        else
            tmp += dc_digest.toString(CryptoJS.enc.Latin1);
        if (i % 3) {

            tmp += salt;
        }
        if (i % 7)
            tmp += password;

        if (i & 1)
            tmp += dc_digest.toString(CryptoJS.enc.Latin1);
        else
            tmp += password;
        dc_digest = CryptoJS.MD5(CryptoJS.enc.Latin1.parse(tmp));

    }




    var hash = "$1$" + salt + "$" +
        to64_triplet(dc_digest.toString(CryptoJS.enc.Latin1), 0, 6, 12) +
        to64_triplet(dc_digest.toString(CryptoJS.enc.Latin1), 1, 7, 13) +
        to64_triplet(dc_digest.toString(CryptoJS.enc.Latin1), 2, 8, 14) +
        to64_triplet(dc_digest.toString(CryptoJS.enc.Latin1), 3, 9, 15) +
        to64_triplet(dc_digest.toString(CryptoJS.enc.Latin1), 4, 10, 5) +
        to64_single(dc_digest.toString(CryptoJS.enc.Latin1), 11);



    return hash;

}



function NTLM(password) {
    return CryptoJS.MD4(CryptoJS.enc.Utf16LE.parse(password)).toString().toUpperCase();

}



function NetNTLMV1() {
    encrypted = CryptoJS.DES.encrypt
    //u4-netntlm::kNS:338d08f8e26de93300000000000000000000000000000000:9526fb8c23a90751cdd619b6cea564742e1e4bf33006ba41:cb8086049ec4736c
    /*
	C = 8-byte server challenge, random
K1 | K2 | K3 = LM/NT-hash | 5-bytes-0
response = DES(K1,C) | DES(K2,C) | DES(K3,C)
	*/
}



function convertN(chr) {

    if (chr >= '0' && chr <= '9') {
        return Number(chr);
    }
    return Number(chr.toUpperCase().charCodeAt(0) - 55);

}

function Nothing(string) {
    return string;
}

function Lowercase(string) {
    return string.toLowerCase();
}

function Uppercase(string) {
    return string.toUpperCase();
}

function Capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function InvertCapitalize(string) {
    return string.charAt(0).toLowerCase() + string.slice(1).toUpperCase();
}

function TogglePosition(string, pos) {

    if (isNaN(parseInt(pos)))
        pos = convertN(pos);
    if (string.charAt(pos) === string.charAt(pos).toUpperCase()) {
        return string.slice(0, pos) + string.charAt(pos).toLowerCase() + string.slice(pos + 1);
    }
    if (string.charAt(pos) === string.charAt(pos).toLowerCase()) {
        return string.slice(0, pos) + string.charAt(pos).toUpperCase() + string.slice(pos + 1);
    }
}

function ToggleCase(string) {
    for (var i = 0; i < string.length; i++) {
        string = TogglePosition(string, i);
    }
    return string;
}


function Reverse(string) {
    return string.split('').reverse().join('');
}


function Duplicate(string) {
    return string + string;
}

function DuplicateN(string, n) {
    var tmp = "";
    n = convertN(n);
    for (var i = 0; i < n; i++) {
        tmp += string;
    }
    return tmp;
}

function Reflect(string) {
    return string + Reverse(string);
}

function RotateLeft(string) {
    return string.slice(1) + string.charAt(0);
}


function RotateRight(string) {
    return string.charAt(string.length - 1) + string.slice(0, string.length - 1);
}

function AppendCharacter(string, chr) {
    return string + chr;
}

function PrependCharacter(string, chr) {
    return chr + string;
}

function TruncateLeft(string) {
    return string.slice(1);
}

function TruncateRight(string) {
    return string.slice(0, string.length - 1);
}


function DeleteN(string, n) {
    n = convertN(n);
    return string.slice(0, n) + string.slice(n + 1);
}



function ExtractRange(string, start, end) {
    start = convertN(start);
    end = convertN(end);
    return string.slice(start, end);
}

function OmitRange(string, start, end) {
    start = convertN(start);
    end = convertN(end);
    return string.slice(0, start) + string.slice(start + end);
}

function InsertN(string, n, chr) {
    n = convertN(n);
    return string.slice(0, n) + chr + string.slice(n);
}

function OverwriteN(string, n, chr) {
    n = convertN(n);
    if (n >= string.length) return string;
    return string.slice(0, n) + chr + string.slice(n + 1);
}

function TruncateN(string, n) {
    return string.slice(0, n);
}


function Replace(string, find, replace) {
    return string.replaceAll(find, replace);
}


function Purge(string, chr) {
    return Replace(string, chr, '');
}

function DuplicateFirstN(string, n) {
    return DuplicateN(string.charAt(0), n) + string;
}

function DuplicateLastN(string, n) {
    if (string.length === 0) return string;
    return string + DuplicateN(string.charAt(string.length - 1), n);
}

function DuplicateAll(string) {
    var result = '';
    var length = string.length;
    for (var i = 0; i < length; i++) {
        result += string.charAt(i) + string.charAt(i);
    }
    return result;
}

function applyRule(string, rule) {
    if (rule.trim().charAt(0) === '#') return false;
    if (rule.trim().length === 0) return false;
    for (var i = 0; i < rule.length;) {
        switch (rule.charAt(i)) {
            case ':':
                string = Nothing(string);
                i++;
                break;
            case 'l':
                string = Lowercase(string);
                i++;
                break;
            case 'u':
                string = Uppercase(string);
                i++;
                break;
            case 'c':
                string = Capitalize(string);
                i++;
                break;
            case 'C':
                string = InvertCapitalize(string);
                i++;
                break;
            case 't':
                string = ToggleCase(string);
                i++;
                break;
            case 'T':
                string = TogglePosition(string, rule.charAt(i + 1));
                i += 2;
                break;
            case 'r':
                string = Reverse(string);
                i++;
                break;
            case 'd':
                string = Duplicate(string);
                i++;
                break;
            case 'p':
                string = DuplicateN(string, rule.charAt(i + 1));
                i += 2;
                break;
            case 'f':
                string = Reflect(string);
                i++;
                break;
            case '{':
                string = RotateLeft(string);
                i++;
                break;
            case '}':
                string = RotateRight(string);
                i++;
                break;
            case '$':
                string = AppendCharacter(string, rule.charAt(i + 1));
                i += 2;
                break;
            case '^':
                string = PrependCharacter(string, rule.charAt(i + 1));
                i += 2;
                break;
            case '[':
                string = TruncateLeft(string);
                i++;
                break;
            case ']':
                string = TruncateRight(string);
                i++;
                break;
            case 'D':
                string = DeleteN(string, rule.charAt(i + 1));
                i += 2;
                break;
            case 'x':
                string = ExtractRange(string, rule.charAt(i + 1), rule.charAt(i + 2));
                i += 3;
                break;
            case 'O':
                string = OmitRange(string, rule.charAt(i + 1), rule.charAt(i + 2));
                i += 3;
                break;
            case 'i':
                string = InsertN(string, rule.charAt(i + 1), rule.charAt(i + 2));
                i += 3;
                break;
            case 'o':
                string = OverwriteN(string, rule.charAt(i + 1), rule.charAt(i + 2));
                i += 3;
                break;
            case '\'':
                string = TruncateN(string, rule.charAt(i + 1));
                i += 2;
                break;
            case 's':
                string = Replace(string, rule.charAt(i + 1), rule.charAt(i + 2));
                i += 3;
                break;
            case '@':
                string = Purge(string, rule.charAt(i + 1));
                i += 2;
                break;
            case 'z':
                string = DuplicateFirstN(string, rule.charAt(i + 1));
                i += 2;
                break;
            case 'Z':
                string = DuplicateLastN(string, rule.charAt(i + 1));
                i += 2;
                break;
            case 'q':
                string = DuplicateAll(string);
                i++;
                break;
            default:
                i++;
                break;
        }



    }

    return string;

}


function extractSalt(hash) {
    var hashParts = hash.split("$");
    if (hashParts.length > 2) {
        return hashParts[length - 1];
    }

    return false;
}


function calculate_m16500(token,key) {
	
	
	const jwtParts = token.split(".");
	var clearedToken=String(jwtParts[0])+"."+String(jwtParts[1]);
    return CryptoJS.HmacSHA256(String(clearedToken),String(key)).toString(CryptoJS.enc.Base64).replaceAll("=","").replaceAll("+","-").replaceAll('/','_');
}


function calculate_m0(string) {
    return CryptoJS.MD5(String(string)).toString(CryptoJS.enc.Hex);
}

function calculate_m100(string) {
    return CryptoJS.SHA1(String(string)).toString(CryptoJS.enc.Hex);
}

function calculate_m1400(string) {
    return CryptoJS.SHA256(String(string)).toString(CryptoJS.enc.Hex);
}

function calculate_m1700(string) {

    return CryptoJS.SHA512(String(string)).toString(CryptoJS.enc.Hex);
}

function calculate_m2600(string) {
    //md5(md5(pass)))
    return calculate_m0(calculate_m0(string));
}

function calculate_m3500(string) {
    //md5(md5(md5(pass))))
    return calculate_m0(calculate_m0(calculate_m0(string)));
}


function calculate_m10(string, searchHash) {
    const words = searchHash.split(':');
    if (words.length != 2) {

        return;
    }
    string = String(string);
    return CryptoJS.MD5(string.concat(words[1])).toString(CryptoJS.enc.Hex);
}

function calculate_m1000(string) {
    return NTLM(string);
}


function crack_m500(string, hash) {
    if (hash == calculate_m500(string, hash.split("$")[2]))
        return string;
    return false;
}

function crack_m1800(string, hash) {
    var candidate = calculate_m1800(string, hash);
    var candidate_parts = candidate.split("$");
    var hash_parts = hash.split("$");

    if (hash_parts[hash_parts.length - 1] == candidate_parts[candidate_parts.length - 1])
        return string;
    return false;
}

function crack_m7400(string, hash) {
    var candidate = calculate_m7400(string, hash);
    var candidate_parts = candidate.split("$");
    var hash_parts = hash.split("$");

    if (hash_parts[hash_parts.length - 1] == candidate_parts[candidate_parts.length - 1])
        return string;
    return false;
}
function crack_m16500(string, hash) {
    var signature = calculate_m16500(hash,string );
    var token = hash.split(".");
    if (token[2] == signature)
        return string;
    return false;
}

function calculate_m500(string, salt) {
    return md5crypt(string, salt);
}

function calculate_m1800(string, salt) {
    return sha512crypt(string, salt);

}

function calculate_m7400(string, salt) {
    return sha256crypt(string, salt);
}




function compare_m10(hash, searchHash) {
    const words = searchHash.split(':');
    if (words.length != 2) {

        return;
    }
    if (words[0] == hash) return hash;
    return false;
}



function crack_unsalted(hashDictionary, passwordsData, rulesData, type) {
    postMessage({
        'status': "start",
        "type": type
    });
    var keyspace = passwordsData.length;
    if (rulesData.length > 0)
        keyspace = keyspace * rulesData.length;
    var entry = "";
    var hash = "";
    var step = Math.round(keyspace / 100);
    var count = 0;
    var progress = 0;
    if (rulesData.length > 0) {

        for (let password of passwordsData) {
            for (let rule of rulesData) {
                if (count++ % step == 0) {
                    progress++;
                    postMessage({
                        'progress': progress
                    });
                }
                if (hashDictionary.size == 0) break;
                entry = applyRule(password, rule);
                if (entry == false) continue;
                switch (type) {
                    case 0:
                        hash = calculate_m0(entry);
                        break;
                    case 100:
                        hash = calculate_m100(entry);
                        break;
                    case 1000:
                        hash = calculate_m1000(entry);
                        break;
                    case 1400:
                        hash = calculate_m1400(entry);
                        break;
                    case 1700:
                        hash = calculate_m1700(entry);
                        break;
                    case 2600:
                        hash = calculate_m2600(entry);
                        break;
                    case 3500:
                        hash = calculate_m3500(entry);
                        break;
                }
                if (hashDictionary.has(hash)) {
                    postMessage({
                        'type': type,
                        'hash': hash,
                        'password': entry
                    });
                    hashDictionary.delete(hash);
                }
            }
        }
    } else {



        for (let password of passwordsData) {

            if (count++ % step == 0) {
                progress++;
                postMessage({
                    'progress': progress
                });
            }
            if (hashDictionary.size == 0) break;
            entry = password;
            console.log(entry);
            switch (type) {
                case 0:
                    hash = calculate_m0(entry);
                    break;
                case 100:
                    hash = calculate_m100(entry);
                    break;

                case 1000:
                    hash = calculate_m1000(entry);
                    break;

                case 1400:
                    hash = calculate_m1400(entry);
                    break;
                case 1700:
                    hash = calculate_m1700(entry);
                    break;
                case 2600:
                    hash = calculate_m2600(entry);
                    break;
                case 3500:
                    hash = calculate_m3500(entry);
                    break;
            }
            console.log(hash);
            if (hashDictionary.has(hash)) {
                postMessage({
                    'type': type,
                    'hash': hash,
                    'password': entry
                });
                hashDictionary.delete(hash);
            }
        }


    }


    postMessage({
        'status': "done",
        "type": type
    });
}



function crack_salted(hashDictionary, passwordsData, rulesData, type) {
    postMessage({
        'status': "start",
        "type": type
    });
    var keyspace = passwordsData.length;
    if (rulesData.length > 0)
        keyspace = keyspace * rulesData.length;
    var entry = "";
    var hash = "";
    var step = Math.round(keyspace / 100);
    var count = 0;
    var progress = 0;



    if (rulesData.length > 0) {


        for (var [searchHash, value] of hashDictionary) {
            var found = false;

            for (let password of passwordsData) {
                console.log(password);
                for (let rule of rulesData) {


                    if (count++ % step == 0) {
                        progress++;
                        postMessage({
                            'progress': progress
                        });
                    }

                    entry = applyRule(password, rule);
                    if (entry == false) continue;

                    switch (type) {
                        case 500:
                            found = crack_m500(entry, searchHash);
                            break;
                        case 1800:
                            found = crack_m1800(entry, searchHash);
                            break;
                        case 7400:
                            found = crack_m7400(entry, searchHash);
                            break;
												case 16500:
                        found = crack_m16500(entry, searchHash);
                        break;

                    }

                    if (found != false) {
                        postMessage({
                            'type': type,
                            'hash': searchHash,
                            'password': entry
                        });
                        break;
                    }
                }

                if (found != false) break;

            }

        }
    } else

    {


        for (var [searchHash, value] of hashDictionary) {
            var found = false;

            for (let password of passwordsData) {



                if (count++ % step == 0) {
                    progress++;
                    postMessage({
                        'progress': progress
                    });
                }
                entry = password;
                switch (type) {
                    case 500:
                        found = crack_m500(entry, searchHash);
                        break;
                    case 1800:
                        found = crack_m1800(entry, searchHash);
                        break;
                    case 7400:
                        found = crack_m7400(entry, searchHash);
                        break;
					case 16500:
                        found = crack_m16500(entry, searchHash);
                        break;
                }

                if (found != false) {
                    postMessage({
                        'type': type,
                        'hash': searchHash,
                        'password': entry
                    });
                    break;
                }


                if (found != false) break;

            }

        }


    }

}

function measure_speed_m1800() {
    var start = performance.now();
    for (var i = 0; i < 10; i++) calculate_m1800("pass", "salt");
    var end = performance.now();
    return Math.round((10 * 1000) / (end - start));
}


function measure_speed_m7400() {
    var start = performance.now();
    for (var i = 0; i < 10; i++) calculate_m7400("pass", "salt");
    var end = performance.now();
    return Math.round((10 * 1000) / (end - start));
}


function measure_speed_m500() {
    var start = performance.now();
    for (var i = 0; i < 10; i++) calculate_m500("pass", "salt");
    var end = performance.now();
    return Math.round((10 * 1000) / (end - start));
}


function measure_speed_m0() {
    var start = performance.now();
    for (var i = 0; i < 100; i++) calculate_m0("pass");
    var end = performance.now();
    return Math.round((100 * 1000) / (end - start));
}

function measure_speed_m1000() {
    var start = performance.now();
    for (var i = 0; i < 100; i++) calculate_m1000("pass");
    var end = performance.now();
    return Math.round((100 * 1000) / (end - start));
}

function measure_speed_m100() {
    var start = performance.now();
    for (var i = 0; i < 100; i++) calculate_m100("pass");
    var end = performance.now();
    return Math.round((100 * 1000) / (end - start));
}

function measure_speed_m1700() {
    var start = performance.now();
    for (var i = 0; i < 100; i++) calculate_m1700("pass");
    var end = performance.now();
    return Math.round((100 * 1000) / (end - start));
}

function measure_speed_m1400() {
    var start = performance.now();
    for (var i = 0; i < 100; i++) calculate_m1400("pass");
    var end = performance.now();
    return Math.round((100 * 1000) / (end - start));
}



function measure_speed_m2600() {
    var start = performance.now();
    for (var i = 0; i < 100; i++) calculate_m2600("pass");
    var end = performance.now();
    return Math.round((100 * 1000) / (end - start));
}

function measure_speed_m3500() {
    var start = performance.now();
    for (var i = 0; i < 100; i++) calculate_m3500("pass");
    var end = performance.now();
    return Math.round((100 * 1000) / (end - start));
}

function measure_speed_m16500() {
	
    var start = performance.now();
    for (var i = 0; i < 100; i++) calculate_m16500("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.bgGd720CeHP4kY9mGuMEoteBq4TP4d0W2XkpiI4bVgg");
    var end = performance.now();
    return Math.round((100 * 1000) / (end - start));
}


function validate_by_regexp(hash, regexp) {
    hash = String(hash);
    var reg = new RegExp(regexp);
    if (reg.test(hash)) {
        return true;
    }
    return false;

}


function validate_hash(hash, type) {

    if (type == 0) return validate_by_regexp(hash, "^[a-f0-9]{32}$");
    else if (type == 1000) return validate_by_regexp(hash, "^[A-F0-9]{32}$");
    else if (type == 2600) return validate_by_regexp(hash, "^[a-f0-9]{32}$");
    else if (type == 3500) return validate_by_regexp(hash, "^[a-f0-9]{32}$");
    else if (type == 100) return validate_by_regexp(hash, "^[a-f0-9]{40}$");
    else if (type == 1400) return validate_by_regexp(hash, "^[a-f0-9]{64}$");
    else if (type == 1700) return validate_by_regexp(hash, "^[a-f0-9]{128}$");
    else if (type == 500) return validate_by_regexp(hash, "^\\$1\\$(rounds=\\d{1,8}\\$)?[./\\w]{0,16}\\$[./\\w]{22}$"); //md5crypt
    else if (type == 1800) return validate_by_regexp(hash, "^\\$6\\$(rounds=\\d{1,8}\\$)?[./\\w]{0,16}\\$[./\\w]{86}$"); //sha512crypt
    else if (type == 7400) return validate_by_regexp(hash, "^\\$5\\$(rounds=\\d{1,8}\\$)?[./\\w]{0,16}\\$[./\\w]{43}$"); //sha256crypt
	else if (type == 16500) return validate_by_regexp(hash, "^([A-Za-z0-9-_]+)\\.([A-Za-z0-9-_]+)\\.([A-Za-z0-9-_]+)$"); //JWT
	
	
	
    return false;
}




onmessage = function(e) {



//console.log(calculate_m16500("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.bgGd720CeHP4kY9mGuMEoteBq4TP4d0W2XkpiI4bVgg","123456"));


//return;

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