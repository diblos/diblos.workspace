<?php
// header("Content-type: aplication/json; charset=utf-8");
header("Content-type: text/plain; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");

class Camera {
        public $name = "";
        public $link  = "";
}

$stack = array();

 // if(!isset($_POST[$u]) || empty($_POST[$u])) {		
	$url=urldecode($_POST["u"]);
	// // $url='http://m.llm.gov.my/TrafficImages.aspx?highwayCode=KSA';
// }else{
	// $url='http://m.llm.gov.my/TrafficImages.aspx?highwayCode=KSA';
// }

if(!$url){$url='http://m.llm.gov.my/TrafficImages.aspx?highwayCode=KSA';}

//Code to access YQL using PHP
$yql_query = "select * from html where url='".$url."' and xpath='//table[3]//tr[3]//tbody//td//span'";
// echo $yql_query;
// $result=var_dump(getResultFromYQL(sprintf($yql_query, $value)));
$result = getResultFromYQL(sprintf($yql_query),'store%3A%2F%2Fdatatables.org%2Falltableswithkeys');
// var_dump($result);
//==================================================================================================================================================

if (is_array($result) || is_object($result))
{	
    foreach ($result->query->results->span as $data)
    {
		$cam = new Camera();
		$cam->name=$data->content;
        // echo "<p>".$data->content."</p>";
		array_push($stack,$cam);
    }	
}

// print_r($stack);

$yql_query = "select * from html where url='".$url."' and xpath='//table[3]//tr[3]//tbody//td//img[@height=\"120px\"]'";
// echo $yql_query;
// $result=var_dump(getResultFromYQL(sprintf($yql_query, $value)));
$result2 = getResultFromYQL(sprintf($yql_query),'store%3A%2F%2Fdatatables.org%2Falltableswithkeys');
if (is_array($result2) || is_object($result2))
{
	for ($x = 0; $x < count($result2->query->results->img); $x++) {
		$stack[$x]->link = $result2->query->results->img[$x]->src;
	} 	
}

//print_r($stack);

echo json_encode($stack);

//==================================================================================================================================================

function getResultFromYQL($yql_query, $env = '') {
    $yql_base_url = "http://query.yahooapis.com/v1/public/yql";
    $yql_query_url = $yql_base_url . "?q=" . urlencode($yql_query);
    $yql_query_url .= "&format=json";
	
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
    return json_decode($json);
}
?>