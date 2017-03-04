<?php
/* SERVER */
$address = "127.0.0.1";
$port = "10000";
 
$nsize = 2048;
//$nsize = 17500;
 
$mysock = socket_create(AF_INET,SOCK_STREAM,SOL_TCP);

socket_bind($mysock,$address,$port);

socket_listen($mysock,5);

echo "Waiting for a client...\n";

$client = socket_accept($mysock);

echo "Server started\n";

$file = ''; // <-- this is 2 apostrophies by the way
//sleep(2);
$input = socket_read($client,$nsize);
//echo "$input";

//$input = base64_decode($str);

while(!feof($input)){
  $file .= $input;
  $input = socket_read($client,$nsize);
}

file_put_contents('favicon.bmp',$file);
// fwrite($file, '23');
// fclose($file);

socket_close($client);
socket_close($mysock);

echo "Server ending...\n";
?>