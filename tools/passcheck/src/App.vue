<script setup>
import { ref,computed} from 'vue';
import CryptoJS from 'crypto-js';
import reverse from 'hashcat-reverse-rules-js';
import hashcatEngine from 'hashcat-rules-js';
const API_URL="https://weakpass.com/api/v1/range/";
const progress = ref(0)
const rules="JCEKJCEgJDEgJDIgJDMKJCEgJDIgJDAgJDEgJDgKJCEgJDIgJDAgJDEgJDkKJCEgJDIgJDAgJDIgJDAKJCEgJDIgJDAgJDIgJDEKJCEgJDIgJDAgJDIgJDIKJCEgJDIgJDAgJDIgJDMKJCEgJDIgJDAgJDIgJDQKJCEgJEAKJCEgJEAgJCMKJCEgJEAgJCMgJCQKJCEgJEAgMSMKJCMKJCQKJDAKJDAgJDAKJDAgJDEKJDAgJDEgJCEgCiQwICQyCiQwICQyICQhCiQwICQzCiQwICQzICQhCiQwICQ0CiQwICQ0ICQhCiQwICQ1CiQwICQ1ICQhCiQwICQ2CiQwICQ2ICQhCiQwICQ3CiQwICQ3ICQhCiQwICQ4CiQwICQ4ICQhCiQwICQ5CiQwICQ5ICQhCiQxCiQxICQwCiQxICQwICQhCiQxICQwICQxCiQxICQxCiQxICQxICQhCiQxICQxICQ5CiQxICQyCiQxICQyICQhCiQxICQyICQzCiQxICQyICQzICQhCiQxICQyICQzICQ0CiQxICQyICQzICQ0ICQ1CiQxICQyICQzICQ0ICQ1ICQ2CiQxICQyICQzICQ0ICQ1ICQ2ICQ3ICQ4CiQxICQyICQzICQ0ICQ1ICQ2ICQ3ICQ4ICQ5ICQwCiQxICQzCiQxICQzICQhCiQxICQzICQwICQwCiQxICQzICQ3CiQxICQzICQ5CiQxICQ0CiQxICQ0ICQhCiQxICQ1CiQxICQ1ICQhCiQxICQ2CiQxICQ2ICQhCiQxICQ2ICQxICQ2CiQxICQ3CiQxICQ3ICQhCiQxICQ4CiQxICQ4ICQhCiQxICQ5CiQxICQ5ICQhCiQxICQ5ICQwICQ3CiQxICQ5ICQwICQ5CiQxICQ5ICQxICQxCiQxICQ5ICQxICQ5CiQxICQ5ICQyICQxCiQxICQ5ICQyICQ5CiQxICQ5ICQzICQ2CiQxICRAICEjCiQyCiQyICQwCiQyICQwICQhCiQyICQwICQxICQ4CiQyICQwICQxICQ4ICQhCiQyICQwICQxICQ4ICQhICRAICQjCiQyICQwICQxICQ5CiQyICQwICQxICQ5ICQhCiQyICQwICQxICQ5ICQhICRAICQjCiQyICQwICQyCiQyICQwICQyICQwCiQyICQwICQyICQwICQhCiQyICQwICQyICQwICQhICRAICQjCiQyICQwICQyICQxCiQyICQwICQyICQxICQhCiQyICQwICQyICQxICQhICRAICQjCiQyICQwICQyICQyCiQyICQwICQyICQyICQhCiQyICQwICQyICQyICQhICRAICQjCiQyICQwICQyICQzCiQyICQwICQyICQzICQhCiQyICQwICQyICQzICQhICRAICQjCiQyICQwICQyICQ0CiQyICQwICQyICQ0ICQhCiQyICQwICQyICQ0ICQhICRAICQjCiQyICQwICQyICQ1CiQyICQxCiQyICQxICQhCiQyICQyCiQyICQyICQhCiQyICQyICQzICQzCiQyICQzCiQyICQzICQhCiQyICQzICQwICQwCiQyICQzICQwICQxCiQyICQ0CiQyICQ0ICQhCiQyICQ1CiQyICQ1ICQhCiQyICQ2CiQyICQ2ICQhCiQyICQ3CiQyICQ3ICQhCiQyICQ4CiQyICQ4ICQhCiQyICQ5CiQyICQ5ICQhCiQzCiQzICQwCiQzICQwICQhCiQzICQxCiQzICQxICQhCiQzICQzCiQzICQzICQwCiQzICQ3ICQwCiQzICRACiQ0CiQ0ICQyICQzICQxCiQ0ICQ0CiQ0ICQ1CiQ0ICQ1ICQwCiQ0ICQ2ICQ1CiQ0ICQ3ICQwCiQ0ICQ4ICQwCiQ1CiQ1ICQzICQ0CiQ1ICQ0ICQzCiQ1ICQ0ICQ1CiQ1ICQ1CiQ1ICQ1ICQ2CiQ1ICQ2CiQ1ICQ3ICQ4CiQ1ICQ5ICQ5CiQ2CiQ2ICQ1ICQ2CiQ2ICQ2CiQ2ICQ2ICQwCiQ2ICQ2ICQ2CiQ2ICQ2ICQ3ICQ3CiQ2ICQ4ICQwCiQ2ICQ5CiQ2ICQ5ICQwCiQ3CiQ3ICQ3CiQ3ICQ3ICQ4CiQ3ICQ4CiQ3ICQ4ICQ3CiQ3ICQ5CiQ4CiQ4ICQqICQqCiQ4ICQxICQwICQwCiQ4ICQyICQwCiQ4ICQ0ICQwCiQ4ICQ1CiQ4ICQ1ICQwCiQ4ICQ2CiQ4ICQ3CiQ4ICQ4CiQ4ICQ4ICQ2CiQ4ICQ5CiQ4ICQ5ICQwICQwCiQ4IGQKJDkKJDkgJDIKJDkgJDYKJDkgJDcKJDkgJDgKJDkgJDkKJEAKJGEgJGwgJHcgJGEgJHkgJHMKJGMgJGggJGkgJGMgJGsKJGYgJG8gJG8gJHQgJGIgJGEgJGwgJGwKJGkgJGgKJGkgJGwgJG8gJHYgJGUgJHkgJG8gJHUKJGkgJHcKJG4gJDEgJDIKJG8gJGMgJHQKJG8gJHUgJHMKJHEgJHcgJGUgJHIgJHQgJHkKJHMKJHQgJGUgJHMgJHQKJHUgJGgKJHUgJHYKJHYgJHYKJHggJHMKKjAyCiswICswICswIHgxMgo6CkMKRDEKRDIKRDIgRDIKRDMKRDQKRDUKRDYKRDcKRDgKRDkKRSAkMQpLClkxClkxIFkxCloxCloyClsKWyAkMApbICQwICQwClsgJDAgJDEKWyAkMCAkMgpbICQwICQzClsgJDAgJDQKWyAkMCAkNQpbICQwICQ2ClsgJDAgJDcKWyAkMCAkOApbICQwICQ5ClsgJDEKWyAkMSAkMApbICQxICQxClsgJDEgJDIKWyAkMSAkMiAkMwpbICQxICQzClsgJDIKWyAkMiAkMQpbICQyICQyClsgJDIgJDMKWyAkMiAkNApbICQyICQ1ClsgJDMKWyAkMyAkMwpbICQ0ClsgJDUKWyAkNSAkNQpbICQ2ClsgJDYgJDkKWyAkNwpbICQ3ICQ3ClsgJDgKWyAkOCAkOApbICQ5ClsgJDkgJDkKWyBbClsgWyAkMApbIFsgJDEKWyBbICQxICQyClsgWyAkMSAkMiAkMwpbIFsgJDIKWyBbICQzClsgWyAkNApbIFsgJDUKWyBbICQ2ClsgWyAkNwpbIFsgJDgKWyBbICQ5ClsgWyBbClsgWyBbICQxClsgWyBbICQxICQyClsgWyBbICQxICQyICQzClsgWyBbIFsKWyBbIFsgWyBbClsgWyBbIFsgWyBbClsgWyBbIFsgYwpbIFsgWyBbIGQKWyBbIFsgXQpbIFsgWyBdIF0KWyBbIFsgXSBdIF0KWyBbIFsgYwpbIFsgWyBkClsgWyBdClsgWyBdICQxICQyICQzClsgWyBdIF0KWyBbIF5iClsgWyBeYwpbIFsgXmQKWyBbIF5mClsgWyBeZwpbIFsgXmoKWyBbIF5rClsgWyBebApbIFsgXm0KWyBbIF5uClsgWyBecApbIFsgXnIKWyBbIF5zClsgWyBedApbIFsgYwpbIFsgYyAkMQpbIFsgZApbIF0KWyBdICQxICQyICQzClsgXSBdClsgXSBdICQxICQyICQzClsgXjEKWyBeMgpbIF5jClsgXmYKWyBeagpbIF5rClsgXmwKWyBebQpbIF5wClsgXnIKWyBecwpbIF50ClsgYwpbIGMgJDEKXQpdICQwCl0gJDEKXSAkMgpdICQzCl0gJDQKXSAkNQpdICQ2Cl0gJDcKXSAkOApdICQ5Cl0gXQpdIF0gXQpdIF0gXSBdCl4xCl4yCl5hCl5iCl5jCl5kCl5lCl5mCl5qCl5rCl5tCl5wCl5yCl5zCl50Cl55IF5tCmMKYyAkIQpjICQhICQxICQyICQzCmMgJCEgJDIgJDAgJDEgJDgKYyAkISAkMiAkMCAkMSAkOQpjICQhICQyICQwICQyICQwCmMgJCEgJDIgJDAgJDIgJDEKYyAkISAkMiAkMCAkMiAkMgpjICQhICQyICQwICQyICQzCmMgJCEgJDIgJDAgJDIgJDQKYyAkISAkQApjICQhICRAICQjCmMgJCEgJEAgJCMgJCQKYyAkISAkQCAxIwpjICQjCmMgJCQKYyAkMApjICQwICQxCmMgJDAgJDEgJCEgCmMgJDAgJDIKYyAkMCAkMiAkIQpjICQwICQzCmMgJDAgJDMgJCEKYyAkMCAkNApjICQwICQ0ICQhCmMgJDAgJDUKYyAkMCAkNSAkIQpjICQwICQ2CmMgJDAgJDYgJCEKYyAkMCAkNwpjICQwICQ3ICQhCmMgJDAgJDgKYyAkMCAkOCAkIQpjICQwICQ5CmMgJDAgJDkgJCEKYyAkMQpjICQxICQwCmMgJDEgJDAgJCEKYyAkMSAkMQpjICQxICQxICQhCmMgJDEgJDIKYyAkMSAkMiAkIQpjICQxICQyICQzCmMgJDEgJDIgJDMgJCEKYyAkMSAkMiAkMyAkNApjICQxICQyICQzICQ0ICQ1CmMgJDEgJDIgJDMgJDQgJDUgJDYKYyAkMSAkMwpjICQxICQzICQhCmMgJDEgJDQKYyAkMSAkNCAkIQpjICQxICQ1CmMgJDEgJDUgJCEKYyAkMSAkNgpjICQxICQ2ICQhCmMgJDEgJDcKYyAkMSAkNyAkIQpjICQxICQ4CmMgJDEgJDggJCEKYyAkMSAkOQpjICQxICQ5ICQhCmMgJDEgJEAgISMKYyAkMgpjICQyICQwCmMgJDIgJDAgJCEKYyAkMiAkMCAkMSAkOApjICQyICQwICQxICQ4ICQhCmMgJDIgJDAgJDEgJDggJCEgJEAgJCMKYyAkMiAkMCAkMSAkOQpjICQyICQwICQxICQ5ICQhCmMgJDIgJDAgJDEgJDkgJCEgJEAgJCMKYyAkMiAkMCAkMiAkMApjICQyICQwICQyICQwICQhCmMgJDIgJDAgJDIgJDAgJCEgJEAgJCMKYyAkMiAkMCAkMiAkMQpjICQyICQwICQyICQxICQhCmMgJDIgJDAgJDIgJDEgJCEgJEAgJCMKYyAkMiAkMCAkMiAkMgpjICQyICQwICQyICQyICQhCmMgJDIgJDAgJDIgJDIgJCEgJEAgJCMKYyAkMiAkMCAkMiAkMwpjICQyICQwICQyICQzICQhICRAICQjCmMgJDIgJDAgJDIgJDQKYyAkMiAkMCAkMiAkNCAkISAkQCAkIwpjICQyICQxCmMgJDIgJDEgJCEKYyAkMiAkMgpjICQyICQyICQhCmMgJDIgJDMKYyAkMiAkMyAkIQpjICQyICQ0CmMgJDIgJDQgJCEKYyAkMiAkNQpjICQyICQ1ICQhCmMgJDIgJDYKYyAkMiAkNiAkIQpjICQyICQ3CmMgJDIgJDcgJCEKYyAkMiAkOApjICQyICQ4ICQhCmMgJDIgJDkKYyAkMiAkOSAkIQpjICQzCmMgJDMgJDAKYyAkMyAkMCAkIQpjICQzICQxCmMgJDMgJDEgJCEKYyAkNApjICQ1CmMgJDYKYyAkNwpjICQ4CmMgJDkKYyAkQApjIFQzCmMgVDQKYyBUNQpjIFQ2CmMgVDcKZAprCmwKbCAkIQpsICQxCmwgJDEgJDIKbCAkMSQyJDMKbCAkMgpsICQyJDAkMSQ2CmwgJDIkMCQxJDcKbCAkMiQwJDEkOApsICQyJDAkMSQ5CmwgJDIkMCQyJDAKbCAkMiQwJDIkMQpsICQyJDAkMiQyCmwgJDIkMCQyJDMKbCAkMiQwJDIkNApsICQyJDAkMiQ1CmwgJDIkMCQyJDYKbCAkMiQwJDIkNwpsICQyJDAkMiQ4CmwgJDIkMCQyJDkKbCAkNApsIF0gJDAKbCBdICQxCmwgXSAkMgpsIF0gJDMKbCBdICQ0CmwgXSAkNQpsIF0gJDcKbCBdICQ5CmwgaTMgCmwgaTMmCmwgaTMrCmwgaTMtCmwgaTMuCmwgaTQgCmwgaTQmCmwgaTQrCmwgaTQtCmwgaTQuCmwgaTUgCmwgaTUmCmwgaTUrCmwgaTUtCmwgaTUuCmwgaTYgCmwgaTYmCmwgaTYrCmwgaTYtCmwgaTYuCmwgaTcgCmwgaTcmCmwgaTcrCmwgaTctCmwgaTcuCm8wZApvMG0gbzFhCm8wdCBvMGIKbzE3Cm8xOApvMTkKcgpzbzAgc2kxIHNlMyBzcyQgc2FACnUKejEKewp7ICQxCnsgYwp7IHsKeyB7IGMKeyB7IHsKeyB7IHsgewp7IHsgeyB7IHsKfQp9IH0KfSB9IH0=";
const rulesLines =  atob(rules).split("\n");
let password = ref('');
let currentProgress=ref(0);
let progressMessage=ref('');
let showReport=ref(0);
let revealed = ref(new Map());
let isProcessing = ref(false);
let isHide = ref(true);
let all_in_one_size=ref(267);

