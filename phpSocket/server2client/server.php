<?php
/* SERVER2CLIENT : SERVER */
define('SOCKET_READ_TIMEOUT',60);
define("KB", 1024, true);
define("MB", 1048576, true);
define("SOURCE_PATH","C:/Users/lenovo/Desktop/workspace/4me/@work/forDeploy/files/20170113/final/",true);
define("FILENAME","ContactlessCard.bin",true);
$address = "127.0.0.1";
$port = 10000;
$nsize = 500*KB;

//require('..\lib.php');//HERE WIN
require('../lib.php');//HERE LINUX

$mysock = socket_create(AF_INET,SOCK_STREAM,SOL_TCP);
// if(!socket_set_option($sock, SOL_SOCKET, SO_REUSEADDR, 1)){echo 'Unable to set SO_REUSEADDR option on socket: '.socket_strerror(socket_last_error()).PHP_EOL;};
// if(!socket_set_option($sock,SOL_SOCKET, SO_RCVTIMEO, array("sec"=>SOCKET_READ_TIMEOUT, "usec"=>0))){echo 'Unable to set SO_RCVTIMEO option on socket: '.socket_strerror(socket_last_error()).PHP_EOL;};

socket_bind($mysock,$address,$port);

socket_listen($mysock,5);

echo "Waiting for a client...\n";

$client = socket_accept($mysock);

echo "Server started\n";

$input = socket_read($client,$nsize);
if($input!==false && !empty($input)){
  echo "-----------------------------------------".PHP_EOL;

  echo "<< $input".PHP_EOL;

  // =============================================================================
  // $checksum = CRCfile(SOURCE_PATH.FILENAME);// CRC 16
  // -----------------------------------------------------------------------------
  $checksum = md5_file(SOURCE_PATH.FILENAME);// MD5 HASH
  // =============================================================================
  $response = $checksum."|".FILENAME."|".filesize(SOURCE_PATH.FILENAME);
  // DISPLAY OUTPUT  BACK TO CLIENT
  echo ">> $response".PHP_EOL;
  socket_write($client, $response);

  // READ RESPONSE
  $input = socket_read($client,$nsize);
  var_dump($input);

  if(($input!==false || !empty($input))&&($input==ACK)){

      echo "sending file ".FILENAME.PHP_EOL;
      // FILE TRANSMISSION PROCESS START
      if (file_exists(SOURCE_PATH.FILENAME)) {
          $fp = fopen(SOURCE_PATH.FILENAME,"r") ;
          if ($fp!==false){
  							$total = 0;
                $TCP_ERR = false;
                while (! feof($fp)) {
					       		$buff = fread($fp,CHUNK_SIZE);
					       		echo "sending a block of ".FILENAME." [" . strlen($buff) ."]".PHP_EOL;
					       		$total+=strlen($buff);

                    // $csm = crc16($buff);
                    // $buffc = pack($csm,$buff);

                    // echo strlen($buff).">>".strlen($buffc).PHP_EOL;

					       		socket_write($client, $buff);

                    // READ RESPONSE
                    $input = socket_read($client,$nsize);
                    switch ($input) {
                        case ACK:
                            // RECEIVE ACK & PROCEED TO NEXT PACKET
                            echo("Acknowledged!".PHP_EOL);
                            $TCP_ERR = false;
                            break;
                        case NACK:
                            // RECEIVE NACK & RESEND CURRENT PACKET
                            echo("Not Acknowledged!".PHP_EOL);
                            $TCP_ERR = false;
                            break;
                        default:
                            // ERROR: EXIT LOOP & OTA PROCESS
                            echo("Invalid Response!".PHP_EOL);
                            $TCP_ERR = true;
                    }

				       	}
				       	echo "have sent $total bytes".PHP_EOL;
				       	fclose($fp);
                socket_write($client, null);
					}

      }
      // FILE TRANSMISSION PROCESS END

  }

}else{
  echo "wrong input: ".serialize($input).PHP_EOL;
}
sleep(10);
socket_close($client);
socket_close($mysock);

echo "Server ending...\n";
?>
