var t;var min = 15;
var con_name=0;
var nTitle = '';
var nRole = "Website";
var AppName = "MCine";

var disclaimerText = '<p>1. You are agreed to access and use this '+nRole+' entirely at your own risk. All information provided here is provided by '+AppName+'. '+AppName+' shall have the right to terminate or suspend its services at any time and for any reason, generally without notice.</p>';
		disclaimerText+='<p>2. While every effort is made to ensure that the information provided on the '+nRole+' is current and accurate, the information provided is meant for informational purposes only and is not intended for mission or safety critical circumstances. You should not assume that the information on the '+nRole+' is always current or accurate, and other sources of this information should be consulted before making any decision to act on the information displayed on this '+nRole+'.</p>';
		disclaimerText+='<p>3. This '+nRole+' is not tracking or keeping any of user information. Thus, in case of parties (such as hackers) may breach or attempt to breach this '+nRole+' security measures or may gain unauthorized access to the code and sniffed your information. You agree that we shall not be liable for damages of any sort, whether arising under contract, tort, or otherwise, with respect to any breach of security of the this '+nRole+' or any other company equipment.</p>';

var hcode;

$(document).ready(function() {
$( "#dDisclaimer" ).html(disclaimerText);
$.mobile.changePage("#pageone", { transition: "slide",role: "page",reverse:true});

getcode();
getlist();

});

$(document).on("pagebeforetransition",function(event, ui){
	ui.options.changeHash = false;
}) ;

$('#pagedetail').bind('pageshow',function(){document.title = nTitle});

var goback = function(){$.mobile.changePage("#pageone", { transition: "slide",role: "page",reverse:true});};

var rename = function(n,obj){
	nTitle = n;
	obj.html(nTitle);
}

var resetlist = function(){
	$( "#camlist" ).empty().append('<li data-role="list-divider">Camera List</li>');
	setTimeout(function(){$('#camlist').listview( "refresh" );},500);
}

var getcode = function(){

		$.ajax({
						method: "POST",
            url: "clogo.php",
						data:{ 'o': 1 },
            dataType: "text",
						beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
            // complete: function() { $.mobile.loading('hide'); }, //Hide spinner
            success: function(data) {
              hcode = $.parseJSON(data);
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

var getlist = function(){
		if(!hcode){setTimeout(function(){getlist();},200);return false;}
		$.ajax({
            url: "clist.php",
            dataType: "text",
						// beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
            complete: function() { $.mobile.loading('hide'); }, //Hide spinner
            success: function(data) {
						$( "#dApplicants" ).empty().append('<li data-role="list-divider">Select Highway</li>');
            var json = $.parseJSON(data);
						var count = 0;
						$(json.query.results.option).each(function() {

				  	var li = $( '<li data-icon="carat-r" swatch="a">' );
				  	var a = $( "<a/>" );

						a.attr("style","vertical-align: middle;")
				  	a.attr("href",'#pagedetail');
				  	a.attr("onclick",'resetlist();rename("'+this.content+'",$("#pagedetail div h1#hname"));showslist("'+this.value+'");return false;');
						// a.attr("onclick",'resetlist();showslist("'+this.value+'");return false;');

						var img = $( "<img/>" );
						img.attr("src",hcodeimg(this.content));
						// img.attr("class","ui-li-icon");
						a.append(img);
						a.append('<span>'+this.content+'</span>');
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
		var dURL = "slist.php";
		$.ajax({
			method: "POST",
            url: dURL,
						data:{ 'u': d },
            dataType: "text",
			beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
            complete: function() { $.mobile.loading('hide'); }, //Hide spinner
            success: function(data) {
				var count = 0;
				var json = $.parseJSON(data);
				$( "#camlist" ).empty().append('<li data-role="list-divider">'+json.query.results.div.content+'</li>');

				try {
					//=======================================================================
					$(json.query.results.div.div).each(function() {

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
					klass.html(this.content.replace("\r","").replace("\n",""));

					h.attr("id","cam_"+(count+=1));
					h.text(this.a.b);
					// img.attr("id","img_"+count);
					// img.attr("width",200);
					// img.attr("src",getposter(this.src));

										$(this.div).each(function() {
											schstr+=this+"  ";
										});

					a.append(h);
					// a.append(img);
					content.html(this.i);
					schedule.html(schstr);
					a.append(content);
					a.append("<br />").append(schedule);

					// a.attr("onclick",'$.mobile.changePage("#pagedetail2", { transition: "slide",role: "page" });return false;');
					a.attr("onclick","showdetails('"+wwwroot+this.a.href+"');return false;");
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
				// if($( "#camlist li" ).length>=1){
				// 	$( "#camlist" ).append('<li swatch="a"><center>'+$( "#myads ins" ).html()+'</center></li>');
				// };
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
					$( "#sDetails" ).html(data).trigger('create');

					//=======================================================================
					// $("#ctl00_ContentPlaceHolder_pnlContent").hide();
					$(".sec_innerbox").hide();
					$("#ctl00_ContentPlaceHolder_lblTitle").hide();
					$("#hname2").text($("#ctl00_ContentPlaceHolder_lblTitle b b").html());
					// rename($("#ctl00_ContentPlaceHolder_lblTitle b b").html(),$('#pagedetail2 div h1#hname2'));
					//=======================================================================
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

function hcodeimg(cp){
	var result=undefined;
	if(hcode){
          	$(hcode).each(function() {
						if(this.cCode.trim()==cp.split("-")[0].trim()){
							result = this.datatype+','+this.data;
						};
					});
					if(!result){
						return hcode[hcode.length-1].datatype+','+hcode[hcode.length-1].data;/* get default signage which is always last */
					}else{
						return result;
					}
	}else{
		return result;
	}
}

// ==============================================================================================================================

function reloadStorage(){
	ver=$.jStorage.get("ver",999);
	storeCount = $.jStorage.get("TrackerCount",0);
}

function saveStorage(){
	$.jStorage.set("TrackerCount",TrackerCount);
	for (i = 1; i <= TrackerCount; i++){
		$.jStorage.set("ip"+i,$('#IP' + i).text());
	}
}

function saveConfig(){
	// min=$('#points').val();
	// $.jStorage.set("min",min);
}

function resetStorage(count){
		 // $.jStorage.deleteKey('TrackerCount');
		 // for (i = 1; i <= TrackerCount; i++){
			 // $.jStorage.deleteKey('ip'+i);
		 // }
}

// ==============================================================================================================================

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
