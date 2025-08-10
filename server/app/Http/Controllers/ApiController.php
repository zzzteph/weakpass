<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
class ApiController extends Controller
{



    function isHexString($string) {

        return preg_match('/^[0-9a-f]+$/i', $string) === 1;
    }

    function get_file($file)
    {
        if(!file_exists($file))return FALSE;
        $handle = fopen($file, "r");
        $result_data=array();
        if ($handle) {
            while (($line = fgets($handle)) !== false) {
                    array_push($result_data,rtrim($line));
            }

            fclose($handle);
        }
        
        return $result_data;
        
    }




    function load_hash_db($prefix,$type)
    {
        $path=realpath(env('HASH_DB_PATH'));
        
        $folder1 = substr($prefix, 0, 2); 
        $folder2 = substr($prefix, 2, 2); 
        $file = substr($prefix, 4, 2);
        $content=array();
        $path=realpath($path.$folder1."/".$folder2."/".$file."_".$type);
        $content=$this->get_file($path);
        $filtered_content=array();
        if(empty($content))return array();
        foreach($content as $line)
        {
            if (str_starts_with($line, $prefix)) {
                array_push($filtered_content,$line);
            }
        }
        return $filtered_content;
    }




    function db_search($hash)
    {
        $hash_length=strlen($hash);
        $result_search=array();
        if($hash_length<=32)
        {
            $tmp=$this->load_hash_db($hash,"md5");
            if($tmp!==false)
            {
                foreach($tmp as $entry)
                {
                    $exploded_data=explode(":",$entry,2);
                    array_push($result_search,array('type'=>"md5",'hash'=>$exploded_data[0],'pass'=>$exploded_data[1]));
                }
            }
            
            $tmp=$this->load_hash_db($hash,"sha1");
            if($tmp!==false)
            {
                foreach($tmp as $entry)
                {
                    $exploded_data=explode(":",$entry,2);
                    array_push($result_search,array('type'=>"sha1",'hash'=>$exploded_data[0],'pass'=>$exploded_data[1]));
                }
            }
            
            
            $tmp=$this->load_hash_db($hash,"ntlm");
            if($tmp!==false)
            {
                foreach($tmp as $entry)
                {
                    $exploded_data=explode(":",$entry,2);
                    array_push($result_search,array('type'=>"ntlm",'hash'=>$exploded_data[0],'pass'=>$exploded_data[1]));
                }
            }
            
            $tmp=$this->load_hash_db($hash,"sha256");
            if($tmp!==false)
            {
                foreach($tmp as $entry)
                {
                    $exploded_data=explode(":",$entry,2);
                    array_push($result_search,array('type'=>"sha256",'hash'=>$exploded_data[0],'pass'=>$exploded_data[1]));
                }
            }

            
        }
        
        
         if($hash_length>32 && $hash_length<=40)
         {
            $tmp=$this->load_hash_db($hash,"sha1");
            if($tmp!==false)
            {
                foreach($tmp as $entry)
                {
                    $exploded_data=explode(":",$entry,2);
                    array_push($result_search,array('type'=>"sha1",'hash'=>$exploded_data[0],'pass'=>$exploded_data[1]));
                }
            }
            $tmp=$this->load_hash_db($hash,"sha256");
            if($tmp!==false)
            {
                foreach($tmp as $entry)
                {
                    $exploded_data=explode(":",$entry,2);
                    array_push($result_search,array('type'=>"sha256",'hash'=>$exploded_data[0],'pass'=>$exploded_data[1]));
                }
            }
            
            
         }
         
         if($hash_length>40)
         {

            $tmp=$this->load_hash_db($hash,"sha256");
            if($tmp!==false)
            {
                foreach($tmp as $entry)
                {
                    $exploded_data=explode(":",$entry,2);
                    array_push($result_search,array('type'=>"sha256",'hash'=>$exploded_data[0],'pass'=>$exploded_data[1]));
                }
            }
         }
        
        
        return $result_search;
        
    }


    public function search(Request $request,$hash,$ext="json")
    {

        if(!preg_match('/^[A-Fa-f0-9]{32,64}$/', $hash))
        {
             if($ext=="json" || ($request->expectsJson() && $ext!=="txt")) 
            {
                return response()->json("Invalid hash", status:500); 
            }
            return response("Invalid hash",status:500)->header('Content-Type', "text/plain");
        }
        $hash_length=strlen($hash);
        if($hash_length!==64 && $hash_length!==40 && $hash_length!==32)
        {
             if($ext=="json" || ($request->expectsJson() && $ext!=="txt")) 
            {
                return response()->json("Invalid hash size", status:500); 
            }
            return response("Invalid hash size",status:500)->header('Content-Type', "text/plain");

        }
        $prefix=strtolower($hash);

        

        $result_search=$this->db_search($hash);
        if(empty($result_search))
        {
            if($ext=="json" || ($request->expectsJson() && $ext!=="txt")) 
            {
                return response()->json($result_search, status:404); 
            }
            return response("",status:404)->header('Content-Type', "text/plain");
        }            
        
        
        
        
        if($ext=="json" || ($request->expectsJson() && $ext!=="txt")) 
        {
            return response()->json($result_search[0], 200);      
        } 
        $txt_data="";
        foreach($result_search as $entry)
        {
 
            $txt_data.=$entry['type'].";".$entry['hash'].";".$entry['pass'].PHP_EOL;
            break;
        }
            

        return response( $txt_data, 200)->header('Content-Type', "text/plain");
        
    }



