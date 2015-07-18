<?php

$pwd = 'nPing';
$html = '<a href="http://example.com" rel="nofollow external">test</a>';
$dom = new DOMDocument;

//$dom->loadHTML($html);
$dom->loadHTMLFile("nPing/index.htm");

$xpath = new DOMXPath($dom);
$nodes = $xpath->query("//link");
foreach($nodes as $node) {
    $nStr = $node->getAttribute('href');
	if(strpos($nStr, 'http') === false){$node->setAttribute('href', $pwd . "/" . $nStr);};
}

$nodes = $xpath->query("//script");
foreach($nodes as $node) {
    $nStr = $node->getAttribute('src');
	if(strpos($nStr, 'http') === false){
		if($nStr!=""){
		$node->setAttribute('src', $pwd . "/" . $nStr);
		}
	}
	
	$nTxt = $node->nodeValue;
	$node->nodeValue = str_replace('nPing.php','nPing/nPing.php',$nTxt);	
}

echo $dom->saveHTML();

?>