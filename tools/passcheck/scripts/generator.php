<?php

/*
This is a **very** example of script that will generate HASH:PASSWORD database from the input file.
It will not sort the file, for that you can use SORT function. The output folder will be created in the folder you run the script

Please do not consider it as a production script


*/


function ntlm($string)
{
    $utf16lePassword = mb_convert_encoding($string, 'UTF-16LE', 'UTF-8');
    $hash = hash('md4', $utf16lePassword, true);
    $hash = strtolower(bin2hex($hash));
    return $hash;
}

function process_file($inputFile)
{
    $output = getcwd() . "/" . basename($inputFile) . "_output/";
    mkdir($output);
    $handle = fopen($inputFile, "rb");
    if ($handle)
    {
        $ntlm = fopen($output . basename($inputFile) . ".ntlm.txt.tmp", "w");
        $sha1 = fopen($output . basename($inputFile) . ".sha1.txt.tmp", "w");
        $sha256 = fopen($output . basename($inputFile) . ".sha256.txt.tmp", "w");
        $md5 = fopen($output . basename($inputFile) . ".md5.txt.tmp", "w");
        $sha256ntlm = fopen($output . basename($inputFile) . ".sha256.ntlm.txt.tmp", "w");
        $tmp_buffer = array();
        $tmp_length = 0;
        while (($password = fgets($handle)) !== false)
        {
            $password = trim($password);
            array_push($tmp_buffer, $password);
            $tmp_length++;
            if ($tmp_length >= 10241000)
            {
                $tmp_text = "";
                foreach ($tmp_buffer as $entry)
                {
                    $tmp_text .= ntlm($entry) . ":" . $entry . PHP_EOL;
                }
                fwrite($ntlm, $tmp_text);
                unset($tmp_text);

                $tmp_text = "";
                foreach ($tmp_buffer as $entry)
                {
                    $tmp_text .= hash("sha1", $entry) . ":" . $entry . PHP_EOL;
                }
                fwrite($sha1, $tmp_text);
                unset($tmp_text);
                $tmp_text = "";
                foreach ($tmp_buffer as $entry)
                {
                    $tmp_text .= hash("md5", $entry) . ":" . $entry . PHP_EOL;
                }
                fwrite($md5, $tmp_text);

                unset($tmp_text);

                $tmp_text = "";
                foreach ($tmp_buffer as $entry)
                {
                    $tmp_text .= hash("sha256", $entry) . ":" . $entry . PHP_EOL;
                }
                fwrite($sha256, $tmp_text);
                unset($tmp_text);
                $tmp_text = "";
                foreach ($tmp_buffer as $entry)
                {
                    $tmp_text .= hash("sha256", ntlm($entry)) . ":" . $entry . PHP_EOL;
                }
                fwrite($sha256ntlm, $tmp_text);
                unset($tmp_buffer);
                unset($tmp_text);
                $tmp_buffer = array();
                $tmp_length = 0;
                gc_collect_cycles();
            }

        }
        $tmp_text = "";
        foreach ($tmp_buffer as $entry)
        {
            $tmp_text .= ntlm($entry) . ":" . $entry . PHP_EOL;
        }
        fwrite($ntlm, $tmp_text);
        unset($tmp_text);

        $tmp_text = "";
        foreach ($tmp_buffer as $entry)
        {
            $tmp_text .= hash("sha1", $entry) . ":" . $entry . PHP_EOL;
        }
        fwrite($sha1, $tmp_text);
        unset($tmp_text);
        $tmp_text = "";
        foreach ($tmp_buffer as $entry)
        {
            $tmp_text .= hash("md5", $entry) . ":" . $entry . PHP_EOL;
        }
        fwrite($md5, $tmp_text);

        unset($tmp_text);
        $tmp_text = "";
        foreach ($tmp_buffer as $entry)
        {
            $tmp_text .= hash("sha256", $entry) . ":" . $entry . PHP_EOL;
        }
        fwrite($sha256, $tmp_text);
        unset($tmp_text);
        $tmp_text = "";
        foreach ($tmp_buffer as $entry)
        {
            $tmp_text .= hash("sha256", ntlm($entry)) . ":" . $entry . PHP_EOL;
        }
        fwrite($sha256ntlm, $tmp_text);
        unset($tmp_text);

        fclose($ntlm);
        fclose($sha1);
        fclose($sha256);
        fclose($md5);
        fclose($sha256ntlm);
        fclose($handle);
        unset($tmp_buffer);
        unset($tmp_text);
        gc_collect_cycles();

    }
    else
    {
        echo "Failed to open input file.";
    }

}




if ($argc > 1)
{
    $input = $argv[1];
    process_file($input);
    echo "The input argument is: " . $input . PHP_EOL;
}
else
{

    echo "No argument provided. Please provide an argument." . PHP_EOL;
}