const handleLookupMD5 = async (pass) => {
   const hash=CryptoJS.MD5(pass).toString();

    try {
      let response = await fetch(`${API_URL}${hash.substring(0, 6)}.json?type=md5&filter=hash`); 
      let data=await response.json();
    for (const item of data) {
        if (item && item.hash === hash) {
          return true;
        }
      }



    } catch (error) {
      console.error(`Error fetching data for hash ${hash}:`, error);
    }
  return false;
};





const handleLookup = async () => {
    
    let candidates=new Map();
    revealed.value =new Map();
    currentProgress.value=0;
    showReport.value=0;
    if(password.value.length==0)return;
    isProcessing.value=true;
    progress.value=0;
    let setRevealedRules=new Set();
    let setRevealedPasswords=new Set();
    

    let reversedPassword=reverse.reversePassword(password.value,true);
    for (const [key, value] of reversedPassword) {

      if(hashcatEngine.applyRule(key,value)!==password.value)continue;//make a sanity check that we only work with the rules that are fine
      candidates.set(key, value);
    }

    for (const ruleEntry of rulesLines) {
      if (!ruleEntry.trim()) continue; 
      let entries=reverse.applyReverseRule(password.value,ruleEntry);
      for (const entry of entries) {
        if (!candidates.has(entry)) {


          if(hashcatEngine.applyRule(entry,ruleEntry)!==password.value)continue;//make a sanity check that we only work with the rules that are fine
          candidates.set(entry, ruleEntry);
        }
      }
    }
    
    let passCheckResult = await handleLookupMD5(password.value);
    if(passCheckResult)
    {
      revealed.value.set(password.value,"plain");
      showReport.value=1;
    }



    




    for (const [key, value] of candidates.entries()) {
        currentProgress.value++;
        if( Math.round((currentProgress.value / candidates.size) * 100)>progress.value)
        {
          if(isHide.value==true)
          {
            progressMessage.value=`***** - ${value} (${currentProgress.value} of ${candidates.size})`;
          }
          else
          {
            progressMessage.value=`${key} - ${value} (${currentProgress.value} of ${candidates.size})`;
          }
        }
        progress.value = Math.round((currentProgress.value / candidates.size) * 100);

        if(setRevealedPasswords.has(key) || setRevealedRules.has(value))continue;
        passCheckResult = await handleLookupMD5(key);
        if(!passCheckResult)continue;

        if(!setRevealedPasswords.has(key) && !setRevealedRules.has(value))
        {



          if(showReport.value==1)showReport.value=2;
          if(showReport.value==0)showReport.value=3;
          setRevealedRules.add(value);
          setRevealedPasswords.add(key);
          revealed.value.set(key,value);
        }
        
    }

    isProcessing.value=false;
    if(showReport.value==0)showReport.value=4;
};
const toggleHide = () => {
  isHide.value = !isHide.value;
    };


