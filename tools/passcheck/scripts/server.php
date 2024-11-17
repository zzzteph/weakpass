<?php

/*
This is a **very** example on how RANGE api can work with /DB/hashes data.

Please do not consider it as a production script


To run the script, use 

php -S IP:8000 server.php


curl IP/api/v1/range/ffe4ac?type=ntlm

*/
function get_file($file)
{
    if (!file_exists($file)) return false;
    $handle = fopen($file, "r");
    $result_data = array();
    if ($handle)
    {
        while (($line = fgets($handle)) !== false)
        {
            $line = rtrim($line);
            if (strlen($line) == 0) continue;
            array_push($result_data, $line);
        }

        fclose($handle);
    }

    return $result_data;

}

function load_hash_db($prefix, $type)
{
    $path = getcwd()."/db/hashes/";
    $folder1 = substr($prefix, 0, 2);
    $folder2 = substr($prefix, 2, 2);
    $file = substr($prefix, 4, 2); 
    $path = getcwd()."/db/hashes/" . $folder1 . "/" . $folder2 . "/" . $file . "_" . $type;
    return get_file($path);
}
 

$requestUri = strtok($_SERVER['REQUEST_URI'], '?');
$scriptName = $_SERVER['SCRIPT_NAME'];

$segments = explode('/', trim($requestUri, '/'));

// /api/v1/range/PREFIX
var_dump($_SERVER['REQUEST_URI']);
if (count($segments) == 4 && $segments[0] === 'api' && $segments[1] === 'v1' && $segments[2] === 'range') {
    $prefix = $segments[3];

    var_dump($prefix);
    if (!preg_match('/^[A-Fa-f0-9]{6}$/', $prefix)) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid prefix"]);
        exit;
    }


    $type = strtolower($_GET['type'] ?? 'md5');
    if (!in_array($type, ['md5', 'ntlm', 'sha1', 'sha256'])) {
        $type = 'md5';
    }

    $prefix = strtolower($prefix);
    $content = load_hash_db($prefix, $type);

    if (empty($content)) {
        http_response_code(404);
        echo json_encode(["error" => "No matching hash found"]);
        exit;
    }
    $json_data = array();
    foreach ($content as $entry) {
        if (strpos($entry, ":") === false) continue;
        $exploded_data = explode(":", $entry, 2);
        $json_data[] = [
            "hash" => $exploded_data[0],
            "pass" => $exploded_data[1]
        ];
    }

    http_response_code(200);
    header('Content-Type: application/json');
    echo json_encode($json_data);

} else {
    http_response_code(404);
    echo json_encode(["error" => "Not Found"]);
}