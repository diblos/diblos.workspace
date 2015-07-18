<?php
//header("Content-type: text/xml");

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

echo "<?xml version=\"1.0\" encoding=\"ISO-8859-1\"?>\n";
echo "<members>\n";
echo "<desc>\n";

for ($x=0; $x<10; $x++)
  {
  //echo "Reply From ".$MyDomain." : time=".ping($MyDomain, 80, 10)." TTL=57\n";
  //$tmpPing=ping($MyDomain, 80, 10);
  $tmpPing=ping($MyDomain, 80, 1);
  if($tmpPing=="down")
  {
	$statistic+=1;
	echo "Request timed out.\n";
  }else{
	echo "Reply From ".$MyDomain." : time=".$tmpPing.".\n";
  }  
  } 

echo "</desc>\n";
echo "<summary>Ping statistics (".($statistic*100/10)."% loss)</summary>\n";
echo "<status>";

if (pingDomain($MyDomain)==-1)
  {
  echo "OFFLINE";
  }else{
  echo "ONLINE";
  }
echo "</status>\n";
echo "</members>\n";

?>