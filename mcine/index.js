var t;
var min = 15;
var con_name = 0;
var nTitle = '';
var nRole = "Website";
var AppName = "MCine";
var dVERSION = '';
// var dLOCATION = {
//   lat:3.19,
//   lon:101.64,
//   bearing:0
// }

var dLOCATION = undefined;
var dLOCATION_FLAG = false;
// var dCINELIST = undefined;

var disclaimerText = '<p>1. You are agreed to access and use this ' + nRole + ' entirely at your own risk. All information provided here is provided by ' + AppName + '. ' + AppName + ' shall have the right to terminate or suspend its services at any time and for any reason, generally without notice.</p>';
disclaimerText += '<p>2. While every effort is made to ensure that the information provided on the ' + nRole + ' is current and accurate, the information provided is meant for informational purposes only and is not intended for mission or safety critical circumstances. You should not assume that the information on the ' + nRole + ' is always current or accurate, and other sources of this information should be consulted before making any decision to act on the information displayed on this ' + nRole + '.</p>';
disclaimerText += '<p>3. This ' + nRole + ' is not tracking or keeping any of user information. Thus, in case of parties (such as hackers) may breach or attempt to breach this ' + nRole + ' security measures or may gain unauthorized access to the code and sniffed your information. You agree that we shall not be liable for damages of any sort, whether arising under contract, tort, or otherwise, with respect to any breach of security of the this ' + nRole + ' or any other company equipment.</p>';

var sData;

$(document).ready(function () {
    "use strict";
    $("#dDisclaimer").html(disclaimerText);
    $.mobile.changePage("#pageone", { transition: "slide", role: "page", reverse: true});

    if (geoPosition.init()) {
    	geoPosition.getCurrentPosition(geoSuccess, geoError);
    }else{
      dLOCATION_FLAG=false;
      console.log("not support geolocation!");
      afterloc();
    }

});

$(document).on("pagebeforetransition", function (event, ui) {
    "use strict";
    ui.options.changeHash = false;
});

$('#pagedetail').bind('pageshow', function () {document.title = nTitle; });

var afterloc = function () {"use strict"; checkver();getlist();/*getnowlist();*/};

var goback = function () {"use strict"; $.mobile.changePage("#pageone", { transition: "slide", role: "page", reverse: true}); };

var rename = function (n, obj) {"use strict"; nTitle = n; obj.html(nTitle); };

var resetlist = function () {"use strict"; $("#camlist").empty().append('<li data-role="list-divider">Camera List</li>'); setTimeout(function () {$('#camlist').listview("refresh"); }, 500); };

var getcode = function(){
    "use strict";
    $.ajax({
        method: "POST",
        url: "http://api.nakedmaya.com/mcine/ccode",
        data: '{"o": 1 }',
        dataType: "text",
            // beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
            // complete: function() { $.mobile.loading('hide'); }, //Hide spinner
            success: function(data) {
              sData = $.parseJSON(data);
              $.jStorage.set("mcineVer",dVERSION);
              $.jStorage.set("mcineData",data);

              console.log(">>"+$.jStorage.get("mcineVer"));
              console.log(">>"+$.jStorage.get("mcineData"));

            },
             error: function(x, t, m) {
            if(t==="timeout") {
                setTimeout(function(){alert("err:timeout");},1000);
            } else {
              console.log(x+' '+t+' '+m);
                // setTimeout(function(){alert('err:'+t);},1000);
            }
        }
        });
}

var getlist = function(){
    $.mobile.loading('show');
    if((!sData)&&(dLOCATION_FLAG===true)){setTimeout(function(){getlist();},100);return false;}
    if(!checkListFresh()){
      $.ajax({
              url: "http://api.nakedmaya.com/mcine/cinema/list",
              dataType: "text",
              // beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
              // complete: function() { $.mobile.loading('hide'); }, //Hide spinner
              success: function(data) {
                $.jStorage.set("mcineList",data);
                json = $.parseJSON(data);
                buildList(json);
              },
               error: function(x, t, m) {
              if(t==="timeout") {
                  setTimeout(function(){console.log("err:timeout");},1000);
              } else {
                console.log(x+' '+t+' '+m);
                  // setTimeout(function(){alert('err:'+t);},1000);
              }
          }
          });
    }else{
      json =$.parseJSON($.jStorage.get("mcineList"));
      buildList(json);
    }
}

