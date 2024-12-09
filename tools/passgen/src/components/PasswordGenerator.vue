<script setup>
import { ref,watch,onMounted   } from 'vue';
import { applyRule } from 'hashcat-rules-js';


const defaultRules="Ywp1CkMKIyNhcHBlbmQgbnVtYmVycyAxLi4uNQokMQokMgokMwokNAokNQokNgokNwokOAokOQokMAokMSAkMiAkMwokMSAkMiAkMyAkNAokMSAkMiAkMyAkNCAkNQokMSAkMiAkMyAkNCAkNSAkNgojI2N1cnJlbnQgeWVhciAyMDE4LTIwMjQKJDIgJDAgJDEgJDgKJDIgJDAgJDEgJDkKJDIgJDAgJDIgJDAKJDIgJDAgJDIgJDEKJDIgJDAgJDIgJDIKJDIgJDAgJDIgJDMKJDIgJDAgJDIgJDQKI3llYXJzIG9yIG1vbnRoCiQwICQxCiQwICQyCiQwICQzCiQwICQ0CiQwICQ1CiQwICQ2CiQwICQ3CiQwICQ4CiQwICQ5CiQxICQwCiQxICQxCiQxICQyCiQxICQzCiQxICQ0CiQxICQ1CiQxICQ2CiQxICQ3CiQxICQ4CiQxICQ5CiQyICQwCiQyICQxCiQyICQyCiQyICQzCiQyICQ0CiQyICQ1CiQyICQ2CiQyICQ3CiQyICQ4CiQyICQ5CiQzICQwCiQzICQxCiMjYXBwZW5kIHNlcGNpYWwgY2hhcnMKJCEKJEAKJCMKJCQKJCEgJEAKJCEgJEAgJCMKJCEgJEAgJCMgJCQKIyNzcGVjaWFsIGNoYXJzICsgbnVtYmVycwokMSAkMiAkMyAkIQokISAkMSAkMiAkMwokMSAkQCAhIwokISAkQCAxIwojI3NwZWNpYWwgY2hhcnMgKyB5ZWFycwokMiAkMCAkMSAkOCAkIQokMiAkMCAkMSAkOSAkIQokMiAkMCAkMiAkMCAkIQokMiAkMCAkMiAkMSAkIQokMiAkMCAkMiAkMiAkIQokMiAkMCAkMiAkMyAkIQokMiAkMCAkMiAkNCAkIQokISAkMiAkMCAkMSAkOAokISAkMiAkMCAkMSAkOQokISAkMiAkMCAkMiAkMAokISAkMiAkMCAkMiAkMQokISAkMiAkMCAkMiAkMgokISAkMiAkMCAkMiAkMgokISAkMiAkMCAkMiAkMwokISAkMiAkMCAkMiAkNAokMiAkMCAkMSAkOCAkISAkQCAkIwokMiAkMCAkMSAkOSAkISAkQCAkIwokMiAkMCAkMiAkMCAkISAkQCAkIwokMiAkMCAkMiAkMSAkISAkQCAkIwokMiAkMCAkMiAkMiAkISAkQCAkIwokMiAkMCAkMiAkMyAkISAkQCAkIwokMiAkMCAkMiAkNCAkISAkQCAkIwokMCAkMSAkISAKJDAgJDIgJCEKJDAgJDMgJCEKJDAgJDQgJCEKJDAgJDUgJCEKJDAgJDYgJCEKJDAgJDcgJCEKJDAgJDggJCEKJDAgJDkgJCEKJDEgJDAgJCEKJDEgJDEgJCEKJDEgJDIgJCEKJDEgJDMgJCEKJDEgJDQgJCEKJDEgJDUgJCEKJDEgJDYgJCEKJDEgJDcgJCEKJDEgJDggJCEKJDEgJDkgJCEKJDIgJDAgJCEKJDIgJDEgJCEKJDIgJDIgJCEKJDIgJDMgJCEKJDIgJDQgJCEKJDIgJDUgJCEKJDIgJDYgJCEKJDIgJDcgJCEKJDIgJDggJCEKJDIgJDkgJCEKJDMgJDAgJCEKJDMgJDEgJCEKI2FsbCBhYm92ZSBjYXAKYyAkMQpjICQyCmMgJDMKYyAkNApjICQ1CmMgJDYKYyAkNwpjICQ4CmMgJDkKYyAkMApjICQxICQyICQzCmMgJDEgJDIgJDMgJDQKYyAkMSAkMiAkMyAkNCAkNQpjICQxICQyICQzICQ0ICQ1ICQ2CmMgJDIgJDAgJDEgJDgKYyAkMiAkMCAkMSAkOQpjICQyICQwICQyICQwCmMgJDIgJDAgJDIgJDEKYyAkMiAkMCAkMiAkMgpjICQyICQwICQyICQzCmMgJDIgJDAgJDIgJDQKYyAkIQpjICRACmMgJCMKYyAkJApjICQhICRACmMgJCEgJEAgJCMKYyAkISAkQCAkIyAkJApjICQxICQyICQzICQhCmMgJCEgJDEgJDIgJDMKYyAkMSAkQCAhIwpjICQhICRAIDEjCmMgJDIgJDAgJDEgJDggJCEKYyAkMiAkMCAkMSAkOSAkIQpjICQyICQwICQyICQwICQhCmMgJDIgJDAgJDIgJDEgJCEKYyAkMiAkMCAkMiAkMiAkIQpjICQhICQyICQwICQxICQ4CmMgJCEgJDIgJDAgJDEgJDkKYyAkISAkMiAkMCAkMiAkMApjICQhICQyICQwICQyICQxCmMgJCEgJDIgJDAgJDIgJDIKYyAkISAkMiAkMCAkMiAkMwpjICQhICQyICQwICQyICQ0CmMgJDIgJDAgJDEgJDggJCEgJEAgJCMKYyAkMiAkMCAkMSAkOSAkISAkQCAkIwpjICQyICQwICQyICQwICQhICRAICQjCmMgJDIgJDAgJDIgJDEgJCEgJEAgJCMKYyAkMiAkMCAkMiAkMiAkISAkQCAkIwpjICQyICQwICQyICQzICQhICRAICQjCmMgJDIgJDAgJDIgJDQgJCEgJEAgJCMKYyAkMCAkMSAkISAKYyAkMCAkMiAkIQpjICQwICQzICQhCmMgJDAgJDQgJCEKYyAkMCAkNSAkIQpjICQwICQ2ICQhCmMgJDAgJDcgJCEKYyAkMCAkOCAkIQpjICQwICQ5ICQhCmMgJDEgJDAgJCEKYyAkMSAkMSAkIQpjICQxICQyICQhCmMgJDEgJDMgJCEKYyAkMSAkNCAkIQpjICQxICQ1ICQhCmMgJDEgJDYgJCEKYyAkMSAkNyAkIQpjICQxICQ4ICQhCmMgJDEgJDkgJCEKYyAkMiAkMCAkIQpjICQyICQxICQhCmMgJDIgJDIgJCEKYyAkMiAkMyAkIQpjICQyICQ0ICQhCmMgJDIgJDUgJCEKYyAkMiAkNiAkIQpjICQyICQ3ICQhCmMgJDIgJDggJCEKYyAkMiAkOSAkIQpjICQzICQwICQhCmMgJDMgJDEgJCEKYyAkMCAkMQpjICQwICQyCmMgJDAgJDMKYyAkMCAkNApjICQwICQ1CmMgJDAgJDYKYyAkMCAkNwpjICQwICQ4CmMgJDAgJDkKYyAkMSAkMApjICQxICQxCmMgJDEgJDIKYyAkMSAkMwpjICQxICQ0CmMgJDEgJDUKYyAkMSAkNgpjICQxICQ3CmMgJDEgJDgKYyAkMSAkOQpjICQyICQwCmMgJDIgJDEKYyAkMiAkMgpjICQyICQzCmMgJDIgJDQKYyAkMiAkNQpjICQyICQ2CmMgJDIgJDcKYyAkMiAkOApjICQyICQ5CmMgJDMgJDAKYyAkMyAkMQ==";
const base64Rules="OgpyCnUKVDAKJDAKJDEKJDIKJDMKJDQKJDUKJDYKJDcKJDgKJDkKJDAgJDAKJDAgJDEKJDAgJDIKJDEgJDEKJDEgJDIKJDEgJDMKJDIgJDEKJDIgJDIKJDIgJDMKJDYgJDkKJDcgJDcKJDggJDgKJDkgJDkKJDEgJDIgJDMKJGUKJHMKXSAkYQpdIF0gJHMKXSBdICRhCl0gXSAkZSAkcgpdIF0gJGkgJGUKXSBdIF0gJG8KXSBdIF0gJHkKXSBdIF0gJDEgJDIgJDMKXSBdIF0gJG0gJGEgJG4KXSBdIF0gJGQgJG8gJGcKXjEKXmUgXmggXnQKbzBkCm8wbSBvMWEKc28wCnNpMQpzZTMKRDIKRDIgRDIKRDMKRDQKJzUgRDMKJzUgJDEKXQpdIF0KXSBdIF0KXSBdIF0gZApdIF0gRDEgXQorNSBdIH0gfSB9IH0gJzQKTzAyIHsgeyB7IHsgeyB7Cn0gXSBdIHsKfSB9IC0wIE8xMgp9IH0gfQp9IH0gfSB9ICc0Cn0gfSB9IH0gfSAnNQp9IH0gfSB9IH0gfSBZNCAnNCBk";
const nsa64Rules="OgokMQokMgokMSAkMiAkMwokMSAkMgokMwokNwokMSAkMwokMSAkMQpeMQokMCAkMQokNQokNAokMiAkMgokNiAkOQokMiAkMwokMiAkMQokMSAkMAokOAokMCAkNwokOQokNgpdCiQwICQ4CiQhCiQxICQ0CkQzCiQwICQ2ClsKRDIKJDEgJDUKJDkgJDkKJDggJDgKRDEKJDEgJDYKJDIgJDQKJDEgJDgKJDAgJDkKJDEgJDcKJDAgJDUKRDQKJDcgJDcKJDIgJDUKJDIgJDAKJDEgJDkKJDEgJDIgJDMgJDQKJDMgJDMKJDAgJDAKJDAKJDEgJDAgJDEKJDggJDkKJDIgJDcKRDUKJDAgJDMKJDAgJDIKJDAgJDQKJDIgJDYKJDggJDcKXjIKJDUgJDUKJDIgJDgKJDYgJDYgJDYKJDQgJDQKJDkgJDI=";
const hoboRules="OgpyClQwCnUKXQpkCiQhCiQhICQhCiRACiQjCiQkCiQlCiReCiQmCiQqCiQuCiQ/CiQxICQhCiQhICQxCkBhIEBlIEBpIEBvIEB1CkBhIEBlIEBpIEBvIEB1ICQhCiQwCiQxCiQyCiQzCiQ0CiQ1CiQ2CiQ3CiQ4CiQ5IAokMiAkMCAkMSAkNQokMiAkMCAkMSAkNgokMiAkMCAkMSAkNiAkIQokMSAkNQokMSAkNiAkIQokMSAkNAokMSAkMQokMSAkMgokMCAkMQokMCAkMAokMiAkMwokNiAkOQokNyAkNwokOSAkOQokMSAkMiAkMwokMSAkMiAkMyAkNApeNiBeMSBeMCBeMgpeNiBeMQpeMQpeIQpzbzAKc2kxCnNpIQpzZTMKc3MkCnNhQApzbzAgc2kxCnNvMCBzYUAKc28wIHNhNApzbzAgc2UzCnNvMCBzaTEgc2UzIHNzJCBzYUAKc28wIHNpMSBzZTMgc3MkIHNhQCAkIQpzbzAgc2kxIHNlMyBzcyQgc2FAICQxICQ2";
const top500Rules="OgpsClsKWyBbClsgWyBbIFsKWyBbIFsKewp7IHsKJDEKWyBbIFsgWyBbCnIKeyB7IHsgewpjCl0KWyAkMQokMgpaMQpbIF0KeyB7IHsKJDMKXSBdClsgWyAkMQokNAokNwokNQokMAokNgokOAokOQpbIFsgWyBbIFsgWwokMCAkMQp7IHsgeyB7IHsKWyBbICQyClsgWyBjCnUKRDIKJDIgJDMKWyBbICQzClsgWyAkNwpbICQyCiQxICQyClsgXSAkMSAkMiAkMwpdIF0gXQpbIGMKWyBbICQ5CmwgJDEKWyBbICQ1CmsKWyBdIF0KRDQKWyAkMCAkMQpbIFsgXQpbIFsgXSBdCkQ1CkQzCiQxICQxClsgWyAkNApENgpbIFsgWyBbIGQKXnMKWyAkNgpbIFsgJDgKWyBbIFsgJDEKWyAkMwpvMG0gbzFhCiQxICQwCl0gXSBdIF0KWyAkNwpEMQpENwokMSAkMwpZMQpbIF5zCnsgYwpbIFsgXnMKeyB7IGMKSwpebQpdICQxClsgJDUKWyAkNAokMCAkOQpEOApeMQokMCAkOAokMSAkMiAkMwpbIFsgJDYKWyBbICQwClsgWyBebQpbIFsgYyAkMQokMiAkMQokMCAkMAokMiAkMgpbIFsgJDEgJDIKWyAkMiAkMgpsIF0gJDEKYyAkMQpbICQ4CloyClsgJDEgJDEKWyBbIFsgZApbICQ5ClsgWyBeYgpbIF50CiQ2ICQ5CiQwICQ3CiQwICQ0ClsgWyBeawp9ClsgWyBedAokOSAkOQp9IH0KJDAgJDMKWyBeawpbIFsgXmQKWyBbIF5jCiQwICQyCl5jCiQwICQ1ClsgJDkgJDkKJDEgJDQKRDkKWyAkMiAkMQpbICQwCiQhClsgWyBbIF0KWyAkNiAkOQpbIF5wCl50ClsgWyBeagokMCAkNgpbIFsgXnAKJDcgJDcKWyBebQpbIFsgJDEgJDIgJDMKXSAkMwp9IH0gfQokOCAkOApbICQ3ICQ3Cl5qClsgWyBkCl5kClsgWyBbICQxICQyICQzCl0gJDIKZApbICQxICQyCl5hCl5iCm8wZApbIF5qCiQyICQ0CnsgJDEKWyBjICQxClsgJDAgJDgKWyAkMiAkMwpeawokMiAkNQpbICQwICQ5CiRzCl0gJDQKbzB0IG8wYgpbIF5yClsgWyBbIFsgYwpbIFsgWyBjCl0gJDUKWyAkMCAkNwpeeSBebQpbICQxICQwClsgWyBecgpbICQxICQyICQzCmwgJCEKWyBeYwpbIFsgXmwKXSAkOQokMiAkMApdICQwCl0gJDcKJDggJDcKejEKbCAkMSAkMgpdICQ4ClsgJDEgJDMKWyAkOCAkOAokOCAkOQpbIFsgWyBdIF0KJDEgJDUKJDQgJDUKKjAyCm8xOApbIFsgXmcKWyBeMgpsIF0gJDIKWyAkMCAkMAokNiAkNgpdICQ2Cm8xOQpsICQyCmwgXSAkMApeZgokNSAkNQpbIF5sClsgJDIgJDQKXnAKJDIgJDcKbCBdICQzClsgXSBdICQxICQyICQzClsgWyBdICQxICQyICQzClsgJDAgJDYKbCBdICQ1CmwgXSAkNAokOCAkNgpbIF4xCiQxICQ2ClsgJDAgJDUKJDcgJDgKWyAkMyAkMwpEMiBEMgpbIFsgXmYKJDMgJDAKWyBbIFsgXSBdIF0KWyAkNSAkNQokMiAkOAokMSAkNwpeMgpbIF5mCiQ5ICQ3ClkxIFkxClsgJDAgJDMKXmUKJDMgJDMKbzE3ClsgJDIgJDUKJDIgJDYKWyBbIFsgJDEgJDIKJDEgJDgKKzAgKzAgKzAgeDEyCmwgXSAkNwokNCAkNAokOSAkOApsIF0gJDkKJDggJDUKXnIKWyAkMCAkMgokNSAkNgokNyAkOQpbICQwICQ0CiQ5ICQ2CmwgJDQKRSAkMQpbIFsgXm4KbCAkMwpbIF5nCl0gXSBdIF0gXQpbIFsgXmgKJDggJDQKciAnNiByCiQ4ICQyCiQ4ICQxCiQ2ICQ4CnsgJDIKJGUKJDkgJDAKeyAkMwpbIFsgXncKJDYgJDUKWTIKWyBebgpeNwokNSAkMAokMyAkNApsIF0gJDgKWyBbIF5hClsgJDYgJDYKXjMKJDEgJDkKJGEKWyBedwpbICQyICQwCnsgJDAKXmwKfSB9IC0wIHgxMgokOCAkMwokNiAkNwpeOAokNyAkMQpjICQxICQyCl5oCiQ3ICQ1CiQ3ICQyCiQ3ICQ0CiQzICQxCiQyICQwICQxICQwCmwgXSAkNgokOSAkNQpeZSBeaCBedApeOQpeNApbICQyICQ3Cl0gJDEgJDIgJDMKWyBjICQwICQxCiQ5ICQxCiQ4ICQwCiQ1ICQ3CiQ2ICQwCiQ3ICQ2CmwgJDcKWyBeYQpvNzEKWyBeZQpsICQwCl0gXSAkMQpvMWUKeyB7IHsgYwokNiAkMwpsICQ1ClsgJDQgJDQKJDUgJDQKaTE5CiQ2ICQ0CmwgJDEgJDIgJDMKJDIgJDkKbzE2CmsgSwpbIF5oClsgJDkgJDgKWyAkMSAkNAokOSAkMgpeNQpbICQyICQ4Cl4wIF4yCl5uCnsgeyB7IHsgYwpbICQ4ICQ5CiRuCiQxICQhCmkxOAokNCAkMApvMXUKfSB9IH0gfSB9IH0gWTQgJzQgZAokMSAkMiAkMyAkNApbICQyICQ2CmkxZQpbICQzICQwCl53ClsgJDggJDcKXjYKWyBbIF5lCl5nCm81MQokNiAkMgokNSAkOQpjICQyCmMgJCEKXSBjCm8xMAokOSAkNAokNyAkMwokNyAkMAokNCAkNwppMTcKJDMgJDIKWyAkOSAkNwpbICQzICQxCiQ5ICQzClsgJDEgJDUKWyAkNSAkMApbICQ3ICQ4CmwgJDgKJDQgJDMKJDUgJDIKJDYgJDEKc28wCmwgJDYKJDUgJDEKWyAkOCAkNQokNSAkOApvMTUKXjIgXjEKWyAkMSAkOAokMyAkNQpbICQ4ICQ2Cmk4IQokMCAkMCAkNwpjICQwICQxClsgWyBjICQxICQyICQzCm8xbwpbICQyICQ5ClsgXjQKWyAkNCAkNQpbICQxICQ2CksgJDEKRSBdClsgJDEgJDcKWyAkOSAkNgpbICQ5ICQ1Cm8xYQpbICQ1ICQ2CmwgJDkKWyAkOCAkMgpbICQ3ICQ1ClsgJDcgJDkKJDUgJDMKbzYxCm8zMQpeOSBeMQpbICQ2ICQ1ClsgJDggJDEKJDQgJDgKJDQgJDIKJD8KWyAkNyAkNgp7IHsgeyAkNApbICQ4ICQzClsgXnoKWyBbIF52ClsgJDYgJDgKJDQgJDYKbzQxCnsgJDcKbzE0ClsgYyAkMSAkMgpbICQ3ICQyCmkxYQpbIGMgJDEgJDEKeyAkNAokNCAkOQpjICQxICQyICQzClsgWyBeegpbICQ4ICQ0Cm81MgokMyAkNwpbIFsgWyBbIFsgYwpbICQ1ICQ0Cl44IF4yClsgXnYKeDAyIHsgeyB7IHsgeyB7CnIgJzcgcgpyICc4IHIKfSBaMSB7Cl42IF4yClQxClsgJDMgJDIKWyAkMyAkNAppNyEKaTE2ClsgJDYgJDcKWyBbIF5NClsgJDcgJDQKXjUgXjIKWyBeOQpbICQ3ICQxCiQzICQ2Cm8xMwpeNyBeMgpbIGMgJDEgJDIgJDMKWyAkOSAkMApbICQ2ICQ0Cm8yMQpbIF4zClsgJDggJDAKbzMyCiR5CiRyClsgXjgKWyAkNiAkMwpbICQ0ICQyCm8xMQpdIF5zCm8xMgpbICQ1ICQ3ClsgJDcgJDMKXjkgXjIKXSBebQpbIFsgYyAkMSAkMgoqMTMKYyBUNApbIFsgXlMKJDIgJDAgJDAgJDAKWyBbIF5CCl4zIF4yClsgXmkKWyBeNwp7ICQ1ClsgJDQgJDAKejIKXjQgXjIKWyAkOSAkMwpjICQzClsgJDEgJDkKfSBdIF0gewpeMiBeMgpvMjIKXSBdICRzCl4wIF4xCiQ2ICQ2ICQ2Cm80MgpvNDAKbzM0ClsgJDkgJDEKbzMzCg==";

