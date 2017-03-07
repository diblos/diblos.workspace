<?php
/* SERVER2CLIENT : SERVER */
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

$input = socket_read($client,$nsize);
if($input!==false && !empty($input)){
  echo "-----------------------------------------".PHP_EOL;

  // $file = file_get_contents('..\source\favicon.ico');
  $file = file_get_contents('..\source\h2scpi.bin');
  $checksum = crc32(base64_encode($file));

  echo "CRC : ".$checksum.PHP_EOL;

  $response = $checksum."|".base64_encode($file);
  // DISPLAY OUTPUT  BACK TO CLIENT
  sleep(1);
  socket_write($client, $response);

}else{
  echo "wrong input: ".serialize($input).PHP_EOL;
}


socket_close($client);
socket_close($mysock);

echo "Server ending...\n";
?>
