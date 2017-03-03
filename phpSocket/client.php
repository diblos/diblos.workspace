<?php
/* CLIENT */
$address = "127.0.0.1";
$port = 10000;

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

$file = file_get_contents('favicon.ico');

socket_write($socket,$file);

echo "Closing socket...";
socket_close($socket);
?>