const inputData = ref('');
const rulesData = ref(atob(defaultRules));
const filterLength = ref(false);
const filterSpecial = ref(false);
const filterNumber = ref(false);
const showRules = ref(true);
const results = ref('');

const isMobile = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;

  return /android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
}
const generate = () => {
  let data = inputData.value.split(/[\s,]+/).filter((v, i, a) => a.indexOf(v) === i && (v === "0" || v));

  let rules = rulesData.value.split(/\n/).filter((v, i, a) => a.indexOf(v) === i && (v === "0" || v));
  let list = new Set();
  for (let string of data) {
    for (let rule of rules) {
        let ruleResult = applyRule(string, rule);
      if (ruleResult !== false) {
        if (filterValue(ruleResult)===false) continue;
        list.add(ruleResult);
      }
    }
  }

  results.value = Array.from(list).join('\n');
};




watch(filterLength, (newValue) => {
  if (newValue === true) {
    filterResultLength();
  }
});


watch(filterSpecial, (newValue) => {
  if (newValue === true) {
    filterResultSpecial();
  }
});



watch(filterNumber, (newValue) => {
  if (newValue === true) {
    filterResultNumber();
  }
});



function filterValue(string)
{
    const specialCharPattern = /[^a-zA-Z0-9]/;
    const numberPattern = /[0-9]/;
    if(filterLength.value)
    {
        if(string.length<8)return false;
    }

    if(filterNumber.value)
    {
        if(!numberPattern.test(string))return false;
    }

    if(filterSpecial.value)
    {
        if(!specialCharPattern.test(string))return false;
    }

return true;
}




