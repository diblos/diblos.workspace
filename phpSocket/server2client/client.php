<?php
/* SERVER2CLIENT : CLIENT */
define("KB", 1024, true);
define("MB", 1048576, true);
define("DESTINATION_PATH","C:/Users/lenovo/Documents/GitHub/workspace/phpSocket/server2client/",true);
$address = "127.0.0.1";
$port = 10000;
$nsize = 500*KB;

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

socket_write($socket,"GET");// <-- First Command for requesting file.

$file = ''; // <-- this is 2 apostrophies by the way

$input = socket_read($socket,$nsize);
$tmp = explode("|",$input);

if ((isset($tmp))&&(count($tmp)==2)){
    $checksum = $tmp[0];
    $filename = $tmp[1];
    echo "CRC : $checksum, Filename : $filename".PHP_EOL;
    socket_write($socket,ACK);

    // FILE TRANSMISSION PROCESS START
    // $input = socket_read($socket,$nsize);
    // file_put_contents(DESTINATION_PATH.$filename,$input);


    // echo fwrite($file,"Hello World. Testing!");




    $file = fopen(DESTINATION_PATH.$filename,"w");
    // while (false !== ($bytes = socket_recv($socket, $buf, CHUNK_SIZE, MSG_WAITALL))) {
    while (false !== ($bytes = socket_recv($socket, $buf, 4000, MSG_WAITALL))) {
        echo "Read $bytes bytes from socket_recv()...".PHP_EOL;
        echo (socket_strerror(socket_last_error($socket)).PHP_EOL);
        fwrite($file,$buf,$bytes);
        // sleep(1);
        socket_write($socket,ACK);
    }
    fclose($file);



    // FILE TRANSMISSION PROCESS END

    if( CRCfile(DESTINATION_PATH.$filename) == $checksum ){
      echo "checksum success.".PHP_EOL;
    }else{
      echo "checksum failed.".PHP_EOL;
      unlink(DESTINATION_PATH.$filename);
    }
}else {
    socket_write($socket,NACK);
}

echo "Closing socket...";
socket_close($socket);


?>
