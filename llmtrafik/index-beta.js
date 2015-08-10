var t;var min = 15;
var con_name=0;
var updateflag = false;
var nTitle = '';
var nRole = "Application";

var disclaimerText = '<p>1. You are agreed to access and use this '+nRole+' entirely at your own risk. All information provided here is provided by <abbr title="Lembaga Lebuhraya Malaysia">LLM</abbr>. <abbr title="Lembaga Lebuhraya Malaysia">LLM</abbr> shall have the right to terminate or suspend its services at any time and for any reason, generally without notice.</p>';
		disclaimerText+='<p>2. While every effort is made to ensure that the information provided on the '+nRole+' is current and accurate, the information provided is meant for informational purposes only and is not intended for mission or safety critical circumstances. You should not assume that the information on the '+nRole+' is always current or accurate, and other sources of this information should be consulted before making any decision to act on the information displayed on this '+nRole+'.</p>';
		disclaimerText+='<p>3. This '+nRole+' is not tracking or keeping any of user information. Thus, in case of parties (such as hackers) may breach or attempt to breach this '+nRole+' security measures or may gain unauthorized access to the code and sniffed your information. You agree that we shall not be liable for damages of any sort, whether arising under contract, tort, or otherwise, with respect to any breach of security of the this '+nRole+' or any other company equipment.</p>';
		
$(document).ready(function() {

$( "#dDisclaimer" ).html(disclaimerText);
$.mobile.changePage("#pageone", { transition: "slide",role: "page",reverse:true});

getlist();
});

$(document).on("pagebeforetransition",function(event, ui){ 
	ui.options.changeHash = false; 
}) ;

$('#pagedetail').bind('pageshow',function(){document.title = nTitle});

var goback = function(){$.mobile.changePage("#pageone", { transition: "slide",role: "page",reverse:true});};

var rename = function(n){
	nTitle = n;
	$('#pagedetail div h1#hname').html(nTitle);
}

var resetlist = function(){
	$( "#camlist" ).empty().append('<li data-role="list-divider">Camera List</li>');	
	setTimeout(function(){$('#camlist').listview( "refresh" );},500);	
}

var getlist = function(){
		
		$.ajax({			
            url: "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%27http%3A%2F%2Fm.llm.gov.my%2FTrafficList.aspx%27%20and%20xpath%3D%27%2F%2Ful%2F%2Fli%2F%2Fa%27&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys",
            dataType: "text",
			beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
            complete: function() { $.mobile.loading('hide'); }, //Hide spinner
            success: function(data) {
            	 //alert(data);
				 
				$( "#dApplicants" ).empty().append('<li data-role="list-divider">Select Highway</li>');
				 
                var json = $.parseJSON(data);
                //now json variable contains data in json format                        
				var count = 0;
				
				$(json.query.results.a).each(function() {	
				
				  var li = $( '<li data-icon="carat-r" swatch="a">' );
				  var a = $( "<a/>" );
				  
				  a.attr("href",'#');
				  a.attr("onclick",'resetlist();rename("'+this.content+'");showcams("'+this.href+'");return false;');
				  //a.html('<span>'+this.content+'</span><span class="ui-li-count ui-btn-up-b ui-btn-corner-all ui-body-inherit">'+((this.approved==='Y') ? 'Approved' : 'Not Approved')+'</span>');
				  a.html('<span>'+this.content+'</span>');
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

var showcams = function(d){
		updateflag = false;
		$.mobile.changePage("#pagedetail", { transition: "slide",role: "page" });
		var LLMroot = "http://m.llm.gov.my/";
		//var dURL = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'"+encodeURIComponent(LLMroot+d)+"'%20and%20xpath%3D'%2F%2Ftable%5B3%5D%2F%2Ftr%5B3%5D%2F%2Ftbody%2F%2Ftd%2F%2Fspan'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
		//var dURL = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%27"+encodeURIComponent(LLMroot+d)+"%27%20and%20xpath%3D%27%2F%2Ftable[3]%2F%2Ftr[3]%2F%2Ftbody%2F%2Ftd%2F%2Fimg[%40height%3D%22120px%22]%27&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
		var dURL = "cam.php";
		$.ajax({
			method: "POST",
            url: dURL,
			data:{ 'u': encodeURIComponent(LLMroot+d) },
            dataType: "text",
			beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
            complete: function() { $.mobile.loading('hide'); }, //Hide spinner
            success: function(data) {
            	 //alert(data);
				//return false;
                
				var count = 0;				
				var json = $.parseJSON(data);				
				$( "#camlist" ).empty().append('<li data-role="list-divider">Camera List ('+json.length+' online)</li>');				
				
				try {

					$(json).each(function() {
							
					var li = $( '<li swatch="a" style="text-align:center;">' );
					var img = $( "<img/>" );
					var h = $( "<h3/>" );
					
					//var ename = this.name.slice(4).split('_').join(' ');
					var ename = this.name.slice(4).split('_').join(' ').replace('CAM','CAMERA').replace('WB','(WEST BOUND)').replace('EB','(EAST BOUND)').replace('SB','(SOUTH BOUND)').replace('NB','(NORTH BOUND)');
					
					h.attr("id","cam_"+(count+=1));
					h.html(ename);
					img.attr("id","img_"+count);
					img.attr("title",ename);
					img.attr("alt",ename);
					
					img.attr("src",LLMroot+this.link);

					li.append(h);
					li.append(img);
				  				  
					$( "#camlist" ).append(li);
				
				});
			}
			catch(err) {
				//Block of code to handle errors
			}
			finally {
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

var login = function(){
	if(($("#uid").val()==='admin')&&($("#pwd").val()==='admin')){
	getlist();
	$.mobile.changePage("#pageone", { transition: "slide",role: "page"});
	}else{
		alert('invalid login!');
	}
}

var logout = function(){
	$.mobile.changePage("#pagelogin", { transition: "slide",role: "page",reverse:true});	
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