const filterResultLength = () => {
  let res_data = results.value.split(/\n/).filter((v, i, a) => a.indexOf(v) === i && (v === "0" || v));
  let list = new Set();
  for (let string of res_data) {
        if(string.length<8)continue;
        list.add(string);
  }
  results.value = Array.from(list).join('\n');
};


const filterResultSpecial = () => {
  let res_data = results.value.split(/\n/).filter((v, i, a) => a.indexOf(v) === i && (v === "0" || v));
  let list = new Set();
  const specialCharPattern = /[^a-zA-Z0-9]/;
  for (let string of res_data) {
        if(!specialCharPattern.test(string))continue;
        list.add(string);
  }
  results.value = Array.from(list).join('\n');
};

const filterResultNumber = () => {
  let res_data = results.value.split(/\n/).filter((v, i, a) => a.indexOf(v) === i && (v === "0" || v));
  let list = new Set();
  const numberPattern = /[0-9]/;
  for (let string of res_data) {
        if(!numberPattern.test(string))continue;
        list.add(string);
  }
  results.value = Array.from(list).join('\n');
};




function setRules(type) {
  if (type === 'default') {
    rulesData.value = atob(defaultRules);
  } else if (type === 'best64') {
    rulesData.value = atob(base64Rules);
  } else if (type === 'nsa64') {
    rulesData.value = atob(nsa64Rules);
  }
  else if (type === 'top500') {
    rulesData.value = atob(top500Rules);
  }
  else if (type === 'hobo') {
    rulesData.value = atob(hoboRules);
  }
}

