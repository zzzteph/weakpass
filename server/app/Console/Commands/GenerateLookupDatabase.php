<?php

namespace App\Console\Commands;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Str;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Process;
class GenerateLookupDatabase extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:generate-lookup-database {folder} {file} {type}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This script will call multiple command to build the lookup DB for every supported hash';

    /**
     * Execute the console command.
     */
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
        $type=strtolower($this->argument('type'));
        if(!in_array($type,hash_algos()) && $type!=="ntlm" && $type!=="all")
        {
            $this->error("Unknown hash type.");
            die();
        }
        
         
        $this->info("Generating TMP file...");
        $tmp_filtered = $this->argument('folder')."/".Str::random(20)."_filtered";
        $this->info( $tmp_filtered." - tmp file name");
        
        $this->info("Filtering the file...");
        Artisan::call('app:filter-wordlist', ['input-file' => $this->argument('file'), 'output-file' => $tmp_filtered]);
        $this->info("Filtering done.");
        
        if($type!=="all")
        {
            $tmp_output=$tmp_filtered."_".$type;
            $this->info("Generating hash table started for ".$type."...");
            Artisan::call('app:generate-hash-table', ['input-file' => $tmp_filtered, 'output-file' => $tmp_output,"type"=>$type,"--sort"=>true]); 
            $this->info("Done!");
            Artisan::call('app:build-lookup-tree', ['folder' => $this->argument('folder'), 'file' => $tmp_output,"type"=>$type]); 
            $this->info("Removing unused files - ".$tmp_output);
            $result = Process::run('rm -f "'.$tmp_output.'"');
            if($result->successful())
            {
               $this->info("Removed");
            }
        }
        
        
        
        if($type=="all")
        {
            //Batch generation
            $tmp_output=$tmp_filtered."_md5";
            $this->info("Generating hash table started for md5...");
            Artisan::call('app:generate-hash-table', ['input-file' => $tmp_filtered, 'output-file' => $tmp_output,"type"=>"md5","--sort"=>true]); 
            $this->info("Done!");
            Artisan::call('app:build-lookup-tree', ['folder' => $this->argument('folder'), 'file' => $tmp_output,"type"=>"md5"]); 
            $this->info("Removing unused files - ".$tmp_output);
            $result = Process::run('rm -f "'.$tmp_output.'"');
            if($result->successful())
            {
               $this->info("Removed");
            }
            
            

            $tmp_output=$tmp_filtered."_ntlm";
            $this->info("Generating hash table started for ntlm...");
            Artisan::call('app:generate-hash-table', ['input-file' => $tmp_filtered, 'output-file' => $tmp_output,"type"=>"ntlm","--sort"=>true]); 
            $this->info("Done!");
            Artisan::call('app:build-lookup-tree', ['folder' => $this->argument('folder'), 'file' => $tmp_output,"type"=>"ntlm"]); 

            
            
            $this->info("Removing unused files - ".$tmp_output);
            $result = Process::run('rm -f "'.$tmp_output.'"');
            if($result->successful())
            {
               $this->info("Removed");
            }
            
    
            $tmp_output=$tmp_filtered."_sha1";
            $this->info("Generating hash table started for sha1...");
            Artisan::call('app:generate-hash-table', ['input-file' => $tmp_filtered, 'output-file' => $tmp_output,"type"=>"sha1","--sort"=>true]); 
            $this->info("Done!");
            Artisan::call('app:build-lookup-tree', ['folder' => $this->argument('folder'), 'file' => $tmp_output,"type"=>"sha1"]); 
            $this->info("Removing unused files - ".$tmp_output);
            $result = Process::run('rm -f "'.$tmp_output.'"');
            if($result->successful())
            {
               $this->info("Removed");
            }
            
   
            $tmp_output=$tmp_filtered."_sha256";
            $this->info("Generating hash table started for sha256...");
            Artisan::call('app:generate-hash-table', ['input-file' => $tmp_filtered, 'output-file' => $tmp_output,"type"=>"sha256","--sort"=>true]);
            $this->info("Done!");
            Artisan::call('app:build-lookup-tree', ['folder' => $this->argument('folder'), 'file' => $tmp_output,"type"=>"sha256"]); 
            $this->info("Removing unused files - ".$tmp_output);
            $result = Process::run('rm -f "'.$tmp_output.'"');
            if($result->successful())
            {
               $this->info("Removed");
            }
                      

            $tmp_output=$tmp_filtered."_sha512";
            $this->info("Generating hash table started for sha512...");
            Artisan::call('app:generate-hash-table', ['input-file' => $tmp_filtered, 'output-file' => $tmp_output,"type"=>"sha512","--sort"=>true]);
            $this->info("Done!");
            Artisan::call('app:build-lookup-tree', ['folder' => $this->argument('folder'), 'file' => $tmp_output,"type"=>"sha512"]); 
            $this->info("Removing unused files - ".$tmp_output);
            $result = Process::run('rm -f "'.$tmp_output.'"');
            if($result->successful())
            {
               $this->info("Removed");
            }
                      
        }
        
        
        
        $this->info("Removing unused files - ".$tmp_filtered);
        
        $result = Process::run('rm -f "'.$tmp_filtered.'"');
        if($result->successful())
        {
           $this->info("Removed");
        }
        
        
        
    }
}
