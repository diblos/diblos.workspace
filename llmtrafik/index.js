var t;var min = 15;
var con_name=0;
var nTitle = '';
var nRole = "Website";
var dVERSION = '';
var toll_desc = '';

var disclaimerText = '<p>1. You are agreed to access and use this '+nRole+' entirely at your own risk. All information provided here is provided by <abbr title="Lembaga Lebuhraya Malaysia">LLM</abbr>. <abbr title="Lembaga Lebuhraya Malaysia">LLM</abbr> shall have the right to terminate or suspend its services at any time and for any reason, generally without notice.</p>';
		disclaimerText+='<p>2. While every effort is made to ensure that the information provided on the '+nRole+' is current and accurate, the information provided is meant for informational purposes only and is not intended for mission or safety critical circumstances. You should not assume that the information on the '+nRole+' is always current or accurate, and other sources of this information should be consulted before making any decision to act on the information displayed on this '+nRole+'.</p>';
		disclaimerText+='<p>3. This '+nRole+' is not tracking or keeping any of user information. Thus, in case of parties (such as hackers) may breach or attempt to breach this '+nRole+' security measures or may gain unauthorized access to the code and sniffed your information. You agree that we shall not be liable for damages of any sort, whether arising under contract, tort, or otherwise, with respect to any breach of security of the this '+nRole+' or any other company equipment.</p>';

var hcode;

$(document).ready(function() {
	
	window.lazySizesConfig = {addClasses: true};
	
	$( ".dDisclaimer" ).html(disclaimerText);
	$.mobile.changePage("#pageone", { transition: "slide",role: "page",reverse:true});

	checkver();
	getlist();
	getlistCalc();

});

$(document).on("pagebeforetransition",function(event, ui){
	ui.options.changeHash = false;
}) ;

$('#pagedetail').bind('pageshow',function(){document.title = nTitle});

var goback = function(){$.mobile.changePage("#pageone", { transition: "slide",role: "page",reverse:true});};

var rename = function(n){
	$('h1.hname').html(n);
	// $('#pagedetail div h1.hname').html(n);
}

var resetlist = function(){
	$( "#camlist" ).empty().append('<li data-role="list-divider">Camera List</li>');
	setTimeout(function(){$('#camlist').listview( "refresh" );},500);
}

