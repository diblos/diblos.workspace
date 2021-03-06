<?php
// header("Content-type: aplication/json; charset=utf-8");
header("Content-type: text/plain; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");

$url='http://dbklpgis.scadatron.net/dbklpgisd1.xml';
//Code to access YQL using PHP
// $yql_query = "select * from xml where url='".$url."' and itemPath=\"//PGIS/MALL\"";
$yql_query = "select MALL from xml where url='".$url."' and MALL.ID<>'M0'";
 
$result = getResultFromYQL(sprintf($yql_query),'store%3A%2F%2Fdatatables.org%2Falltableswithkeys');

echo $result;

function getResultFromYQL($yql_query, $env = '') {
    $yql_base_url = "http://query.yahooapis.com/v1/public/yql";
    $yql_query_url = $yql_base_url . "?q=" . urlencode($yql_query);
    $yql_query_url .= "&format=json";

    if ($env != '') {
        $yql_query_url .= '&env=' . urlencode($env);
    }

    $session = curl_init($yql_query_url);
    curl_setopt($session, CURLOPT_RETURNTRANSFER, true);
    //Uncomment if you are behind a proxy
    //curl_setopt($session, CURLOPT_PROXY, 'Your proxy url');
    //curl_setopt($session, CURLOPT_PROXYPORT, 'Your proxy port');
    //curl_setopt($session, CURLOPT_PROXYUSERPWD, 'Your proxy password');
    $json = curl_exec($session);
    curl_close($session);
    // return json_decode($json);
    return $json;
}
?>
