<?php
/* SERVER2CLIENT : SERVER */
require('../lib.php');

define('SOCKET_READ_TIMEOUT',60);
define("SOURCE_PATH","C:/Users/lenovo/Desktop/workspace/4me/@work/forDeploy/files/20170113/final/",true);
define("FILENAME","ContactlessCard.bin",true);
$address = "127.0.0.1";
$port = 10000;

$nsize = 500*KB;

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

  $r = new FileTransferObj(SOURCE_PATH.FILENAME);
  $response = $r->md5."|".$r->Filename."|".$r->Filesize."|".$r->NoOfChunks;

  // DISPLAY OUTPUT  BACK TO CLIENT
  echo ">> $response".PHP_EOL;
  socket_write($client, $response);

  if($input!==false || !empty($input)){

      echo "sending file ".$r->Filename.PHP_EOL;
      // FILE TRANSMISSION PROCESS START
      if ($r->Chunks) {
  							$total = 0;
                $ERR_OTA = false;// CONNECTION ERROR & CLIENT RESPONSE UNKNOWN - default: false
                $OTA_ACK = false;// IS CLIENT RESPONSE ACKNOWLEDGE - default: true
                while ((!$OTA_ACK)&&(! $ERR_OTA)) {
                    $input = socket_read($client,$nsize);
                    echo "<< $input".PHP_EOL;
                    $tmp = explode("|",$input);
                    if ((isset($tmp))&&(count($tmp)==2)){// HARDCODED STRING SIZE
                        $request_type = $tmp[0];
                        $chunk_number = $tmp[1];
                        switch ($request_type) {
                            case 'PROP':
                                // CHUNK PROPERTY REQUEST
                                $response = strlen($r->Chunks[$chunk_number-1]->data)."|".$r->Chunks[$chunk_number-1]->checksum2;
                                // DISPLAY OUTPUT  BACK TO CLIENT
                                echo ">> $response".PHP_EOL;
                                socket_write($client, $response);
                                break;
                            case 'GET':
                                // CHUNK DATA REQUEST
            					       		echo "sending block number $chunk_number of ".$r->Filename." [" . strlen($r->Chunks[$chunk_number-1]->data) ."]".PHP_EOL;
                                socket_write($client, $r->Chunks[$chunk_number-1]->data);
            					       		$total+=strlen($r->Chunks[$chunk_number-1]->data);
                                break;
                            default:
                                // ERROR: EXIT LOOP & OTA PROCESS
                                echo("Invalid Request!".PHP_EOL);
                                $ERR_OTA = true;
                        }
                    }else{
                        if($input==ACK){
                            echo("Acknowledged!".PHP_EOL);
                            $OTA_ACK = true;
                        }else{
                            $ERR_OTA = true;
                        }
                    }
				       	}
				       	echo "have sent $total bytes".PHP_EOL;
                //socket_write($client, null);
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
