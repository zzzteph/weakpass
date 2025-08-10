<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Str;
class GenerateHashTable extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:generate-hash-table {input-file} {output-file} {type} {--sort}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate hash table for specific file';

    function ntlm($string)
    {
        $utf16lePassword = mb_convert_encoding($string, 'UTF-16LE', 'UTF-8');
        $hash = hash('md4', $utf16lePassword, true);
        $hash=strtolower(bin2hex($hash));
        return $hash;
    }

    function proceed_buffer($lines_array,$type)
    {
        $output = fopen($this->argument('output-file'), "a+w");
        $tmp_text="";
        if($type=="ntlm")
        {
            foreach($lines_array as $entry)
            {
                $tmp_text.=$this->ntlm($entry).":".$entry.PHP_EOL;
            }
        }   
        else
         {
                foreach($lines_array as $entry)
                {
                    $tmp_text.=hash($type,$entry).":".$entry.PHP_EOL;
                }
         }

        
        
        fwrite($output, $tmp_text);
        unset($tmp_text);
        
        fclose($output);
    }


    public function handle()
    {
        if(!file_exists($this->argument('input-file')))
        {
            $this->error($this->argument('input-file')." not exist");
            die();
        }
        
        $type=strtolower($this->argument('type'));
        if(!in_array($type,hash_algos()) && $type!=="ntlm")
        {
            $this->error("Unknown hash type.");
            die();
        }
        
        
        $input = fopen($this->argument('input-file'), "r");

        $tmp_buffer=array();
        $tmp_length=0;
        if ($input) {
            while (($line = fgets($input)) !== false) {
                $line =trim($line);
                array_push($tmp_buffer,$line);
                $tmp_length++;
                
                if($tmp_length>=1000000)//avg 40 MB
                {
                    $this->proceed_buffer($tmp_buffer,$type);
                    unset($tmp_buffer);
                    $tmp_buffer=array();
                    $tmp_length=0;
                    gc_collect_cycles();
                }     
            }
            
        }
        fclose($input);
       
        if($tmp_length!=0)//avg 40 MB
        {
            $this->proceed_buffer($tmp_buffer,$type);
            unset($tmp_buffer);
            $tmp_buffer=array();
            $tmp_length=0;
            gc_collect_cycles();
        }     
        
        
        //check if we need to sort the file
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