const humanReadable = computed(() => {
  const num = all_in_one_size.value * 100_000_000* currentProgress.value

  const format = (n, word) =>
    Number.isInteger(n) ? `${n} ${word}` : `${n.toFixed(1)} ${word}`

  if (num >= 1e15) return format(num / 1e15, "quadrillion")
  if (num >= 1e12) return format(num / 1e12, "trillion")
  if (num >= 1e9)  return format(num / 1e9, "billion")
  if (num >= 1e6)  return format(num / 1e6, "million")
  if (num >= 1e3)  return format(num / 1e3, "thousand")

  return num.toString()
})


    
</script>



<template>



<section class="section">
    <div class="container is-box">
      <div class="columns is-multiline is-align-items-center">

        <div class="column is-12 ml-auto">
            <h2 class="mb-5 is-size-1 is-size-3-mobile has-text-weight-bold">Has your password been compromised?</h2>
            <h2 class="subtitle">Find out if your password exists in the <a href="https://weakpass.com/all_in_one">all_in_one</a> wordlist with <strong>27 Billion of passwords</strong> or if it could be cracked using advanced <a href="https://hashcat.net/wiki/doku.php?id=rule_based_attack" target="_blank">rule-based</a> techniques.</h2>
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
  Check
</span>



</button>
  </div>
