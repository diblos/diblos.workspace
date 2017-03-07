<?php
/* SERVER2CLIENT : CLIENT */
define("KB", 1024, true);
define("MB", 1048576, true);
$address = "127.0.0.1";
$port = 10000;
$nsize = 500*KB;

$socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
if ($socket === false) {
    echo "socket_create() failed: reason: " . socket_strerror(socket_last_error()) . "\n";
} else {
    echo "socket successfully created.\n";
}

echo "Attempting to connect to '$address' on port '$port'...";
$result = socket_connect($socket, $address, $port);
if ($result === false) {
    echo "socket_connect() failed.\nReason: ($result) " . socket_strerror(socket_last_error($socket)) . "\n";
} else {
    echo "successfully connected to $address.\n";
}

socket_write($socket,"GET");

$file = ''; // <-- this is 2 apostrophies by the way
// sleep(2);
$input = socket_read($socket,$nsize);

$tmp = explode("|",$input);
$checksum = crc32($tmp[1]);

if ($tmp[0]==$checksum){
  echo "$tmp[1]".PHP_EOL;
  echo strlen($tmp[1]).PHP_EOL;
  $file = base64_decode($tmp[1]);

  // file_put_contents('..\destination\i.bmp',$file);
  file_put_contents('..\destination\i.bin',$file);
}
echo "CRC: $checksum".PHP_EOL;

echo "Closing socket...";
socket_close($socket);
?>