onMounted(() => {
  showRules.value = !isMobile();
});


</script>


<template>
  <section class="section">
<div class="container">
<h1 class="title">Passwords generator</h1>
<div class="content">
<p>Here you can generate a wordlist based on specific input data. For example, by entering an <strong>Acme.corp</strong> you will receive a list of possible passwords like <strong>Acme.corp2018!</strong>, <strong>Acme.corp123</strong>, and so on. All data is processed on the client with JavaScript.</p>

<p class="is-hidden-mobile">You can use <a href="https://hashcat.net/wiki/doku.php?id=rule_based_attack">hashcat rules</a> to generate a wordlist. By default, the generator will use its own rules, which you can find here or click on <strong>"Show rules"</strong>.</p>

<p class="is-hidden-mobile">Follow the project on <a href="https://github.com/zzzteph/weakpass">Github</a> or <a href="https://zzzteph.github.io/weakpass/">pages</a></p>

</div>



<div class="field">
  <label class="label">Words</label>
   <p class="help">Separated by comma, whitespace or newline</p>
  <div class="control">
    <textarea class="textarea is-primary" v-model="inputData" id="input" placeholder="Put words of interest here..."></textarea> 
  </div>
</div>

<div class="field is-grouped is-hidden-mobile">
  <div class="control">
    <label class="checkbox">
      <input type="checkbox" v-model="showRules">
      Show rules
    </label>
  </div>
  
    <div class="control">
    <label class="checkbox">
      <input type="checkbox" v-model="filterLength">
      Length > 8
    </label>
  </div>
  
  
  <div class="control">
    <label class="checkbox">
      <input type="checkbox" v-model="filterSpecial">
      Has special
    </label>
  </div>

  <div class="control">
    <label class="checkbox">
      <input type="checkbox" v-model="filterNumber">
      Has numbers
    </label>
  </div>