</div>
</form>


        </div>




        <div class="column is-12 ml-auto" v-if="isProcessing">
            <div class="notification is-info">

              <div class="field">
                <label class="label">Progress {{progressMessage}}</label>
                <div class="control">
                  <progress  class="progress" :value="progress" max="100">{{ progress }}%</progress>
                </div>
              </div>

                
            </div>
        </div>




        <div class="column is-12 ml-auto">
            <div class="notification is-danger" v-if="showReport == 1">
                
                <div class="content">
                  This password is in the weakpass wordlist. You must change it immediately!
              <ul>
                  <li>Your password <strong>was found</strong> in the wordlist!</li>
                  <li><i>Password was checked across <strong>{{humanReadable}}</strong> passwords</i></li>
                </ul>
</div>

            </div>
            <div class="notification is-danger" v-if="showReport == 2">
                
<div class="content">
  This password is in the weakpass wordlist, and some of its variations are also found. You must change it immediately!
              <ul>
                  <li>Your password <strong>was found</strong> in the <a href="https://weakpass.com/all_in_one">all_in_one</a> wordlist!</li>
                  <li>It was found <strong>{{  revealed.size }}</strong> rules, that can be used to crack your password.</li>
                  <li><i>Password was checked across <strong>{{humanReadable}}</strong> passwords</i></li>
                </ul>
