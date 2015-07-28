<?php
function ping($host, $port, $timeout) 
{ 
  $tB = microtime(true); 
  $fP = fSockOpen($host, $port, $errno, $errstr, $timeout); 
  if (!$fP) { return "down"; } 
  $tA = microtime(true); 
  return round((($tA - $tB) * 1000), 0)." ms"; 
}

// Function to check response time
function pingDomain($domain){
    $starttime = microtime(true);
    $file      = fsockopen ($domain, 80, $errno, $errstr, 10);
    $stoptime  = microtime(true);
    $status    = 0;

    if (!$file) $status = -1;  // Site is down
    else {
        fclose($file);
        $status = ($stoptime - $starttime) * 1000;
        $status = floor($status);
    }
    return $status;
}
$statistic = 0;
$tmpPing="";
//Echoing it will display the ping if the host is up, if not it'll say "down".
$MyDomain = "183.171.232.66";

if($_GET['ip']==""){$MyDomain = "183.171.232.66";}else{$MyDomain = $_GET['ip'];};

header("Content-type: aplication/json; charset=utf-8");
//header("Content-type: text/plain; charset=utf-8");
header("Access-Control-Allow-Origin: *");

	echo "{\n";
	echo "\"ip\":\"".$MyDomain."\",\n";
	echo "\"description\":{\n";
for ($x=1; $x<=10; $x++)
  {

  $tmpPing=@ping($MyDomain, 80, 1);
  if($tmpPing=="down")
  {
	$statistic+=1;
	echo "\"response".$x."\":\"Request timed out.\"".($x != 10 ? ",\n" : "");
  }else{
	echo "\"response".$x."\":\"Reply From ".$MyDomain." : time=".$tmpPing.".\"".($x != 10 ? ",\n" : "");
  }  
  } 

	echo "},\n";	
	echo "\"summary\":\"Ping statistics (".($statistic*100/10)."% loss)\",\n";
	echo "\"status\":\"";

if (@pingDomain($MyDomain)==-1)
  {
	echo "OFFLINE";
  }else{
	echo "ONLINE";
  }
	echo "\"\n";
	echo "}";

?>