</div>

<div class="field is-hidden-desktop is-grouped">
  <div class="control">
    <label class="checkbox">
      <input type="checkbox" v-model="showRules">
      Show rules
    </label>
  </div>
  



  <div class="control">
    <label class="checkbox">
      <input type="checkbox" v-model="filterLength">
      Length > 8
    </label>
  </div>
</div>
<div class="field is-hidden-desktop is-grouped">
  <div class="control">
    <label class="checkbox">
      <input type="checkbox" v-model="filterSpecial">
      Has special
    </label>
  </div>

  <div class="control">
    <label class="checkbox">
      <input type="checkbox" v-model="filterNumber">
      Has numbers
    </label>
  </div>
</div>




<div class="field">
  <div class="control">
    <button class="button is-link" @click="generate">Generate</button>
  </div>
</div>


<div class="columns">
<div class="column" :class="{'is-6': showRules, 'is-12': !showRules}">
  <label class="label" id="count">Result</label>
  <div class="control">
    <textarea class="textarea is-primary" v-model="results" id="result" rows="25"></textarea> 
  </div>
</div>



<div class="column is-6" v-if="showRules">
  <label class="label">Rules</label>

  <div class="field is-grouped">
  <div class="control">
    <button class="button is-link is-small" @click="setRules('default')">default</button>
  </div>

  <div class="control">
    <button class="button is-link is-small" @click="setRules('nsa64')">nsa64</button>
  </div>

  <div class="control">
    <button class="button is-link is-small" @click="setRules('hobo')">hob064</button>
  </div>

  <div class="control is-hidden-mobile" >
    <button class="button is-link is-small is-hidden-mobile" @click="setRules('top500')">top 500</button>
  </div>


  <div class="control is-hidden-mobile" >
    <button class="button is-link is-small is-hidden-mobile" @click="setRules('best64')">best64</button>
  </div>
</div>



  <div class="control">
    <textarea class="textarea is-primary" v-model="rulesData" id="rules" rows="25" placeholder="Rules">

</textarea> 
  </div>
</div>
</div>

 </div>
</section>
</template>