</div>

            </div>
            <div class="notification is-warning" v-if="showReport == 3">
                
                <div class="content">
                  This password is not currently compromised, but it could be cracked using common hashcat rules. It's recommended to change it.
              <ul>
                  <li>Your password <strong>is not</strong> in the <a href="https://weakpass.com/all_in_one">all_in_one</a> wordlist</li>
                  <li>It was found <strong>{{  revealed.size }}</strong> rules, that can be used to crack your password.</li>
                  <li><i>Password was checked across <strong>{{humanReadable}}</strong> passwords</i></li>
                </ul>
                </div>
            </div>
            <div class="notification is-primary" v-if="showReport == 4">
                
                <div class="content">
                  This password is <strong>strong</strong>!
                <ul>
                  <li>It was not found in the weakpass wordlist and cannot be cracked using common <a href="https://hashcat.net/wiki/doku.php?id=rule_based_attack" target="_blank">hashcat rules</a>!</li>
                  <li><i>Password was checked across <strong>{{humanReadable}}</strong> passwords </i></li>
                </ul>
</div>


            </div>
        </div>



        <div class="column is-12" v-if="revealed.size">
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
           <tr v-for="[key, value] in Array.from(revealed.entries())" :key="key">
              <td><span class="has-text-danger">&check;</span></td>
              <td v-if="!isHide"> {{ key }}</td>
              <td v-else> ******</td>


              <td>{{ value }}</td>

            </tr>




          </tbody>
        </table>

      </div>
    </div>
  </div>
    </div>
  </div>












  <div class="column is-12 is-12-desktop ml-auto">
<div class="content">
<ul>
<li>All checks happen client-side, so <strong>your password is never sent to the backend</strong>. Learn more in our <a href="https://weakpass.com/api" target="_blank">API section</a>.</li>
<li><a href="https://weakpass.com/api" target="_blank">Weakpass API</a> is free and could be used without any limitations.</li>
        <li>The tool simulates <strong>password mutations with hashcat rules</strong> to check if your password could be cracked with rule based attacks.</li>
</ul>
</div>
</div>












      </div>
      <section class="hero is-primary">
  <div class="hero-body">
    <p class="title">TL;DR</p>
    <p class="subtitle">Use a password manager like <em>1Password</em> or <em>KeePass</em> to create strong, unique passwords and stay secure online.</p>



  </div>
</section>
    </div>





    
    <br/>

</section>



</template>




