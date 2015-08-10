<?php
$url = 'http://dbklpgis.scadatron.net/dbklpgisd1.xml';
// $xml = new SimpleXMLElement($url, null, true);
// echo $xml->results->quote[0]->AskRealtime;
// print_r($xml);

$contents = file_get_contents($url);
print_r($contents);
?>