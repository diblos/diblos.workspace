<?php
header("Content-type: image/png");

$f = array_key_exists('f', $_GET) ? $_GET['f'] : '';
$w = array_key_exists('w', $_GET) ? $_GET['w'] : 150;
$h = array_key_exists('h', $_GET) ? $_GET['h'] : 150;
$p = array_key_exists('p', $_GET) ? $_GET['p'] : 'true';

//echo $f;

@functionName($w,$h,$p);
//functionName($w,$h,$p);

function functionName($w,$h,$p) {

$im = file_get_contents($f);
if($im===false){$im = file_get_contents('inc/images/logo.png');}//default image

//$userImage64 = base64_encode($im);   
// Decode base64 encoded image into Image
//$imgDecoded = base64_decode($userImage64);

$imgDecoded = $im;

// Requires string image as parm, returns image resource
$im = imagecreatefromstring($imgDecoded);

// Get width and height of original image resource
$origWidth = imagesx($im);
$origHeight = imagesy($im);

if($p==='true'){
	$h=$w*$origHeight/$origWidth;
}


// Create new destination image resource for new 24 x 24 image
//$imNew = imagecreatetruecolor(24, 24);
$imNew = imagecreatetruecolor($w, $h);

// Re-sample image to smaller size and display
imagecopyresampled($imNew, $im, 0, 0, 0, 0, $w, $h, $origWidth, $origHeight);
imagepng($imNew);
imagedestroy($im);
imagedestroy($imNew);
} 

?>