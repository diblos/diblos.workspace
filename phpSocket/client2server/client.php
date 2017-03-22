<?php
/* CLIENT2SERVER : CLIENT */
$address = "127.0.0.1";
$port = 10000;

//require('..\lib.php');//HERE WIN
require('../lib.php');//HERE LINUX

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

$file = file_get_contents('..\source\favicon.ico');
// $file = file_get_contents('source\h2scpi.bin');

$checksum = crc16(base64_encode($file));
// $checksum = crc32(base64_encode($file));

// socket_write($socket,$file);
socket_write($socket,$checksum."|".base64_encode($file));
echo "CRC: $checksum".PHP_EOL;
// ===============================================
// ob_end_flush(); // Have to flush the buffer first to avoid memory error

// $fp = fopen('favicon.ico',"r") ;

// while (! feof($fp)) {
       // $buff = fread($fp,4096);
       // //print $buff;
	   // socket_write($socket,$buff);
       // }
// ===============================================

echo "Closing socket...";
socket_close($socket);
?>
