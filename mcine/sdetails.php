<?php
// header("Content-type: text/xml; charset=utf-8");
// header("Content-type: text/plain; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");

$url=urldecode($_POST["u"]);

if(!$url){$url='http://m.cinema.com.my/movies/content.aspx?search=2015.9977.themartians.21373';}
//Code to access YQL using PHP
$yql_query = "select * from html where url='".$url."' and xpath='//*[@id=\"container\"]/div[5]'";
// $result=var_dump(getResultFromYQL(sprintf($yql_query, $value)));
$result = getResultFromYQL(sprintf($yql_query),'store%3A%2F%2Fdatatables.org%2Falltableswithkeys');
$result = str_replace("&#xd;","",$result);
$result = preg_replace("/<input[^>]+\>/i", "", $result);
$result= str_replace("<div id=\"accordion\">","<div id=\"accordion\" data-role=\"collapsible\" data-collapsed=\"true\" data-theme=\"b\">",$result);
$result= str_replace("<div id=\"ShowtimesList\">","<div id=\"ShowtimesList\" data-role=\"collapsible\" data-collapsed=\"false\" data-theme=\"b\">",$result);
$result= str_replace("<hr/>","",$result);
$result= str_replace("src=\"http://www.cinema.com.my/","src=\"sposter.php?f=",$result);

echo $result;

// $yql_query = "select * from html where url='".$url."' and xpath='//table[3]//tr[3]//tbody//td//span'";
// $result=var_dump(getResultFromYQL(sprintf($yql_query, $value)));
// $result2 = getResultFromYQL(sprintf($yql_query),'store%3A%2F%2Fdatatables.org%2Falltableswithkeys');

// echo json_encode($stack);
// echo "[".$result.",".$result2."]";

//==================================================================================================================================================

function getResultFromYQL($yql_query, $env = '') {
    $yql_base_url = "http://query.yahooapis.com/v1/public/yql";
    $yql_query_url = $yql_base_url . "?q=" . urlencode($yql_query);
    $yql_query_url .= "&format=xml";

    if ($env != '') {
        $yql_query_url .= '&env=' . urlencode($env);
    }

	//$yql_query_url = urlencode($yql_query_url);
	// echo $yql_query_url;

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
