<script setup>
import { ref} from 'vue';
import CryptoJS from 'crypto-js';
const API_URL="https://weakpass.com/api/v1/range/";
function endingsUpToThreeNumbersProcessing(input) {
    const result = new Map();
    const match = input.match(/(\d+)$/);
    if (match) {
        const numbers = match[1]; 
        const numLength = numbers.length;
        for (let i = 1; i <= numLength; i++) {
            const remainingString = input.slice(0, -i);
            const extractedNumbers = numbers.slice(-i).split('').map(n => `$${n}`).join(' ');
            result.set(remainingString, extractedNumbers);
        }
    }

    return result;
}

function endingsSpecAndNumberProcessing(input) {
    const result = new Map();
    const specialCharRegex = /[@#$%^&*()]$/;
    const secondLastRegex = /(\d|[@#$%^&*()])$/;
    if (specialCharRegex.test(input)) {
        const lastChar = input.slice(-1);
        const remainingAfterLastChar = input.slice(0, -1);
        if (secondLastRegex.test(remainingAfterLastChar)) {
            const secondLastChar = remainingAfterLastChar.slice(-1);
            const remainingString = remainingAfterLastChar.slice(0, -1);
            result.set(remainingString, `$${secondLastChar} $${lastChar}`);
        }
        result.set(remainingAfterLastChar, `$${lastChar}`);
    }

    return result;
}

function processYearEnding(input) {
    const result = new Map();
    const yearWithSpecialCharRegex = /(19[7-9][0-9]|20[0-2][0-6])([@#$%^&*()!])$/;
    if (yearWithSpecialCharRegex.test(input)) {
        const match = input.match(yearWithSpecialCharRegex);
        const year = match[1]; // Extract the year
        const specialChar = match[2];
        const remainingString = input.slice(0, -year.length - 1); // Remove year and special character
        const formattedYear = year.split('').map(char => `$${char}`).join('');
        result.set(remainingString, `${formattedYear}$${specialChar}`);
    } else {
        const yearRegex = /(19[7-9][0-9]|20[0-2][0-6])$/;
        if (yearRegex.test(input)) {
            const year = input.match(yearRegex)[0];
            const remainingString = input.slice(0, -year.length);
            const formattedYear = year.split('').map(char => `$${char}`).join('');
            result.set(remainingString, formattedYear);
        }
    }

    return result;
}

function processSpecialCharEnding(input) {
    const result = new Map();
    const specialCharRegex = /([@#$%^&*()!]{1,4})$/;
    if (specialCharRegex.test(input)) {
        const match = input.match(specialCharRegex)[0];
        const numSpecialChars = match.length;
        for (let i = 1; i <= numSpecialChars; i++) {
            const remainingString = input.slice(0, -i);
            const formattedSpecialChars = match.slice(-i).split('').map(char => `$${char}`).join(' ');
            result.set(remainingString, formattedSpecialChars);
        }
    }

    return result;
}
function processPatternEnding(input) {
    const result = new Map();

    const patterns = [
        "12345",
        "1234",
        "123",
        "12345!",
        "1234!",
        "123!",
        "!12345",
        "!1234",
        "!123",
        "123!@#",
        "1234!@#",
    ];


    for (const pattern of patterns) {
        if (input.endsWith(pattern)) {
            const remainingString = input.slice(0, -pattern.length);
            const formattedPattern = pattern
                .split('')
                .map(char => `$${char}`)
                .join('');
            result.set(remainingString, formattedPattern);
            break; 
        }
    }

    return result;
}

function processCapitalisedFirstLetter(input) {
    const result = new Map();
    if(input.length==0)return result;
    if (input[0] === input[0].toUpperCase() && input[0] !== input[0].toLowerCase()) {
        const modifiedString = input[0].toLowerCase() + input.slice(1);
        result.set(modifiedString, 'c'); 
    }

    return result;
}

function processPrefixPatterns(input) {
    const result = new Map();
    const yearRegex = /^(200[0-9]|201[0-9]|202[0-6])/;
    const numberRegex = /^\d+/;
    const specialPrefixes = ["!@#", "!@", "!"];

    for (const prefix of specialPrefixes) {
        if (input.startsWith(prefix)) {
            const remainingString = input.slice(prefix.length); 
            const reversedPrefix = prefix.split('').reverse().map(char => `^${char}`).join(''); 
            result.set(remainingString, reversedPrefix);
            return result; 
        }
    }

    if (yearRegex.test(input)) {
        const year = input.match(yearRegex)[0];
        const remainingString = input.slice(year.length); 
        const reversedYear = year.split('').reverse().map(char => `^${char}`).join(''); 
        result.set(remainingString, reversedYear);
        return result; 
    }

    if (numberRegex.test(input)) {
        const number = input.match(numberRegex)[0];
        const remainingString = input.slice(number.length); 
        const reversedNumber = number.split('').reverse().map(char => `^${char}`).join(''); 
        result.set(remainingString, reversedNumber);
        return result; 
    }

    return result; 
}

function processDoubledWords(input) {
    const result = new Map();
    const doubledRegex = /^(.+)\1$/;
    if (doubledRegex.test(input)) {
        const word = input.match(doubledRegex)[1]; 
        result.set(word, 'd'); 
    }

    return result;
}

function processReversedDoubles(input) {
    const result = new Map();
    if (input.length % 2 === 0) {
        const halfLength = input.length / 2;
        const firstHalf = input.slice(0, halfLength);
        const secondHalf = input.slice(halfLength).split('').reverse().join(''); 
        if (firstHalf === secondHalf) {
            result.set(firstHalf, 'f'); 
        }
    }

    return result;
}

function addResultsToMap(sourceMap, additionalMap) {
    additionalMap.forEach((value, key) => {
        if(key.length!=0) sourceMap.set(key, value.replace(/\s+/g, ''));
    });
    return sourceMap;
}

function addResultsToMapWithRule(sourceMap, additionalMap,rule) {
    additionalMap.forEach((value, key) => {
        if(key.length!=0)
        sourceMap.set(key, (value+rule).replace(/\s+/g, ''));
    });
    return sourceMap;
}

function secondRoundCandidates(string)
{
    let candidates = new Map();
    addResultsToMap(candidates, endingsUpToThreeNumbersProcessing(string));
    addResultsToMap(candidates, endingsSpecAndNumberProcessing(string));
    addResultsToMap(candidates, processYearEnding(string));
    addResultsToMap(candidates, processSpecialCharEnding(string));
    addResultsToMap(candidates, processPatternEnding(string));
    addResultsToMap(candidates, processPrefixPatterns(string));
    addResultsToMap(candidates, processCapitalisedFirstLetter(string));
    addResultsToMap(candidates, processDoubledWords(string));
    addResultsToMap(candidates, processReversedDoubles(string));
    
    return candidates;
}


function generateCandidates(string)
{
    let candidates = new Map();

    addResultsToMap(candidates, endingsUpToThreeNumbersProcessing(string));
    addResultsToMap(candidates, endingsSpecAndNumberProcessing(string));
    addResultsToMap(candidates, processYearEnding(string));
    addResultsToMap(candidates, processSpecialCharEnding(string));
    addResultsToMap(candidates, processPatternEnding(string));
    addResultsToMap(candidates, processPrefixPatterns(string));
    addResultsToMap(candidates, processCapitalisedFirstLetter(string));
    addResultsToMap(candidates, processDoubledWords(string));
    addResultsToMap(candidates, processReversedDoubles(string));
    let secondRound=new Map();
    for (const [key, value] of candidates.entries()) {

            addResultsToMapWithRule(secondRound,secondRoundCandidates(key),value);


    }
    addResultsToMap(candidates, secondRound);


    return candidates;
}










let password = ref('');
let weakType = ref(0);
//0 - default
//1 - found full
//2 - only with rules
//3 - full and with rules
//4 - all good
let revealed = ref([]);
let isProcessing = ref(false);
let isHide = ref(true);


const handleLookupMD5 = async (pass) => {
    const hash=CryptoJS.MD5(pass).toString();
   const prefix=hash.substring(0, 6);

  const fetchData = async (hash) => {
    const response = await fetch(`${API_URL}${hash}.json?type=md5`);
    return response.json();
  };


  let found=false;
    try {
      let data = await fetchData(prefix); 
      found = data.flat().some(item => {
            if (item.hash === hash) {
                return true;
            }
            return false;
        });



    } catch (error) {
      console.error(`Error fetching data for hash ${hash}:`, error);
    }
    console.log(found);
  return found;
};







const handleLookup = async () => {
    
    weakType.value=0;
    revealed.value = [];
    if(password.value.length==0)return;
    isProcessing.value=true;
    let passCheckResult = await handleLookupMD5(password.value);
    if(passCheckResult==true)weakType.value+=1;
    revealed.value.push({pass: password.value, type:"",found:passCheckResult});

    let candidates=generateCandidates(password.value);
    for (const [key, value] of candidates.entries()) {

        passCheckResult = await handleLookupMD5(key);

        if(passCheckResult==true && (weakType.value!=2 && weakType.value!=3))
        {
            weakType.value+=2;
        }


        revealed.value.push({pass: key, type:value,found:passCheckResult});
    }
    if(weakType.value==0)weakType.value=4;
    isProcessing.value=false;
};
const toggleHide = () => {
  isHide.value = !isHide.value;
    };
</script>



<template>



<section class="section">
    <div class="container is-box">
      <div class="columns is-multiline is-align-items-center">

        <div class="column is-12 ml-auto">
            <h2 class="mb-5 is-size-1 is-size-3-mobile has-text-weight-bold">Has your password been compromised?</h2>
            <h2 class="subtitle">Find out if your password exists in the <em>weakpass_4</em> wordlist or if it could be cracked using advanced rule-based techniques.</h2>
        </div>
        <div class="column is-12 ml-auto">
            <form @submit.prevent="handleLookup">
            <div class="field has-addons has-addons">

                <div class="control">
                    <a  :class="['button', 'is-large', isHide ? 'is-primary' : 'is-danger']"
                    @click="toggleHide">
                    <span v-if="isHide">&check;</span>
                    <span v-if="!isHide">&cross;</span>
                
                </a>
</div>



  <div class="control  is-expanded">

    <input class="input  is-large"  :type="isHide ? 'password' : 'text'" placeholder="password" v-model="password">
  </div>
  <div class="control">
    <button type="submit" class="button is-link  is-large" :disabled="isProcessing">

<span v-if="isProcessing" class="icon">
  <i class="fas fa-spin fa-spinner"></i>
</span>

<span v-if="!isProcessing">
  Search
</span>



</button>
  </div>
</div>
</form>


        </div>


        <div class="column is-12 ml-auto">
            <div class="notification is-danger" v-if="weakType == 1">
                This password is in the weakpass wordlist. You must change it immediately!
            </div>
            <div class="notification is-danger" v-if="weakType == 3">
                This password is in the weakpass wordlist, and some of its variations are also found. You must change it immediately!
            </div>
            <div class="notification is-warning" v-if="weakType == 2">
                This password is not currently compromised, but it could be cracked using common hashcat rules. It's recommended to change it.
            </div>
            <div class="notification is-primary" v-if="weakType == 4">
                This password is strong! It was not found in the weakpass wordlist and cannot be cracked using common hashcat rules!
            </div>
        </div>



        <div class="column is-12" v-if="revealed.length">
    <div class=" px-0">

      <div>
        <div class="mb-4 is-justify-content-space-between is-align-items-center">
      <div class="table-container">

        <table class="table is-fullwidth mt-3">
          <thead>
            <tr>
              <th></th>
              <th>Password</th>
              <th><a href="https://hashcat.net/wiki/doku.php?id=rule_based_attack" target="_blank">Hashcat rule</a></th>

            </tr>
          </thead>
          <tbody>
            <tr  v-for="(item, index) in revealed" :key="index">
                <td> 

                    <span v-if="item.found" class="has-text-danger">&check;</span>
                    <span v-else class="has-text-success">&cross;</span>


                </td>

              <td v-if="!isHide"> {{ item.pass }}</td>
              <td v-else> ******</td>


              <td>{{ item.type }}</td>

            </tr>




          </tbody>
        </table>
<ul>
       <li> <span class="has-text-danger">&check; - password <b>was found</b> in weakpass</span></li>
       <li> <span class="has-text-success">&cross; - all good, password <b>was not found</b></span></li>
    </ul>


      </div>
    </div>
  </div>
    </div>
  </div>







  <div class="column is-12 is-12-desktop ml-auto">
  <div>
    <div class="mb-4 is-flex">
  <div>
    <p class="has-text-grey-dark">
      All checks happen client-side, so <strong>your password is never sent to the backend</strong>. Learn more in our <a href="https://weakpass.com/api" target="_blank">API section</a>.
    </p>
  </div>
</div>
<div class="mb-4 is-flex">
  <div>
    <p class="has-text-grey-dark">
        The tool simulates <strong>password mutations with hashcat rules</strong> to check if your password could be cracked with rule based attacks.

    </p>
  </div>
</div>
<div class="mb-4 is-flex">
  <div>
    <p class="has-text-grey-dark">
      Building a similar tool? Download <a href="https://weakpass.com/pre-computed" target="_blank">precomputed tables</a> today and make your own lookup tool.
    </p>
  </div>
</div>
<div class="mb-4 is-flex">
  <div>
    <p class="has-text-grey-dark">
      <strong>TL;DR:</strong> Use a password manager like <em>1Password</em> or <em>KeePass</em> to create strong, unique passwords and stay secure online.
    </p>
  </div>
</div>
  </div>
</div>












      </div>
    </div>





    
    <br/>

</section>


</template>