var buildList = function(j){
  if(json){
            $( "#dApplicants" ).empty();
              
              var count = 0;
              $(json.query.results.cinema).each(function() {

              var li = $( '<li data-icon="carat-r" swatch="a">' );
              var a = $( "<a/>" );

              a.attr("style","vertical-align: middle;")
              a.attr("href",'#pagedetail');
              a.attr("onclick",'resetlist();rename("'+this.name+'",$("#pagedetail div h1#hname"));showslist("'+this.code+'");return false;');
              var img = $( "<img/>" );
              img.attr("src",sDataimg(this.name));
              a.append(img);
              a.append('<span class="spanlist">'+this.name+'</span>'+sDatadistance(this.name));
              li.append(a);

              $( "#dApplicants" ).append(li);
            });
              $('#dApplicants').listview( "refresh" );
            
  }
  $.mobile.loading('hide');
}

var getnowlist = function(){
    // if((!sData)&&(dLOCATION_FLAG===true)){setTimeout(function(){getlist();},00);return false;}
    $.ajax({
            url: "readnow.php",
            dataType: "text",
            // beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
            complete: function() { $.mobile.loading('hide'); }, //Hide spinner
            success: function(data) {
            // $( "#dApplicants" ).empty().append('<li data-role="list-divider">Select Highway</li>');
            $( "#dApplicants" ).empty().attr('data-autodividers','true').attr('data-filter','true');
            // $( "#dApplicants" ).removeAttr('data-autodividers').removeAttr('data-filter').removeAttr('data-filter-placeholder');
            var json = $.parseJSON(data);
            var count = 0;
            $(json.query.results.a).each(function() {

            var li = $( '<li data-icon="carat-r" swatch="a">' );
            var a = $( "<a/>" );

            a.attr("style","vertical-align: middle;")
            a.attr("href",'#pagedetail');
            a.text(this.img.alt);
            // a.attr("onclick",'resetlist();rename("'+this.content+'",$("#pagedetail div h1#hname"));showslist("'+this.value+'");return false;');
            a.attr("onclick","showdetails('http://m.cinema.com.my/movies/"+this.href+"');return false;");
            var img = $( "<img/>" );
            img.attr("src","sposter.php?w=80&h=80&f="+this.img.src);
            // img.attr("class","ui-li-icon");
            a.append(img);
            // a.append('<span class="spanlist">'+this.content+'</span>'+sDatadistance(this.content));
            li.append(a);

            $( "#dApplicants" ).append(li);
          });

            $('#dApplicants').listview( "refresh" );

            },
             error: function(x, t, m) {
            if(t==="timeout") {
                setTimeout(function(){alert("err:timeout");},1000);
            } else {
              alert(x+' '+t+' '+m);
                // setTimeout(function(){alert('err:'+t);},1000);
            }
        }
        });
}