    public function getRange(Request $request,$prefix,$ext="json")
    {

        if(!preg_match('/^[A-Fa-f0-9]{6,64}$/', $prefix))
        {
             if($ext=="json" || ($request->expectsJson() && $ext!=="txt")) 
            {
                return response()->json("Invalid prefix", status:500); 
            }
            return response("Invalid prefix",status:500)->header('Content-Type', "text/plain");
        }



        $type=strtolower($request->input('type', 'md5'));
        $passOnly=false;
        $hashOnly=false;
        if( $type!='md5' && $type!='ntlm' && $type!='sha1' && $type!='sha256' )
        {
            $type='md5';
        }

        if($request->input('filter')=="pass")
        {
               $passOnly=true;
        }
        if($request->input('filter')=="hash")
        {
               $hashOnly=true;
        }

        
         if(!$this->isHexString($prefix))return response()->json(['error' => 'Invalid prefix, must contain only chars 0123456789abcdef'], 500);
        
        if(strlen($prefix)<5)return response()->json(['error' => 'Invalid prefix, must be at least 5 chars long'], 500);
        if($type=="md5" || $type=="ntlm")
            if(strlen($prefix)>32)return response()->json(['error' => 'Invalid prefix, must be less than 32 chars long'], 500);
        
        if($type=="sha1")
            if(strlen($prefix)>40)return response()->json(['error' => 'Invalid prefix, must be less than 40 chars long'], 500);

        if($type=="sha256")
            if(strlen($prefix)>64)return response()->json(['error' => 'Invalid prefix, must be less than 64 chars long'], 500);
       
        $prefix=strtolower($prefix);
        $content=$this->load_hash_db($prefix,$type);
       
        if(empty($content))
        {
            if($ext=="json" || ($request->expectsJson() && $ext!=="txt")) 
            {
                return response()->json($content, status:404); 
            }
            return response(status:404)->header('Content-Type', "text/plain");
        }            
        
        $result_content=array();

        
        
        if(($passOnly==TRUE && $hashOnly==TRUE) || ($passOnly==FALSE && $hashOnly==FALSE))
        {
            if($ext=="json" || ($request->expectsJson() && $ext!=="txt")) 
            {
               $json_data=array();
               foreach($content as $entry)
               {
                    if(strpos($entry, ":")===false)continue;
                    $exploded_data=explode(":",$entry,2);
                    array_push($json_data,array("hash"=>$exploded_data[0],"pass"=>$exploded_data[1]));
               }
                return response()->json($json_data, 200);
            }
            else
            {
                return response(implode(PHP_EOL, $content), 200)->header('Content-Type', "text/plain");
            }
        }
        
        
        if(($passOnly==TRUE && $hashOnly==FALSE) )
        {
            if($ext=="json" || ($request->expectsJson() && $ext!=="txt")) 
            {
               $json_data=array();
               foreach($content as $entry)
               {
                    if(strpos($entry, ":")===false)continue;
                    $exploded_data=explode(":",$entry,2);
                    array_push($json_data,array("pass"=>$exploded_data[1]));
               }
                return response()->json($json_data, 200);
            }
            else
            {
                $txt_data="";
               foreach($content as $entry)
               {
                    if(strpos($entry, ":")===false)continue;
                    $exploded_data=explode(":",$entry,2);
                    $txt_data.=$exploded_data[1].PHP_EOL;
               }
                
                
                
                return response( $txt_data, 200)->header('Content-Type', "text/plain");
            }
        }
        
        if(($passOnly==FALSE && $hashOnly==TRUE) )
        {
            if($ext=="json" || ($request->expectsJson() && $ext!=="txt")) 
            {
               $json_data=array();
               foreach($content as $entry)
               {
                    if(strpos($entry, ":")===false)continue;
                    $exploded_data=explode(":",$entry,2);
                    array_push($json_data,array("hash"=>$exploded_data[0]));
               }
                return response()->json($json_data, 200);
            }
            else
            {
                $txt_data="";
               foreach($content as $entry)
               {
                    if(strpos($entry, ":")===false)continue;
                    $exploded_data=explode(":",$entry,2);
                    $txt_data.=$exploded_data[0].PHP_EOL;
               }
                
                
                
                return response($txt_data, 200)->header('Content-Type', "text/plain");
            }
        }
        
        
    }
    
    
    


    
    
    
    
    
    
    

    
    

    
    
    
    
    
    
    
    
    
    
    
    
}
