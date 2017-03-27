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

  $checksum = CRCfile(SOURCE_PATH.FILENAME);
  $response = $checksum."|".FILENAME;

  // DISPLAY OUTPUT  BACK TO CLIENT
  socket_write($client, $response);

  // READ RESPONSE
  $input = socket_read($client,$nsize);
  if(($input!==false && !empty($input))&&($input==ACK)){

      if (file_exists(SOURCE_PATH.FILENAME)) {
          $fp = fopen(SOURCE_PATH.FILENAME,"r") ;
          if ($fp!==false){
  							$total = 0;
                while (! feof($fp)) {
					       		$buff = fread($fp,CHUNK_SIZE);
					       		echo "sending a block of ".FILENAME." [" . strlen($buff) ."]".PHP_EOL;
					       		$total+=strlen($buff);
					       		socket_write($client, $buff);

                    // READ RESPONSE
                    $input = socket_read($client,$nsize);

				       	}
				       	echo "have sent $total bytes".PHP_EOL;
				       	fclose($fp);
                // socket_write($client, null);
					}


          // echo "Sending file content...".PHP_EOL;
          // FILE TRANSMISSION PROCESS START
          // $file = file_get_contents(SOURCE_PATH.FILENAME);
          // socket_write($client, $file);
          // FILE TRANSMISSION PROCESS END
      }

  }

}else{
  echo "wrong input: ".serialize($input).PHP_EOL;
}



socket_close($client);
socket_close($mysock);

echo "Server ending...\n";
?>
