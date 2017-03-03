<?php
/* SERVER */
$address = "127.0.0.1";
$port = "10000";
 
$mysock = socket_create(AF_INET,SOCK_STREAM,SOL_TCP);

socket_bind($mysock,$address,$port);

socket_listen($mysock,5);

echo "Waiting for a client...\n";

$client = socket_accept($mysock);

echo "Server started\n";

$file = ''; // <-- this is 2 apostrophies by the way
sleep(2);
$input = socket_read($client,2048);
while(!feof($input)){
  $file .= $input;
  $input = socket_read($client,2048);
}

file_put_contents('favicon.bmp',$file);

socket_close($client);

socket_close($mysock);

echo "Server ending...\n";
?>