<?php

namespace App\Console\Commands;
use Illuminate\Support\Facades\Log;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Process;
class BuildLookupTree extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:build-lookup-tree {folder} {file} {type}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Build database for new weakpass';



    public function handle()
    {


        
        if(!file_exists($this->argument('folder')) || !is_dir($this->argument('folder')))
        {
            $this->error($this->argument('folder')." not exist");
            die();
        }

        if(!file_exists($this->argument('file')))
        {
            $this->error($this->argument('file')." not exist");
            die();
        }
        
        $type=$this->argument('type');
        $handle = fopen($this->argument('file'), "r");
        $folder=$this->argument('folder');
        $prefix="";
        $prefix_file=FALSE;
        $files=array();
        if ($handle) {
            while (($line = fgets($handle)) !== false) {
                $tmp_prefix=substr($line, 0, 6);
                if($tmp_prefix!==$prefix)
                {
                    
                    if ($prefix_file) fclose($prefix_file);
                    $folder1 = substr($tmp_prefix, 0, 2); 
                    $folder2 = substr($tmp_prefix, 2, 2); 
                    $file = substr($tmp_prefix, 4, 2); 
                    if(!file_exists($folder.$folder1))mkdir($folder.$folder1);
                    if(!file_exists($folder.$folder1."/".$folder2))mkdir($folder.$folder1."/".$folder2);
                      
                    $path=$folder.$folder1."/".$folder2."/".$file."_".$type;
                    $this->info($path);
                    $prefix_file = fopen($path, 'a+w');
                    $prefix=$tmp_prefix;
                }
                fwrite($prefix_file,$line);   
            }
            fclose($handle);
        }
        if ($prefix_file) fclose($prefix_file);
    
         


    }
}
