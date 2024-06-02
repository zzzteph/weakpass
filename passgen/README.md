# passgen - Weakpass rule-based online generator


The tool generates a wordlist based on a set of words entered by the user.

Link: https://zzzteph.github.io/weakpass/

Secondary: https://weakpass.com/generate


<p align="center">
  <img src="https://github.com/zzzteph/weakpass/blob/main/passgen/sample.png?raw=true"  height="350">
</p>



For example, during penetration testing, you need to gain access to some service, device, account, or Wi-Fi network that is password protected. For example, let it be the _Wi-Fi_ network of **EvilCorp**. Sometimes, a password is a combination of _device/network/organization_ name with some date, special character, etc. Therefore, it is simpler and easier to test some combinations before launching more complex and time-consuming checks. For example, cracking a _Wi-Fi_ password with a wordlist can take several hours and can fail, even if you choose a [great wordlist](https://weakpass.com/wordlist/1950) because there was no such password in it like **Evilcorp2019**. 

Therefore, using the generated wordlist, it is possible to organize a targeted and effective online password check.

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

### Lints and fixes files
```
npm run lint
```



## Features

The hashcat rule syntax is used to generate the wordlist. By default, the generator uses a set of rules "online.rule", which performs the following mutations:

1. Adding special characters and popular endings to the end of the word - !,!@, !@#, 123! etc. **evilcorp!**, **evilcorp!123**
2. Adding digits from 1 to 31, from 01 to 12  - **evilcorp01**, **evilcorp12**.
3. Adding the date 2018-2023 - **evilcorp2018**, **evilcorp2019**
4. Various combinations of 1-3 - **evilcorp2018!**
5. Capitalize the first letter and lower the rest, apply 1-4. **Evilcorp!2021**


As a result, for the word **evilcorp**, the following passwords will be generated (216 in total):
 - evilcorp
 - Evilcorp
 - EVILCORP
 - evilcorp123456
 - evilcorp2018
 - Evilcorp!2021
 - Evilcorp!2022
 - Evilcorp2018!@#

You can use your own hashcat rules, just click **"Show rules"** and put in the **"Rules"** textarea them with the list of rules you like best.
Rules that are supported (source https://hashcat.net/wiki/doku.php?id=rule_based_attack):

|Name|Function|Description|Example Rule|Input Word|Output Word|
| --- | --- | --- | --- | --- | --- |
|Nothing|:|Do nothing (passthrough)|:|p@ssW0rd|p@ssW0rd|
|Lowercase|	l|Lowercase all letters|	l|p@ssW0rd	|p@ssw0rd	|
|Uppercase|u|Uppercase all letters	|u|p@ssW0rd	|P@SSW0RD|
|Capitalize|	c|Capitalize the first letter and lower the rest	|c|p@ssW0rd	|	P@ssw0rd|
|Invert Capitalize	|C|Lowercase first found character, uppercase the rest	|C|p@ssW0rd	|p@SSW0RD|
|Toggle Case	|	t|Toggle the case of all characters in word.	|t|p@ssW0rd	|P@SSw0RD	|
|Toggle @	|TN|Toggle the case of characters at position N	|T3|p@ssW0rd	|p@sSW0rd	|
|Reverse|	r|Reverse the entire word	|r|p@ssW0rd	|dr0Wss@p	|
|Duplicate|d|Duplicate entire word	|d|p@ssW0rd	|p@ssW0rdp@ssW0rd	|
|Duplicate N	|pN|Append duplicated word N times	|p2|p@ssW0rd	|p@ssW0rdp@ssW0rdp@ssW0rd	|
|Reflect|f|Duplicate word reversed	|f|p@ssW0rd	|p@ssW0rddr0Wss@p	|
|Rotate Left	|{|Rotate the word left.	|	{|p@ssW0rd	|@ssW0rdp	|
|Rotate Right	|}|Rotate the word right	|}|p@ssW0rd	|dp@ssW0r	|
|Append Character	|$X	|Append character X to end	|$1	|p@ssW0rd	|p@ssW0rd1	|
|Prepend Character	|^X	|Prepend character X to front	|^1	|p@ssW0rd	|1p@ssW0rd	|
|Truncate left	|[|Delete first character	|[|p@ssW0rd	|@ssW0rd	|
|Trucate right	|]|Delete last character	|	]|p@ssW0rd	|p@assW0r	|
|Delete @ N	|DN|Delete character at position N	|D3|p@ssW0rd	|p@sW0rd	|
|Extract range	|xNM|Extract M characters, starting at position N	|x04|p@ssW0rd	|p@ss	|
|Omit range	|ONM|Delete M characters, starting at position N	|O12|p@ssW0rd	|psW0rd	|
|Insert @ N	|iNX|Insert character X at position N	|i4!	|p@ssW0rd	|p@ss!W0rd	|
|Overwrite @ N	|oNX|Overwrite character at position N with X	|o3$	|p@ssW0rd	|p@s$W0rd	|
|Truncate @ N		|'N	|Truncate word at position N	|'6	|p@ssW0rd	|p@ssW0	|
|Replace	|sXY|Replace all instances of X with Y	|ss$	|p@ssW0rd	|p@$$W0rd	|
|Purge	|@X	|Purge all instances of X	|@s	|p@ssW0rd	|p@W0rd	|
|Duplicate first N|zN	|Duplicate first character N times		|z2|p@ssW0rd	|ppp@ssW0rd	|
|Duplicate last N|ZN|Duplicate last character N times	|Z2|p@ssW0rd	|p@ssW0rddd	|
|Duplicate all|q|Duplicate every character	|q|p@ssW0rd	|pp@@ssssWW00rrdd	|



The generator automatically removes duplicate passwords.

By pressing the Wi-Fi, all passwords less than 8 characters long will be automatically deleted.

All data is generated using Javascript so that you can use the generator without internet access.



# How-to

<p align="center">
  <img src="https://github.com/zzzteph/weakpass/blob/main/generator/howto.gif?raw=true"  height="350">
</p>


1. To generate a wordlist, enter in the **Words** field, words that can be used as part of the password.
2. Click on the **Generate** button
3. Copy the received content or click on the Copy to clipboard button for automatic copying.
4. ...
5. Profit!