var showslist = function(d){
    var wwwroot = "http://m.cinema.com.my";
    var dURL = "http://api.nakedmaya.com/mcine/cinema/"+d+"/list";
    $.ajax({
            method: "GET",
            url: dURL,
            dataType: "text",
            beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
            complete: function() { $.mobile.loading('hide'); }, //Hide spinner
            success: function(data) {
        var count = 0;
        var json = $.parseJSON(data);
        $( "#camlist" ).empty().append('<li data-role="list-divider">'+json.query.count+' Show'+((json.query.count>1)?'s':'')+'</li>');

        try {
          //=======================================================================

          $(json.query.results.shows).each(function() {

          var li = $( '<li swatch="a" style="text-align:left;">' );
          var a = $( "<a/>" );
          // a.attr("style","vertical-align: middle;")
          a.attr("href",'#pagedetail');
          // a.attr("onclick",'resetlist();rename("'+this.content+'");showslist("'+this.value+'");return false;');


          var img = $( "<img/>" );
          var h = $( "<h3/>" );
          var content =$( "<span/>" );
          var schedule =$( "<span/>" );
          var schstr="";

          var klass =$( "<span/>" );
          klass.attr("class","ui-li-count ui-btn-up-b ui-btn-corner-all")
          klass.html(this.rate.replace("\r","").replace("\n",""));

          h.attr("id","cam_"+(count+=1));
          h.attr("style","color:lime;margin:0px 0px 5px 0px;");
          h.text(this.title);
          // img.attr("id","img_"+count);
          // img.attr("width",200);
          // img.attr("src",getposter(this.src));


                    if($(this.times).length<=0){
                      schedule.append(dimmed((  isEmpty( $(this.times.a)) === false  ? this.times.a.content.trim() : this.times.trim() )));
                    }else {
                      $(this.times).each(function() {
                        schedule.append(dimmed((  isEmpty(  $(this.a) ) === false ? this.a.content.trim() : this.trim() ))).append(" &nbsp;");
                      });
                    }


          a.append(h);
          // a.append(img);
          content.html(this.description);
          // schedule.html(schstr);
          a.append(content);
          a.append("<br />").append(schedule);

          // a.attr("onclick",'$.mobile.changePage("#pagedetail2", { transition: "slide",role: "page" });return false;');
          a.attr("onclick","showdetails('"+wwwroot+this.link+"');return false;");
          // a.attr("onclick","$( '#sDetails' ).load( '"+wwwroot+this.a.href+"' ,function(){$('#sDetails').trigger('create');});$.mobile.changePage('#pagedetail2', { transition: 'slide',role: 'page' });return false;")

          // a.attr("onclick","$( '#sDetails' ).html( 'kokokokoko');$.mobile.changePage('#pagedetail2', { transition: 'slide',role: 'page' });return false;")

          a.append(klass);

          $( "#camlist" ).append(li.append(a));

        });

        //=======================================================================
      }
      catch(err) {
        //Block of code to handle errors
      }
      finally {
        $.mobile.changePage("#pagedetail", { transition: "slide",role: "page" });
        if($( "#camlist li" ).length===1){$( "#camlist" ).append('<li swatch="a"><center>'+json.query.results.div.div+'</center></li>')};
        if($( "#camlist li" ).length>=1){
          // $( "#camlist" ).append('<li swatch="a"><center>'+$( "#myads ins" ).html()+'</center></li>');
        };
        $('#camlist').listview( "refresh" );
      }
        //$.mobile.changePage("#pagedetail", { transition: "slide",role: "page" });
            },
             error: function(x, t, m) {
            if(t==="timeout") {
                setTimeout(function(){alert("err:timeout");},1000);
            } else {
              alert(x+' '+t+' '+m);
                // setTimeout(function(){alert('err:'+t);},1000);
            }
        }
        });
}

var showdetails = function(d){
    var wwwroot = "http://m.cinema.com.my";
    var dURL = "sdetails.php";
    $.ajax({
      method: "POST",
            url: dURL,
            data:{ 'u': d },
            dataType: "text",
            beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
            complete: function() { $.mobile.loading('hide'); }, //Hide spinner
            success: function(data) {

        try {
          $( "#sDetails" ).html(data);//.trigger('create');
          $( ".links" ).before(function() {return "<h3>" + this.text + "</h3>";});
          $("#ctl00_ContentPlaceHolder_pnlShowtimes").children().attr("data-role","collapsible-set");
          //=======================================================================
          $(".sec_innerbox").remove();
          // $(".links").parent().children('div').css( "background", "yellow" );
          // $(".links").parent(function(){this.children('div').hide()});
          // $(".links").parent().children('div').removeAttr( "id" ).removeAttr( "data-role" ).removeAttr( "data-collapsed" ).removeAttr( "data-theme" ).children('div').css("font-weight","bold");
          // $(".links").parent().children('div').removeAttr( "id" ).removeAttr( "data-role" ).removeAttr( "data-collapsed" ).removeAttr( "data-theme" ).children('br').remove();
          // $(".links").parent().children('div').before(function() {return "<h3>" + this.text + "</h3>";});
          // $(".links").parent().children('div').children('br').before(function() {return "<h3>" + this.text + "</h3>";});

          $(".mboticketing").removeAttr("href");

          $(".links").remove();
          $("hr").remove();
          // $("#ctl00_ContentPlaceHolder_imgPoster").attr("width","40%")
		  $("#ctl00_ContentPlaceHolder_imgPoster").removeAttr("width");
          $("#ctl00_ContentPlaceHolder_lblTitle").hide();
          $("#hname2").text($("#ctl00_ContentPlaceHolder_lblTitle b b").html());
          //=======================================================================
          $( "#sDetails" ).trigger('create');
      }
      catch(err) {
        //Block of code to handle errors
      }
      finally {
        $.mobile.changePage("#pagedetail2", { transition: "slide",role: "page" });
      }
            },
             error: function(x, t, m) {
            if(t==="timeout") {
                setTimeout(function(){alert("err:timeout");},1000);
            } else {
              alert(x+' '+t+' '+m);
                // setTimeout(function(){alert('err:'+t);},1000);
            }
        }
        });
}