var getcode = function(){
		$.ajax({
			method: "POST",
            url: "http://api.nakedmaya.com/llmtrafik/hcode",
			data: '{"o": 1 }',
            dataType: "text",
			//beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
            // complete: function() { $.mobile.loading('hide'); }, //Hide spinner
            success: function(data) {
              hcode = $.parseJSON(data);

              console.log(hcode);

              $.jStorage.set("ltver",dVERSION);
              $.jStorage.set("lthcode",data);
              console.log(">>"+$.jStorage.get("ltver"));
              console.log(">>"+$.jStorage.get("lthcode"));
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
            url: "http://api.nakedmaya.com/llmtrafik/highway/list",
            dataType: "text",
			//beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
            complete: function() { $.mobile.loading('hide'); }, //Hide spinner
            success: function(data) {
            	 //alert(data);

				$( "#dApplicants" ).empty().append('<li data-role="list-divider">Select Highway</li>');

                var json = $.parseJSON(data);
                //now json variable contains data in json format
				var count = 0;

				$(json.query.results.highway).each(function() {

				  	var li = $( '<li data-icon="carat-r" swatch="a">' );
				  	var a = $( "<a/>" );

					a.attr("style","vertical-align: middle;")
				  	a.attr("href",'#pagedetail');
				  	a.attr("onclick",'resetlist();rename("'+this.name+'");showcams("'+this.prefix+'");return false;');
				  	// a.html('<span>'+this.content+'</span>');

					var img = $( "<img/>" );
					img.attr("src",hcodeimg(this.prefix));
					// console.log(this.value);
					// img.attr("class","ui-li-icon");
					a.append(img);
					a.append('<span>'+this.name+'</span>');
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

var getlistCalc = function(){
		if(!hcode){setTimeout(function(){getlistCalc();},200);return false;}
		$.ajax({
            url: "http://www.llm.gov.my/Calculator/getHighway",
            dataType: "text",
			//beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
            complete: function() { $.mobile.loading('hide'); }, //Hide spinner
            success: function(data) {
            	 //alert(data);

				$( "#hListCalc" ).empty().append('<li data-role="list-divider">Select Highway</li>');

                var json = $.parseJSON(data);
                //now json variable contains data in json format
				var count = 0;

				$(json).each(function() {

					// console.log(this.name);
					if(this.id){
					  	var li = $( '<li data-icon="carat-r" swatch="a">' );
					  	var a = $( "<a/>" );

						a.attr("style","vertical-align: middle;")
					  	a.attr("href",'#pageStepTwo');
					  	a.attr("onclick",'resetlist();rename("'+this.name+'");showEntries("'+this.id+'");return false;');
					  	// a.html('<span>'+this.content+'</span>');

						var img = $( "<img/>" );
						img.attr("src",hcodeimg2(this.id));
						// console.log(this.value);
						// img.attr("class","ui-li-icon");
						a.append(img);
						a.append('<span>'+this.name+'</span>');
					  	li.append(a);

					  	$( "#hListCalc" ).append(li);
					}


				});

				$('#hListCalc').listview( "refresh" );

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
		var LLMroot = "http://vigroot.llm.gov.my";
		var dURL = "http://api.nakedmaya.com/llmtrafik/highway/camera0/"+d;
		$.ajax({
			method: "GET",
            url: dURL,
            dataType: "text",
			beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
            complete: function() { $.mobile.loading('hide'); }, //Hide spinner
            success: function(data) {

				var count = 0;
				var json = $.parseJSON(data);
				$( "#camlist" ).empty().append('<li data-role="list-divider">Camera List ('+json.query.count+' online)</li>');

				try {
					//=======================================================================
					if(Array.isArray(json.query.results.camera)){

						$(json.query.results.camera).each(function() {

						console.log(JSON.stringify(this));

						var li = $( '<li swatch="a" style="text-align:center;padding-left:1em;">' );
						var img = $( '<img class="teaser lazyload"/> data-expand="-110"' );
						var h = $( "<h3/>" );

						h.attr("id","cam_"+(count+=1));
						img.attr("id","img_"+count);
						img.attr("width",300);
						img.attr("height",225);
						img.attr("src","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8LwkAAh0BGumlBj4AAAAASUVORK5CYII=");//http://png-pixel.com/
						img.attr("data-src","http://vigroot.llm.gov.my/vigroot/cam_root/web/"+d+"/"+this+".web.jpg");

						li.append(h);
						li.append(img);

						$( "#camlist" ).append(li);

						});

					}

				//=======================================================================
				camname(json.query.results.camera);

			}
			catch(err) {
				//Block of code to handle errors
			}
			finally {
				$('#back2cam').show();
				$('#back2toll').hide();
				$.mobile.changePage("#pagedetail", { transition: "slide",role: "page" });
				if($( "#camlist li" ).length>=1){//ADVERT
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

function camname(d){
				var count = 0;
				$(d).each(function() {
					// var ename = this.name.slice(4).split('_').join(' ').replace('CAM','CAMERA').replace('WB','(WEST BOUND)').replace('EB','(EAST BOUND)').replace('SB','(SOUTH BOUND)').replace('NB','(NORTH BOUND)').replace(' EXT',' (EXIT)').replace(' ENT',' (ENTRANCE)').replace('.web.jpg','');
					// var ename = this.slice(4).split('_').join(' ').replace('CAM','CAMERA').replace('WB','(WEST BOUND)').replace('EB','(EAST BOUND)').replace('SB','(SOUTH BOUND)').replace('NB','(NORTH BOUND)').replace(' EXT',' (EXIT)').replace(' ENT',' (ENTRANCE)').replace('.web.jpg','');
					var ename = this.slice(4).split('_').join(' ');
					$('#cam_'+(count+=1)).html(ename);
					$('#img_'+(count)).attr("title",ename);
					$('#img_'+(count)).attr("alt",ename);
				});
}


var showEntries = function(d){
		var dURL = "http://www.llm.gov.my/Calculator/getPlazaEnter/"+d;
		$.ajax({
			method: "GET",
            url: dURL,
            dataType: "text",
			beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
            complete: function() { $.mobile.loading('hide'); }, //Hide spinner
            success: function(data) {

				var count = 0;
				var json = $.parseJSON(data);
				$( "#StepTwoList" ).empty().append('<li data-role="list-divider">Select Entrance</li>');

				try {
					//=======================================================================

					$(json).each(function() {

						// console.log(this.name);
						if(this.id){
						  	var li = $( '<li data-icon="carat-r" swatch="a">' );
						  	var a = $( "<a/>" );

							a.attr("style","vertical-align: middle;")
						  	a.attr("href",'#pagedetail');
						  	a.attr("onclick",'resetlist();toll_desc="'+this.name+'";showExits("'+d+'","'+this.id+'");return false;');
							a.append('<span>'+this.name+'</span>');
						  	li.append(a);

						  	$( "#StepTwoList" ).append(li);
						}


					});

					$('#StepTwoList').listview( "refresh" );
				//=======================================================================

			}
			catch(err) {
				//Block of code to handle errors
			}
			finally {
				$.mobile.changePage("#pageStepTwo", { transition: "slide",role: "page" });
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

var showExits = function(c,d){
		var dURL = "http://www.llm.gov.my/Calculator/getPlazaExit/"+c+"/"+d;
		$.ajax({
			method: "GET",
            url: dURL,
            dataType: "text",
			beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
            complete: function() { $.mobile.loading('hide'); }, //Hide spinner
            success: function(data) {

				var count = 0;
				var json = $.parseJSON(data);
				$( "#StepThreeList" ).empty().append('<li data-role="list-divider">Select Exit</li>');

				try {
					//=======================================================================

					$(json).each(function() {

						// console.log(this.name);
						if(this.id){
						  	var li = $( '<li data-icon="carat-r" swatch="a">' );
						  	var a = $( "<a/>" );

							a.attr("style","vertical-align: middle;")
						  	a.attr("href",'#pagedetail');
						  	a.attr("onclick",'resetlist();toll_desc+=" > '+this.name+'";showTollRates("'+c+'","'+d+'","'+this.id+'");return false;');
						  	// a.html('<span>'+this.content+'</span>');
							a.append('<span>'+this.name+'</span>');
						  	li.append(a);

						  	$( "#StepThreeList" ).append(li);
						}


					});

					$('#StepThreeList').listview( "refresh" );
				//=======================================================================

			}
			catch(err) {
				//Block of code to handle errors
			}
			finally {
				console.log($( "#StepThreeList li" ).length);
				if ($( "#StepThreeList li" ).length>1){
					$.mobile.changePage("#pageStepThree", { transition: "slide",role: "page" });
				}else{
					resetlist();
					showTollRates(c,d,null);
				}				
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

var showTollRates = function(c,d,e){
		var dURL = "http://www.llm.gov.my/Calculator/getTollRate/"+c+"/"+d+"/"+e;
		$.ajax({
			method: "GET",
            url: dURL,
            dataType: "text",
			beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
            complete: function() { $.mobile.loading('hide'); }, //Hide spinner
            success: function(data) {

				var count = 0;
				var distance = null;
				var json = $.parseJSON(data);
				$( "#camlist" ).empty().append('<li data-role="list-divider">'+toll_desc+'</li>');

				try {
					//=======================================================================
					$(json).each(function() {

						console.log(JSON.stringify(this));

						var li = $( '<li swatch="a" style="text-align:left;">' );
						distance = this.distance;			

						li.append(getClassIcon(c,this.transCode)+'<span>Class '+this.transCode+'</span><span class="ui-li-count ui-btn-up-b ui-btn-corner-all" style="line-height: 20px;padding:0px 9px 0px 9px;font-size:14px">RM '+parseFloat(this.rate, 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString()+'</span>')
						$( "#camlist" ).append(li);

				});

				//=======================================================================
				// camname(json.query.results.camera);

			}
			catch(err) {
				//Block of code to handle errors
			}
			finally {
				$('#back2cam').hide();
				$('#back2toll').show();
				$.mobile.changePage("#pagedetail", { transition: "slide",role: "page" });
				if($( "#camlist li" ).length>=1){//ADVERT
					// $( "#camlist" ).append('<li swatch="a"><center>'+$( "#myads ins" ).html()+'</center></li>');
				};
				if(distance){$( "#camlist" ).append('<li data-role="list-divider">Distance '+distance+' km</li>');};
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

function hcodeimg(cp){
	var result=undefined;
	if(hcode){
          	$(hcode).each(function() {
						if(this.highwayCode.trim()==cp.trim()){
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

function hcodeimg2(cp){
	var result=undefined;
	if(hcode){
          	$(hcode).each(function() {

          				if(cp!=undefined){
							if(this.highwayTollCode==cp){
								result = this.datatype+','+this.data;
							};          					
          				}
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

function getClassIcon(h,cp){
	console.log(h+':'+cp);
	// return '<img style="margin:5px;vertical-align:bottom;filter: invert(50%);" src="https://maxcdn.icons8.com/windows8/PNG/64/Transport/motorcycle-64.png" title="Bike" width="64">';
	var sepeda_motor = 'data:image/png;base64,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';
	
	// return '<img style="margin:5px;vertical-align:bottom;filter: invert(50%);" src="https://maxcdn.icons8.com/windows8/PNG/64/Transport/car-64.png" title="Car" width="64">';
	var mobil = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAABEVBMVEX///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATS2/0AAAAWnRSTlMAOKCwKNnB+tL+9s17QNAaVAklUiMm4K0ijBCo9/w6ryqUOQYnfdE2fHD7BKGSndpFhVphU2UMqvipW64K6inpBQNyXVdeGQ6rww2xgcjJIGBWEln5xbyzgGkTlVAsAAABvklEQVRYw+2W1ZLCQBBFkUBwd1ncFl0WWXd3l/z/h+x2UgQC3Q2p4jH3aVKn+xQzmZlgMhkxYoRKftjOWReSaw/zK7WfbGUlItmH0xUE+xKT3eX9FxKb12X9B8e84HC0RHAJVZs/RfNCisrabC8R2KEojbMbYLd8f0j+nWYcbsgwxAoqUPJI0SegFVbgYKf5AtTB9ZflJXyjcOoDeJkR1KHgi+bfwOuMoAoFvzQ/B16leRS484ouuN6BiijJPYA/uUW6hwoPiX2AzzjBHlT42BlIz5zgLsPNQZ6Bm9+qOW4OPn6Cct6ZOSjn4IgXjFzUeWh0JR3pNvCTpiMbc4KCXkFhTmDRK7CgAlcyHE666K4ZjgpiAgyFGNU/yzGB06uMvU68X8MxgW3yYMMFGo4J4pOHOC7QcEygHgM3LtBwTCBGlHFExAUajr4FexCGQTv1FmY5vg9sAb8/YKP3wQy3rHsndvQKOnOCgV7BYE7QTIt62sV0c+FGqU0X20xk+npqyJUkqNRK3WdWtURAaEKlY0owVksS5Kcd0qcE/UkF/onvKYZMq0QJSq2M0t8jChLCf1LcrZ6CioTxZ97I2vMHlqVuTxCUDScAAAAASUVORK5CYII=';
	
	// return '<img style="margin:5px;vertical-align:bottom;filter: invert(60%);" src="https://maxcdn.icons8.com/windows8/PNG/64/Transport/truck-64.png" title="Truck" width="64">';
	var truk = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAiEgAAIhIBv2R/3AAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAP0SURBVHic7dpfiFVVFAbw354ck0lqBFQbUSkkMAsKTPEp9CWJqKeIgDCgorfCl3pLCbDHgJ6MqCAqCA2IYigkCaJBCI1IBFUCTBo10iFVdHQFeG4dr3fOnHPnz7kz936w4d611/r2Wt+5+8/sOSkidDP66k6gbvQEqDuButEToO4E6kZPgLoTqBtdL8ACgJTSKtxVYy5jEXG6joEfwwiiA9oPWB8RZqvBlx1QeL59OJsCJFzDAoAOwLmIWDpbg/XprOKhfzYH6/pdoCdA3QnUjZ4AdSdQNzptB2iJlNJDWFvSPfBLRPxelr/ug09zO587pQ3gYJs8I1hX5iRYd8FFAmyfItcprCkSoNPXgMenGL8S36SUBiZy6HQBpiO/B/HuRJ1zYhGcAOfwdQt7P57EIABeTil9FxFftCKqe84XrQEfFfiNFCxsy/Fnk//fWqwHnT4F2kJEjOJFBAAG8VlKaQEAzEsBICKG3T73N2MXAMxbAQBv4nCzLaW0BWBeCxARV/E8LgGgD5+klJZAH+Y1IuIoXm8yD2E3XSAARMT72NtkfiWltLIrBAC8iksASHiqawSIiHP4uMn89Fw+Ca5KKb1TMWYJAGDrXBZgCG9MkWNR10yBidAToO4E6kZPgLoTqBtT2QVGcRjwCJajDlzFbziBtViHO6sQVLmsGMNrWNHiEmJF1jdWkbPdC5FhbEB/Ux4LMvtwyfFKJ7YXQyWumYcy35kSYBTPlXz54RmcwpQF+AqpxQCrsbqFPWUx0y3AFWxoMd4A1mNRi75HcQltC3AcgznCxXgPZ3M+ZzPb4pzfYBY7nQK81FTcEziMcQSuYQSbm/xeKBLg+iQJbc0RrcHJAt+TcheP2NqGAH/l4j/I2b9tKmp3Acd17Gjy/34Cv8LFYhR9uZ/1/hIF7JdNF/RhtKIAn+eSfrbV08cTmIxnHJtyMTta+AzDFhybgGRPjmBbhSK25eL2VIg7go252H58istYmrMfLsl3IBfzQFPfMWxpPCkppYdxFwDgZEScyfrfwk7lsDMidmVxy3B/iZixiDjSqiOlNBgR57PPAxjDHSU4L+LuiLiRxW5EHy5GxK+wAKBhKEDZf0/f4psJeKZC7G1oFA+4T7ni4S7ciz8ynoPNDlWOwkdnyLcqTmAcZTCGwrdPqwjw4wz5VkJEXMHPJd1/iogABYSlG/aZfOHZV4WznYbNmGz7vqzEa7dVB16GQwWDHsKymRYgt62NFxS/vRRPGwMvxNs4jhtZO57ZFs5G8blcNuEA/kHgAoZR+oXrFBGgHaSU7oGIuNA2yTQgpdSHe3E6KhY0JQHmA7r+RqgnQN0J1I2eAHUnUDe6XoB/AawudUJtH3dJAAAAAElFTkSuQmCC';
	
	// return '<img style="margin:5px;vertical-align:bottom;filter: invert(80%);" src="https://maxcdn.icons8.com/windows8/PNG/64/Transport/bus-64.png" title="Bus" width="64">';
	var bis = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAACISAAAiEgG/ZH/cAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAYlQTFRF////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeR+wnAAAAIJ0Uk5TAAEDBAYHCAkKCw4PEBIYGR0gISMkKCsuMDE0NTY3ODo9PkJERkdISU9QUlVXWltdX2JkZWhtbm9wcXZ3eHp7gYSFiImKjI+UlZaXmZqcnZ6foKSlpqqrrq+wsbS1uLu8v8HCw8jLzM3S1NjZ2t7h4uPk5ebn6e7w8vP19vj5+/z9/gLkLjcAAAJkSURBVFjD7ZdtVxJBGIY30TQyIQx7USvNUkPtxd7TjA1SyzJDEQu01ArTsBSQNCWuX96HFTrszO7sxumcPnR/47nnvoCZZ/YBTfsvC3mbBXldxIfSSJQecppv3EGqnUaHgF4gP3K9SiN5oNdZvm4UmDRXJ4HROgfx1vAWwHpXsEpd6wBb4VZF3BMtYatS1GOX9y2j1LLPOt+yjQNtt1gC5nGkeat8qLzi+8aHxfiLqK7ruh55OjH1KjaXePtpv0IIyfP1OQCKyVCD3D936+UPAHL10gXdAOyfttvls8YudUvNCACPFdcEgIjUSwNsHrUHHPkGkJb2AABTqk59DYCsF64AcE0FuAnAZYlzH4CTKsApAO5InOcAm+rb9hVgQmK8B5hTA+IAixIjB/BADXho8UlP2HRIlS4BlJqE+gWA0nE1wHinM0L9BsCGk0feF4ABofwEYNYJIA7wSCjPOrgIhsIAz4TyO4C7TgD3AN4I5c8Ag04AgwAfhXIBQHcC0AGy5uoxAPIBdT6QB/jpkd4RinFdoXjRWOk3AS7iUudNgAG3gKuys3Gj27JGdCPzgU27BUybADNuATP/LqCQGl/ak2f2lsZTBRUg5dM0LbAiy68ENE3zpewBa8Zg9mbEfMb4pdmwZgvoO3w5LAKGD60+W0B55rWJgLaqGfrXADV/hZo3seZjrL2R/riV9VqfBz1uAT0mQNOuu/yuMN87s27y2U5xYHS4AXRIJk6w4iabLZSsLAnaAhasptqCLcBfcWNWgFhliV9mr5bdfitAf3nFqtRuTxwAZMYs/1Z5xjIAB4n237VfhHpG6HrIj0AAAAAASUVORK5CYII=';
	
	// return '<img style="margin:5px;vertical-align:bottom;filter: invert(80%);" src="https://maxcdn.icons8.com/windows8/PNG/64/Transport/taxi-64.png" title="Taxi" width="64">';
	var taksi = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAABBVBMVEX///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACaYAF0AAAAVnRSTlMAsIigKAr0VKT++yIJuVnHU6mBA/Dd63yRdJ4C0iv2F6jt7pv3ODfxiwX1L1uqHGo0VeBgOuUBg3oQZvIOjBh1TyfbQOqZ57GOogTalCYHvym9TD2PXYgHLwkAAAHwSURBVFjD7ZdnU8JAEIZpoXcVG0jHhiIoFor0am/3/3+KbiAhCXsLZ/ni8H5K5tl9Jntz3Bwm0yqr/G0OW7ZpWoff6b/uMjXda/H+uJtp4o4LC/JMl7yw4FwvOBfrPs1lr/SCq2zudNluj6/K0FRfbMv0v+4zbvY+llj9FCOSeVgoSDAyT4v6n+Wy1MA8l8Hk094WCN6h6E7CkHQHLE33PyahqIDDArB9LykoQk1SwqEk24uk4ARKLDxqAXpC9UtHUHLMw8dAjyRC4ICKNp+3gTsIQYicYDpDiJjADgVn/IIz4Hb+DEHgJWqRSlARpCcYUoIhOYNXnuCCElzIM3ipCcqXlOCyTM0g/xDv6b1+DzUJaoIOLehwZ7ipOIG5DixkDlxQ5azcGPtvM0womVuDoMEE0zAIrKICKy6I+HwRqm3GUYF7c81kWtt089q1HBVsT563eQItxwQbu5Pn3Q28X8cxgVN5ceICHccEO8rLDi7QcUwQVV6iuEDH0UX0T579vEXUclSwLp+XjnWeQMs5GymwtRWgNtKMW397K4dFBWHjvcYl1u/yGA+EWE+FfTMnfbWkF5s/kmwqNfPOM7Nagt22fiyo7Sm0zhPU1dtaDcMjZX1iPEFMWekRisfNtPUrYQ9xBw1DRbo5Xv0Z+mf5BCwoa2DY00vuAAAAAElFTkSuQmCC';
	
	// return '<img style="margin:5px;vertical-align:bottom;filter: invert(70%);" src="https://maxcdn.icons8.com/windows8/PNG/64/Transport/interstate_truck-64.png" title="Interstate Truck" width="64">';
	var truk_gede = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAACISAAAiEgG/ZH/cAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAaRQTFRF////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQLxdlgAAAIt0Uk5TAAECAwUGCAkKDA0ODxAREhQVFxohIiMmJygpKiwtLjIzNDU4OUBCQ0dKTFBSV1pdX2BhY2dobG1ucXJ1d3t9foKEiIqMjY6SlJmanqCkpamqq62usLKztLW3uru9v8HCw8TFxsjJy83O0tXX2Nrc3t/g4eLj5Ojp6+zu7/Dx8vP09fb3+Pn6+/z9/r7gF/cAAAMASURBVFjD7ZZXVxNRFIW3AYXQLBijsYAFQSPYsAY1URQFFMSxAYJIxJqo2FARkGbg+9M+JODNZGaSsHxwudxPc88+8926zr1SRoF73yhY3+4FZFPVR4rSxyob4DRF6rQN0FksoNMG6C4W0P1XA5aTVndHLNJ6fFWtkVhHt5VcLgQwGjlYLRdVH4yMegNm2kNm0OffEghs8fvMWKh9xh0wsFWSVBIMX7j1/N3E7EpvsxPvnt+6EA6WSJK2DrgB+iRJwc5Zt4Wb7QxKkvqcAeM1kur7lrzWfqmvXlLNuCOgQVLjfL7tm2+U1JALuBgfkFQ5ZebOfXn/6tmzV++/zJnRqUpJA/GLjvvUms4ZvxNt3mUuvs+/qzl6Zzzttspd/QAPm9Y5u+ua+gH6HazajtG2ckkfADa6d7AR4IOk8rbRjlpbz1HJvwxMeIxQE8CyX4pmj6QC4KVUBzDiBRgBqJNeAlT8PuMAr6UWgC4vQBdAi/QaoDoHEAVo8wK0kZ6sC6AXIOwFCAP0ugJeAIS8ACGAF24A3xyQWu8FWJ8C5nx2gC8B3FQAIClPJQECugkkjKPalOBxUIcAHngDHgAcUvAxiaas2lMp6TzA4qSnFgHOS6r05dJvFFqRb7gMb6hQwJAL4HOhgM/O/9cUfqvUOAIOGBk/Ipuyzc2Xpg37gCPghJFxPde+atgnnGrKkUEjY29uQr1hDx6ptbmlsVTWJHfkAnZkJaRipVmuZVulvACwTPMoxQM4apjDawEMG+YkwNiZ48eOnXzkCVg4u3P74Vi4B2DSeOMBTKcfbuVTXoDb6e+y7wBVORVJkhR3KUshgMuZhlNFepNpPHV6BUo6B3At03jjAGCfJGnbIkBij/3/4FuA5AZJ0j6cAKlBy7L6FzNr/MTK0kjmgfX1rmVZgylHQNH6pwAl+9ekEv0xlYbXpNL/2/ivAsaq82rMExDPf+riDoCyn6t3Vn7A6g34s+x38P5K8FR+wKmV3PtGcHfPAsCnK/78AP+VTwALPbslSb8A9VJpfPQ5RQsAAAAASUVORK5CYII=';

	switch(cp) {
	    case 0:
	        return '<img style="margin:5px;vertical-align:bottom;filter: invert(50%);" src="'+sepeda_motor+'" title="Bike" width="64">';
	        break;
	    case 1:
	    	if(h==5){//Penang Bridge Different Categories
	    		return '<img style="margin:5px;vertical-align:bottom;filter: invert(50%);" src="'+sepeda_motor+'" title="Bike" width="64">';
	    	}else{
				return '<img style="margin:5px;vertical-align:bottom;filter: invert(50%);" src="'+mobil+'" title="Car" width="64">';
	    	}    	
	        break;
	    case 2:
	    	if(h==5){//Penang Bridge Different Categories
	    		return '<img style="margin:5px;vertical-align:bottom;filter: invert(50%);" src="'+mobil+'" title="Car" width="64">';	    		
	    	}else{
				return '<img style="margin:5px;vertical-align:bottom;filter: invert(60%);" src="'+truk+'" title="Truck" width="64">';
	    	}	        
	        break;
	    case 3:
			if(h==5){//Penang Bridge Different Categories
	    		return '<img style="margin:5px;vertical-align:bottom;filter: invert(80%);" src="'+bis+'" title="Bus" width="64">';
	    	}else{
				return '<img style="margin:5px;vertical-align:bottom;filter: invert(90%);" src="'+truk_gede+'" title="Bigger Trucks" width="64">';
	    	}	    	
	    	break;
	    case 4:
			if(h==5){//Penang Bridge Different Categories
	    		return '<img style="margin:5px;vertical-align:bottom;filter: invert(80%);" src="'+bis+'" title="Bus" width="64">';
	    	}else{
				return '<img style="margin:5px;vertical-align:bottom;filter: invert(80%);" src="'+taksi+'" title="Taxi" width="64">';
	    	}	    	
	    	break;
	    case 5:
	    	return '<img style="margin:5px;vertical-align:bottom;filter: invert(80%);" src="'+bis+'" title="Bus" width="64">';
	    	break;
	    default:
	        return '<img style="margin:5px;vertical-align:bottom;filter: invert(90%);" src="'+truk_gede+'" title="Bigger Trucks" width="64">';
	} 

}

var checkver = function (){
  var result=false;
  dVERSION=$.jStorage.get("ltver",999);
  console.log(dVERSION);
  $.ajax({
          method: "GET",
          url: "http://api.nakedmaya.com/llmtrafik/hcode",
          dataType: "text",
		  beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
          success: function(data) {
            var json = $.parseJSON(data);
            if (dVERSION==json.version){
              result=true;
              hcode = $.parseJSON($.jStorage.get("lthcode"));
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
