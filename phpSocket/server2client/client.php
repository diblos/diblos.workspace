<?php
/* SERVER2CLIENT : CLIENT */
require('../lib.php');

define("DESTINATION_PATH","C:/Users/lenovo/Documents/GitHub/workspace/phpSocket/server2client/",true);
$address = "127.0.0.1";$port = 10000;
// $address = "rdp.seamcloud.com";$port = 33223;

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
$command_str = "OTA:2{s:3:DEV;s:16:0001010053415931;}";
// $command_str = "OTA:2{s:3:DEV;s:3:123;}";

socket_write($socket,$command_str);// <-- First Command for requesting file.

$file = ''; // <-- this is 2 apostrophies by the way

$input = socket_read($socket,$nsize);
$tmp = explode("|",$input);

if ((isset($tmp))&&(count($tmp)==4)){// HARDCODED STRING SIZE
    $checksum = $tmp[0];
    $filename = $tmp[1];
    $filesize = $tmp[2];
    $chunkcount = $tmp[3];
    echo "CRC : $checksum, Filename : $filename, Filesize : $filesize, Chunks count : $chunkcount".PHP_EOL;

    //socket_write($socket,ACK);

    $dataleft = $filesize;
    $chunksize = CHUNK_SIZE;
    // FILE TRANSMISSION PROCESS START
    $file = fopen(DESTINATION_PATH.$filename,"w");

    for ($i=1; $i <= $chunkcount ; $i++){
        echo ">> PROP|$i".PHP_EOL;
        socket_write($socket,"PROP|$i");// REQUEST CHUNK PROPERTY
        $input = socket_read($socket,$nsize);
        echo "<< $input".PHP_EOL;
        $tmp = explode("|",$input);
        if ((isset($tmp))&&(count($tmp)==2)){// HARDCODED STRING SIZE
            $chunksize = $tmp[0];
            $chunkcrc = $tmp[1];
            $RETRY = true;
            while($RETRY){
                  socket_write($socket,"GET|$i");// REQUEST CHUNK DATA

                  $bytes = socket_recv($socket, $buf, $chunksize, MSG_WAITALL);
                  echo "Read $bytes bytes from socket_recv()...".PHP_EOL;
                  echo (socket_strerror(socket_last_error($socket)).PHP_EOL);

                  //SANITY CHECKING
                  if(psCheckSum($buf)==$chunkcrc){
                    $fwrite = fwrite($file,$buf,$bytes);
                    $dataleft = $dataleft - $fwrite;

                    echo("Data left: $dataleft".PHP_EOL);
                    $RETRY=false;
                  }else{
                    echo("checksum mismatched! Retrying...".PHP_EOL);
                  }

            }

        }
    }
    fclose($file);
    // FILE TRANSMISSION PROCESS END
    // =============================================================================
    // $lchecksum = CRCfile(DESTINATION_PATH.$filename);$lchecksumtype='crc16';// CRC 16
    // -----------------------------------------------------------------------------
    $lchecksum = md5_file(DESTINATION_PATH.$filename);$lchecksumtype='md5';// MD5 HASH
    // =============================================================================

    if( $lchecksum == $checksum ){
      echo "$lchecksumtype checksum success.".PHP_EOL;
      // echo($lchecksum).PHP_EOL);
      // echo(crc16("0123456789").PHP_EOL);
    }else{
      echo "$lchecksumtype checksum failed.".PHP_EOL;
      unlink(DESTINATION_PATH.$filename);
    }
}else {
    echo "send NACK!".PHP_EOL;
    socket_write($socket,NACK);
}

echo "Closing socket...";
socket_close($socket);


?>