function sDataimg(cp){
  var result=undefined;
  if(sData){
            $(sData[0].logos).each(function() {
            if(this.cCode.trim()==cp.split("-")[0].trim()){
              result = this.datatype+','+this.data;
            };
          });
          if(!result){
            return sData[0].logos[sData[0].logos.length-1].datatype+','+sData[0].logos[sData[0].logos.length-1].data;/* get default signage which is always last */
          }else{
            return result;
          }
  }else{
    return result;
  }
}

function sDatadistance(cp){
  var result=undefined;
  if((sData)&&(dLOCATION)){
            $(sData[0].coords).each(function() {
            if(this.cName.trim()==cp.trim()){
              result = Math.round(distance(dLOCATION.lat, dLOCATION.lon, this.lat, this.lon, 'K'));
            };
          });
          if(!result){
            return '';
          }else{
            return '<span class="ui-li-count ui-btn-up-b ui-btn-corner-all">'+result+' km</span>';
          }
  }else{
    return '';
  }
}

var checkver = function (){
  var result=false;
  dVERSION=$.jStorage.get("mcineVer",999);
  console.log(dVERSION);
  $.ajax({
          method: "GET",
          url: "http://api.nakedmaya.com/mcine/ccode",
          dataType: "text",
          beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
          success: function(data) {
            var json = $.parseJSON(data);
            if (dVERSION==json.version){
              result=true;
              sData = $.parseJSON($.jStorage.get("mcineData"));
            }else{
              dVERSION=json.version;
              result=false;
              getcode();
            }
          },
          error: function(x, t, m) {
          result=false;
          getcode();
      }
      });
      console.log(dVERSION);
      console.log(result);
}

var checkListFresh = function (){
  dResult = $.jStorage.get("mcineList",false);

  if(dResult){

    try {
      var DIFFCONST = 60 * 60 * 24 * 1000;// 24 hrs in ms
      var json = $.parseJSON(dResult);

      console.log(json.query.created);
      var dDate1 = new Date(json.query.created);
      var dDate2 = new Date();
      if(dDate2 - dDate1 > DIFFCONST){
        console.log('old');
        return false;
      }else{
        console.log('fresh');
        return true;
      }      
    }
    catch (e) {
       console.log(e);
       return false;
    }

  }else{
    return false;
  }
}

function clock() {var now = new Date();var TmStr = ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2) + meridiem(now.getHours());return TmStr;}

function meridiem(hour) { if (hour > 11) { return 'PM'; } else { return 'AM'; }}

function dimmed(r){
    try {
      if(r.substring(r.length-1)===")"){
        t=r.split(" ")[0];
      }else {
        t=r;
      }
    } catch (e) {
      // do nothing
    }

    var a = t.substring(5);
    var h = t.substring(0,2);
    var f = $( "<font/>" );
    var secH=0;

    if((parseInt(h) < 12)&&(a==='PM')){
        secH=parseInt(h)+12;
      //str+=parseInt(h)+12+"\n";
    }else{
        if((parseInt(h)<6)&&(a==='AM')){
            secH=parseInt(h)+24;
            //str+=parseInt(h)+24+"\n";
        }else{
            if((parseInt(h)===12)&&(a==='AM')){
              secH=24;
              //str+=24+"\n";
            }else{
              secH=parseInt(h);
              //str+=parseInt(h)+"\n";
            }
        }
    }

    //================================== OLD START
    /*if(a === clock().substring(5)){ //equal meridiem
        var curH = clock().substring(0,2);
        if (curH>11){curH=curH-12};
        if (parseInt(h)<curH){
            f.addClass( 'dimmed' );
        }else{
            if((h==12)&&(curH>0)){f.addClass( 'dimmed' );}else{f.addClass( 'notdimmed' );}
        }
    }else{//diff meridiem
        if (clock().substring(5)==="PM"){
            f.addClass( 'dimmed' );
        }else{
          f.addClass( 'notdimmed' );
        }
    }*/
    //================================== OLD END
    //================================== NEW START
    var curA = clock().substring(5);
    var curH = clock().substring(0,2);

    var newH;

    if((curH < 12)&&(curA==='PM')){
        newH=parseInt(curH)+12;
      // str+=parseInt(curH)+12+"\n";
    }else{
        if((curH<6)&&(curA==='AM')){
            newH=parseInt(curH)+24;
            // str+=parseInt(curH)+24+"\n";
        }else{
            if((curH===12)&&(curA==='AM')){
                newH=24;
              str+=24+"\n";
            }else{
                newH=parseInt(curH);
              // str+=parseInt(curH)+"\n";
            }
        }
    }

    if(secH<=newH){
        f.addClass( 'dimmed' );
  }else{
        f.addClass( 'notdimmed' );
    }
    //================================== NEW END
  // return f.html(t);
  return f.html(r);
}

