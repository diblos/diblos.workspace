<?php
/* SERVER2CLIENT : SERVER */
define("KB", 1024, true);
define("MB", 1048576, true);
define("SOURCE_PATH","C:/Users/lenovo/Desktop/workspace/4me/@work/forDeploy/files/20170113/final/",true);
define("FILENAME","ContactlessCard.bin",true);
$address = "127.0.0.1";
$port = "10000";
$nsize = 500*KB;

//require('..\lib.php');//HERE WIN
require('../lib.php');//HERE LINUX

$mysock = socket_create(AF_INET,SOCK_STREAM,SOL_TCP);

socket_bind($mysock,$address,$port);

socket_listen($mysock,5);

echo "Waiting for a client...\n";

$client = socket_accept($mysock);

echo "Server started\n";

$input = socket_read($client,$nsize);
if($input!==false && !empty($input)){
  echo "-----------------------------------------".PHP_EOL;

  $file = file_get_contents(SOURCE_PATH.FILENAME);

  $checksum = CRCfile(SOURCE_PATH.FILENAME);
  $response = $checksum."|".FILENAME;

  // DISPLAY OUTPUT  BACK TO CLIENT
  socket_write($client, $response);

  // READ RESPONSE
  $input = socket_read($client,$nsize);
  if(($input!==false && !empty($input))&&($input==ACK)){
      echo "Sending file content...".PHP_EOL;
      socket_write($client, $file);
  }

}else{
  echo "wrong input: ".serialize($input).PHP_EOL;
}



socket_close($client);
socket_close($mysock);

echo "Server ending...\n";
?>
