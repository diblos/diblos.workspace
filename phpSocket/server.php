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


$tmp = explode("|",$input);
$checksum = crc32($tmp[1]);
echo "CRC: $checksum".PHP_EOL;
echo "$tmp[1]".PHP_EOL;
if ($tmp[0]==$checksum){
  $file = base64_decode($tmp[1]);

  // while(!feof($input)){
  //   $file .= $input;
  //   $input = socket_read($client,$nsize);
  // }

  file_put_contents('destination\i.bmp',$file);
  // file_put_contents('destination\i.bin',$file);
}

socket_close($client);
socket_close($mysock);

echo "Server ending...\n";
?>
