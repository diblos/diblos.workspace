<?php
$url = 'app.html';
$contents = file_get_contents($url);
$contents = preg_replace('~>\\s+<~m', '><', $contents);
print_r($contents);
?>