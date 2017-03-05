<?php
/* SERVER */
define("KB", 1024, true);
define("MB", 1048576, true);
$address = "127.0.0.1";
$port = "10000";

$nsize = 500*KB;

$mysock = socket_create(AF_INET,SOCK_STREAM,SOL_TCP);

socket_bind($mysock,$address,$port);

socket_listen($mysock,5);

echo "Waiting for a client...\n";

$client = socket_accept($mysock);

echo "Server started\n";

$file = ''; // <-- this is 2 apostrophies by the way
//sleep(2);
$input = socket_read($client,$nsize);
echo "$input".PHP_EOL;

$checksum = crc32($input);
echo "CRC: $checksum".PHP_EOL;

$file = base64_decode($input);

// while(!feof($input)){
//   $file .= $input;
//   $input = socket_read($client,$nsize);
// }

// file_put_contents('destination\i.bmp',$file);
file_put_contents('destination\i.bin',$file);
// fwrite($file, '23');
// fclose($file);

socket_close($client);
socket_close($mysock);

echo "Server ending...\n";
?>
