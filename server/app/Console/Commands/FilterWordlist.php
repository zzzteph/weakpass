<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class FilterWordlist extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:filter-wordlist {input-file} {output-file} {--sort}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Filter junk data from wordlist';


    function patternFilter($string,$pattern) {
        if (preg_match($pattern, $string)) {
            return true;
        } else {
            return false;
        }
    }


    function isEmail($string) {
        return filter_var($string, FILTER_VALIDATE_EMAIL) !== false;
    }





    function ifPasswordNotJunk($password)
    {
                if (preg_match('/^[A-Za-z !"#$%&\'()*+,\-.\/:;<=>?@[\\\]^_`{|}~]+$/', $password)) {
                    return false;
                }
        
        
                $password =trim($password);
                if (str_starts_with($password,'HEX['))return false;
                if (str_starts_with($password,'HEX['))return false;
                if (str_starts_with($password,'HEX('))return false;
                if (str_starts_with($password, 'hex['))return false;
                if (str_starts_with($password, 'hex('))return false;
                if (str_starts_with($password, '$HEX['))return false;
                if (str_starts_with($password, '$HEX('))return false;
                if (str_starts_with($password, '$hex['))return false;
                if (str_starts_with($password, '$hex['))return false;
                if (str_starts_with($password, '$hex('))return false;
                if (str_starts_with($password, 'forums:topics:'))return false;
                
                //Hash types
                if(str_starts_with($password,"\$1\$"))
                {
                    if(strlen($password)>20)return false;
                }
                if(str_starts_with($password,"\$2a\$"))
                {
                    if(strlen($password)>20)return false;
                }
                
                if(str_starts_with($password,"\$LM\$"))
                {
                    if(strlen($password)>20)return false;
                }
                if(str_starts_with($password,"\$H\$"))
                {
                    if(strlen($password)>20)return false;
                }
                if(str_starts_with($password,"\$P\$"))
                {
                    if(strlen($password)>20)return false;
                }
                
                if(str_starts_with($password,"\$SHA\$"))return false;
                if(str_starts_with($password,"\$P\$B"))return false;
                if(str_starts_with($password,"\$6\$rounds="))return false;
                if(str_starts_with($password,"! "))return false;

                if($this->patternFilter($password,'/^\$(2a|2y)\$0[5-9]|\$1[0-3]\$/'))return false;

                
                if(str_starts_with($password,"PMDUZ_"))return false;
                if(str_starts_with($password,"PESUZ_"))return false;
                if(str_starts_with($password,"PIIDUZ_"))return false;
                if(str_starts_with($password,"olive\">"))return false;
                if(str_starts_with($password,"*&amp;"))return false;
                if(str_starts_with($password,"&pound;"))return false;
                if(str_starts_with($password,"&ouml;"))return false;
                if(str_starts_with($password,"&nbsp;"))return false;
                if(str_starts_with($password,"&amp;"))return false;
                if(str_starts_with($password,"&acirc;"))return false;
                if(str_starts_with($password,"29a&ocirc;"))return false;


                if($this->patternFilter($password,'/^0[1-9]:/'))return false;

                
            
                if(str_starts_with($password,"&lt;"))return false;
                if(str_starts_with($password,"&lt;"))return false;
                if(str_starts_with($password,"Blue\">"))return false;
                if(str_starts_with($password,"blue\">"))return false;
                if(str_starts_with($password,"bold\">"))return false;
                if(str_starts_with($password,"green\">"))return false;
                if(str_starts_with($password,"magenta\">"))return false;
                if(str_starts_with($password,"orange\">"))return false;
                if(str_starts_with($password,"red\">"))return false;
                if(str_starts_with($password,"seagreen\">"))return false;
                if(str_starts_with($password,"darkblue\">"))return false;
                if(str_starts_with($password,"[CDS]close"))return false;
                if(str_starts_with($password,"http://"))return false;
                if(str_starts_with($password,"https://"))return false;
                if($this->patternFilter($password,'/^\$1\$.{8}\$.*$/'))return false;
                if($this->patternFilter($password,'/^\[\d{2}:\d{2}\]/'))return false;
                if($this->patternFilter($password,'/^\d{2}:\d{2}:\d{2}/'))return false;
                if($this->patternFilter($password,'/^[0-9a-f]{20,30}$/'))return false;
                if($this->patternFilter($password,'/^[0-9A-F]{20,30}$/'))return false;
                if($this->patternFilter($password,'/^\*[0-9a-f]{20,30}$/'))return false;
                if($this->patternFilter($password,'/^\*[0-9A-F]{20,30}$/'))return false;
                if($this->patternFilter($password,'/&#[0-9]{2,5};/'))return false;
                if($this->patternFilter($password,'/^\d{8}[:;].+$/'))return false;
                if($this->patternFilter($password,'/^[0-9a-fA-F]{16}:[a-zA-Z0-9]+$/'))return false;
                if($this->patternFilter($password,'/^\(\d{1,5},\'.*$/'))return false;
                if($this->patternFilter($password,"/^'[^']*'\),$/"))return false;
                if($this->patternFilter($password,"/^'[^']*'\);$/"))return false;
                if($this->patternFilter($password,'/^[\$10\.]{10}$/'))return false;
                if($this->patternFilter($password,'/^\$\$\(\s*(["\'])[^"\']*\1\s*\)$/'))return false;
                if($this->patternFilter($password,'/\s.*\s/'))return false;
                if($this->patternFilter($password,'/^<[0-9A-F]+\.[0-9]+$/'))return false;
                if($this->patternFilter($password,'/^\s*<[0-9A-F]+\.[0-9]+$/'))return false;
                if($this->patternFilter($password,'/^\d{11}-;-\d{2}-;-[a-zA-Z0-9._]+$/'))return false;
                if($this->patternFilter($password,"/^<([0-9a-fA-F]+)\$([0-9a-fA-F]+)\$LocalHost$/"))return false;
                if($this->patternFilter($password,"/^<\d{14}\.G[A-Z]\d+$/"))return false;
                if($this->patternFilter($password,"/\\\\u[0-9A-Fa-f]{4}/"))return false;//UTF-escape filter
                if($this->patternFilter($password,"/(?:\\\\x[0-9A-Fa-f]{2}){2,}/"))return false;//escape \xC6\xCB filter (need to have two in a row)
                if($this->patternFilter($password,"/^.{22}==$/"))return false;///0c6xAGZqkLioxG6CatHBw== and /AQmb/3Ye/96FKNxZpP6RA==   
                if($this->patternFilter($password,"/^.{11}=$/"))return false;////OtKrhSsUXU= and /OtKH8Q4yxg=
                if($this->patternFilter($password,"/^(\d+)\.0(\1)$/"))return false;////127731535.0127731535
                if($this->patternFilter($password,"/^<[0-9A-F]+\.[0-9A-F]+$/"))return false;
                if($this->patternFilter($password,"/^<([0-9A-F]+\.){2}[0-9A-F]+$/"))return false;
                if($this->patternFilter($password,"/^<[A-Za-z0-9]+-[A-Za-z0-9]+-[A-Za-z0-9]+$/"))return false;
                if($this->patternFilter($password,"/^[a-f0-9]{16}:$/i"))return false;
                if($this->patternFilter($password,"/\b[a-z]{2,6}&[a-z]{2,6};\S*/"))return false;
                if($this->patternFilter($password,"/\b\d{1,6}:[a-zA-Z]+/"))return false;
                if($this->patternFilter($password,'/\b((?:\d{1,3}\.){3}\d{1,3}):[a-zA-Z]+\b/'))return false;
                if($this->patternFilter($password,'/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/'))return false;         
                
                
                //Some weirdo junk 
                if(str_contains($password, 'prof_root'))return false;
                if(str_contains($password, '&quot;'))return false;
                if(str_contains($password, '&gt;'))return false;
                if(str_contains($password, '$lt;'))return false;
                if(str_contains($password, '&apos;'))return false;
                if(str_contains($password, '&apos;'))return false;
                if(str_contains($password, ' btc'))return false;
                if(str_contains($password, '(null)'))return false;
                if(str_contains($password, '&#60'))return false;
                if(str_contains($password, '&#62'))return false;
                if(str_contains($password, '&nbsp;'))return false;
                if(str_contains($password, '&amp;'))return false;
                if(str_contains($password, '&#036'))return false;
                if(str_contains($password, '&#033'))return false;
                if(str_contains($password, '&#039'))return false;
                if(str_contains($password, '&#034'))return false;
                if(str_contains($password, '&#038'))return false;
                if(str_contains($password, '&#060'))return false;
                if(str_contains($password, '&#062'))return false;
                if(str_contains($password, '&#36'))return false;
                if(str_contains($password, '&#33'))return false;
                if(str_contains($password, '&#39'))return false;
                if(str_contains($password, '&#34'))return false;
                if(str_contains($password, '&#38'))return false;
                if(str_contains($password, '&#60'))return false;
                if(str_contains($password, '&#62'))return false;
                if(str_ends_with($password, '</td>'))return false;
                if($this->isEmail($password))return false;
                if($this->isEmail(trim($password)))return false;
                if($this->isEmail(substr(trim($password), 0, -1)))return false;
                if($this->isEmail(substr(trim($password), 1)))return false;
                $trimmed_pass=substr(trim($password), 1);
                if($this->isEmail(substr(trim($trimmed_pass), 0, -1)))return false;
                $parts=explode(":",$password); 
                if(count($parts)>1)
                {
                    foreach($parts as $part)
                    {
                        if($this->isEmail($part)==true)return false;
                        if($this->isEmail(substr(trim($part), 0, -1))==true)return false;
                        if($this->isEmail(substr(trim($part), 1)))return false;
                    }
                }

                $parts=explode("#",$password);
                if(count($parts)>1)
                {
                    foreach($parts as $part)
                    {
                        if($this->isEmail($part)==true)return false;
                        if($this->isEmail(substr(trim($part), 0, -1))==true)return false;
                        if($this->isEmail(substr(trim($part), 1)))return false;
                    }
                }
                
                $parts=explode("|",$password);
                if(count($parts)>1)
                {
                    foreach($parts as $part)
                    {
                        if($this->isEmail($part)==true)return false;
                        if($this->isEmail(substr(trim($part), 0, -1))==true)return false;
                        if($this->isEmail(substr(trim($part), 1)))return false;
                    }
                }
                
                $parts=explode(",",$password);
                if(count($parts)>1)
                {
                    foreach($parts as $part)
                    {
                        if($this->isEmail($part)==true)return false;
                        if($this->isEmail(substr(trim($part), 0, -1))==true)return false;
                        if($this->isEmail(substr(trim($part), 1)))return false;
                    }
                }
                
               $parts=explode(" ",$password);
                if(count($parts)>1)
                {
                    foreach($parts as $part)
                    {
                        if($this->isEmail($part)==true)return false;
                        if($this->isEmail(substr(trim($part), 0, -1))==true)return false;
                        if($this->isEmail(substr(trim($part), 1)))return false;
                    }
                }
                return TRUE;
                
    }





    public function handle()
    {
        if(!file_exists($this->argument('input-file')))
        {
            $this->error($this->argument('input-file')." not exist");
            die();
        }

        
        $input = fopen($this->argument('input-file'), "r");
        $output = fopen($this->argument('output-file'), "w");

        if ($input) {
            while (($line = fgets($input)) !== false) {
                if($this->ifPasswordNotJunk($line))
                    fwrite($output,$line);   
            }
            
        }
        fclose($input);
        fclose($output);
        
        
        if($this->option('sort'))
        {
            $this->info("Begin sorting...");
            $tmp_output = dirname($this->argument('output-file'))."/".Str::random(20);
            $full_output_path=realpath($this->argument('output-file'));
            $result = Process::forever()->run('LC_ALL=C sort -u "'.$full_output_path.'" -o "'.$tmp_output.'"');
            if($result->successful())
            {
                $this->info("Sorting successful. Moving...");
            }
            $result = Process::run('mv "'.$tmp_output.'" "'.$full_output_path.'"');
            if($result->successful())
            {
                $this->info("Moving...done");
            }
        }
        
        
        
        
    }
}
