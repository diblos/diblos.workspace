<?php
// header("Content-type: image/png");
header("Content-type: image/jpeg");

$f = array_key_exists('f', $_GET) ? $_GET['f'] : 'images/movies/2015/7thelastwitchhunter00_450.jpg';
$w = array_key_exists('w', $_GET) ? $_GET['w'] : 400;
$h = array_key_exists('h', $_GET) ? $_GET['h'] : 400;
$p = array_key_exists('p', $_GET) ? $_GET['p'] : 'true';

@functionName($f,$w,$h,$p);
//functionName($w,$h,$p);

function functionName($f,$w,$h,$p) {
$root = 'http://www.cinema.com.my/';
$im = file_get_contents($root.$f);

//if($im===false){$im = file_get_contents('http://m.llm.gov.my/TrafficImages.aspx?ImagePath=HYEC4fuANi4FALhGgLSGmDWAlRFhYuAE7/is8T3p+RNFPZUfEEiGJMPUu7w9ueJlGRBwPvWPhhZaoeEBDuT4iVGbTfB6AGQyPmzGEf3uYcByC8Twlaoubg==');}//default image
if($im===false){$im = file_get_contents('http://www.hdwallpapers.in/walls/need_for_speed_race-wide.jpg');}//default image

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
// imagepng($imNew);
imagejpeg($imNew);
imagedestroy($im);
imagedestroy($imNew);
}

?>
