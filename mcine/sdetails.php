<?php
// header("Content-type: text/xml; charset=utf-8");
// header("Content-type: text/plain; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");

$url=urldecode($_POST["u"]);
//$url=urldecode($_REQUEST["u"]);

if(!$url){$url='http://m.cinema.com.my/movies/content.aspx?search=2014.9106.heartofthesea.19461';}

// $url = 'http://dbklpgis.scadatron.net/dbklpgisd1.xml';
// $xml = new SimpleXMLElement($url, null, true);
// echo $xml->results->quote[0]->AskRealtime;
// print_r($xml);

$contents = file_get_contents($url);
$contents = preg_replace("/<script.*?\/script>/s", "", $contents);
// $contents = preg_replace('/(<[^>]+) style=".*?"/i', '$1', $contents);
$contents = strstr($contents, '<div class="sec_content">');
$contents = substr($contents, 0, strpos($contents,'<input type="hidden" name="ctl00$ContentPlaceHolder$ctl00$hfMovieId"'));

$contents = strip_selected_tags_by_id_or_class(array("ctl00_ContentPlaceHolder_ctl00_ddlShowDate"),$contents);

$contents= str_replace("<div id=\"accordion\">","<div id=\"accordion\" data-role=\"collapsible\" data-collapsed=\"true\" data-theme=\"b\">",$contents);
$contents= str_replace("<div id=\"ShowtimesList\">","<div id=\"ShowtimesList\" data-role=\"collapsible\" data-collapsed=\"false\" data-theme=\"b\">",$contents);

print_r($contents);

function strip_selected_tags_by_id_or_class($array_of_id_or_class, $text)
{
   $name = implode('|', $array_of_id_or_class);
   $regex = '#<(\w+)\s[^>]*(class|id)\s*=\s*[\'"](' . $name .
            ')[\'"][^>]*>.*</\\1>#isU';
   return(preg_replace($regex, '', $text));
}

function strip_html_tags( $text )
{
    $text = preg_replace(
        array(
          // Remove invisible content
            '@<head[^>]*?>.*?</head>@siu',
            '@<style[^>]*?>.*?</style>@siu',
            '@<script[^>]*?.*?</script>@siu',
            '@<object[^>]*?.*?</object>@siu',
            '@<embed[^>]*?.*?</embed>@siu',
            '@<applet[^>]*?.*?</applet>@siu',
            '@<noframes[^>]*?.*?</noframes>@siu',
            '@<noscript[^>]*?.*?</noscript>@siu',
            '@<noembed[^>]*?.*?</noembed>@siu',
          // Add line breaks before and after blocks
            '@</?((address)|(blockquote)|(center)|(del))@iu',
            '@</?((div)|(h[1-9])|(ins)|(isindex)|(p)|(pre))@iu',
            '@</?((dir)|(dl)|(dt)|(dd)|(li)|(menu)|(ol)|(ul))@iu',
            '@</?((table)|(th)|(td)|(caption))@iu',
            '@</?((form)|(button)|(fieldset)|(legend)|(input))@iu',
            '@</?((label)|(select)|(optgroup)|(option)|(textarea))@iu',
            '@</?((frameset)|(frame)|(iframe))@iu',
        ),
        array(
            ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',
            "\n\$0", "\n\$0", "\n\$0", "\n\$0", "\n\$0", "\n\$0",
            "\n\$0", "\n\$0",
        ),
        $text );
    return strip_tags( $text );
}

function cleanElements($html){

 $search = array (
       "'<script[^>]*?>.*?</script>'si",  //remove js
        "'<style[^>]*?>.*?</style>'si", //remove css
        "'<head[^>]*?>.*?</head>'si", //remove head
       "'<link[^>]*?>.*?</link>'si", //remove link
       "'<object[^>]*?>.*?</object>'si"
                      );
$replace = array (
             "",
             "",
            "",
            "",
            ""
);
  return preg_replace ($search, $replace, $html);
 }
?>