/* http://www.geodatasource.com/developers/javascript
    Passed to function:
    lat1, lon1 = Latitude and Longitude of point 1 (in decimal degrees)
    lat2, lon2 = Latitude and Longitude of point 2 (in decimal degrees)
    unit = the unit you desire for results
           where: 'M' is statute miles (default)
                  'K' is kilometers
                  'N' is nautical miles
*/
function distance(lat1, lon1, lat2, lon2, unit) {
	var radlat1 = Math.PI * lat1/180
	var radlat2 = Math.PI * lat2/180
	var radlon1 = Math.PI * lon1/180
	var radlon2 = Math.PI * lon2/180
	var theta = lon1-lon2
	var radtheta = Math.PI * theta/180
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist)
	dist = dist * 180/Math.PI
	dist = dist * 60 * 1.1515
	if (unit=="K") { dist = dist * 1.609344 }
	if (unit=="N") { dist = dist * 0.8684 }
	return dist
}


function geoSuccess(p) {
  dLOCATION = {
    lat:p.coords.latitude,
    lon:p.coords.longitude,
    bearing:0
  }
  dLOCATION_FLAG=true;
  console.log("Found you at latitude " + dLOCATION.lat + ", longitude " + dLOCATION.lon);
  afterloc();
}

function geoError(error) {
  dLOCATION_FLAG=true;
  // console.log("Could not find you!");
  switch(error.code) {
    case error.PERMISSION_DENIED:
        console.log("User denied the request for Geolocation.");
        break;
    case error.POSITION_UNAVAILABLE:
        console.log("Location information is unavailable.");
        break;
    case error.TIMEOUT:
        console.log("The request to get user location timed out.");
        break;
    case error.UNKNOWN_ERROR:
        console.log("An unknown error occurred.");
        break;
}
afterloc();
}

// ==============================================================================================================================

// function reloadStorage(){
//   ver=$.jStorage.get("mcineVer",999);
//   storeCount = $.jStorage.get("TrackerCount",0);
// }

// function saveStorage(){
//   $.jStorage.set("TrackerCount",TrackerCount);
//   for (i = 1; i <= TrackerCount; i++){
//     $.jStorage.set("ip"+i,$('#IP' + i).text());
//   }
// }

// function saveConfig(){
//   min=$('#points').val();
//   $.jStorage.set("min",min);
// }

// function resetStorage(count){
//      $.jStorage.deleteKey('TrackerCount');
//      for (i = 1; i <= TrackerCount; i++){
//        $.jStorage.deleteKey('ip'+i);
//      }
// }

// ==============================================================================================================================
function isEmpty(ob){
   for(var i in ob){ if(ob.hasOwnProperty(i)){return false;}}
  return true;
}

var OK1= function(){$('#fOKdialog').dialog( 'close');return false;};
var OK2= function(){
                $.mobile.changePage("#customerpage", { transition: "slidedown",role: "page" });
                return false;
                };
function invalid(smsg,x){
    var icon = '';//'<i class="fa fa-exclamation-triangle fa-1x"></i>&nbsp;';
    $('#fOKdialog p').css('display','block').html(icon+smsg);
    $.mobile.changePage("#fOKdialog", { transition: "slidedown",role: "dialog" });

    switch(x)
    {
      case true:
        $('#fOKdialog button').unbind('click');
        $('#fOKdialog button').click(OK2);
        break;
      case false:
        $('#fOKdialog button').unbind('click');
        $('#fOKdialog button').click(OK1);
        break;
      default:
        $('#fOKdialog button').unbind('click');
        //$('#fOKdialog button').click(function(){navfunc('#'+x);$.mobile.changePage("#"+x, { transition: "slidedown",role: "page" });return false;});
    }

}
