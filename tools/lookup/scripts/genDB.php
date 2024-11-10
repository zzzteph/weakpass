<?php
/*
Prefix DB-tree generator

*/

function prepare_db($file, $path, $type)
{
    $handle = fopen($file, "r");
    $prefix = "";
    $prefix_file = false;

    if ($handle)
    {
        while (($line = fgets($handle)) !== false)
        {
            $tmp_prefix = substr($line, 0, 6);
            if ($tmp_prefix !== $prefix)
            {
                if ($prefix_file) fclose($prefix_file);
                $folder1 = substr($tmp_prefix, 0, 2);
                $folder2 = substr($tmp_prefix, 2, 2);
                $file = substr($tmp_prefix, 4, 2);

                if (!file_exists($path . "/hashes/")) mkdir($path . "/hashes/");
                if (!file_exists($path . "/hashes/" . $folder1)) mkdir($path . "/hashes/" . $folder1);
                if (!file_exists($path . "/hashes/" . $folder1 . "/" . $folder2)) mkdir($path . "/hashes/" . $folder1 . "/" . $folder2);
                $result_path = $path . "/hashes/" . $folder1 . "/" . $folder2 . "/" . $file . "_" . $type;

                $prefix_file = fopen($result_path, 'a+w');
                $prefix = $tmp_prefix;
            }
            fwrite($prefix_file, $line);

        }
        fclose($handle);
    }
    if ($prefix_file) fclose($prefix_file);
}

echo "File to proceed with:" . $argv[1] . PHP_EOL;
echo "DB path:" . $argv[2] . PHP_EOL;
echo "Type:" . $argv[3] . PHP_EOL;

prepare_db($argv[1], $argv[2], $argv[3]);

