	var TrackerCount = 0;
	var storeCount = 0;
	var autoToggle = false;            
	var t;var min = 15;
	var isWeb = true;

$(document).ready(function() {reloadStorage();$('select').change(function() { var option = $(this).val(); if (option !== "") { HideBoxes($(this).attr('id'), option); } }); for (i = 1; i <= TrackerCount; i++) { $('#STATUS' + i).css("text-align", "center"); } ;if(!isWeb){$("#footerText").remove();}});

$(function() {
	$('#btnAddServer').click(function() {AddServer($('input#text-server').val());$('#serverDialog').dialog('close');});
    $('#Button1').click(function() {GetThere();return false;});
    $('#Button2').click(function() {Auto();return false;});
	$('#saveConfig').click(function() {saveConfig();return false;});
    $('#someButton').click(function() {
		AppendServer();		
    });	
	$('#resetButton').click(function() {Reset();});
});
			function GetThere() {
			var c = $('#dServers li a');
			TrackerCount=c.length;
			c.each(function(){	GetStatus2($(this));});
			
			saveStorage();
		
			$('#display').text("Last ping:" + clock());
			if (autoToggle === true) { t = setTimeout(function() { GetThere(); }, min * 60000); }
			}
			
			function GetStatus2(obj) {
				
				$('#dServers').listview( "refresh" );
				obj.css('background-color','');
				obj.find('span:last').text('pinging');

				//var nURL = "http://app.nakedmaya.com/nPing/nPing.php?ip=" + obj.find('span:first').text() + "&Q=" + Math.random();
				var nURL = "nPing.php?ip=" + obj.find('span:first').text() + "&Q=" + Math.random();

				$.ajax({
					url: nURL,
					dataType: "text",
					beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
					complete: function() { $.mobile.loading('hide'); }, //Hide spinner
					success: function(data) {						 
						var json = $.parseJSON(data);
						$(json).each(function() {
                        var status = json.status;
                        var summary = json.summary;
						if (status=='ONLINE'){
						obj.css('background-color','green');
						obj.find('span:last').text('online');
						}else{
						obj.css('background-color','red');
						obj.find('span:last').text('offline');
						}
						});
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
       
            function clock() {var now = new Date();var DtStr = (now.getDate()) + '/' + (now.getMonth() + 1) + '/' + now.getFullYear();var TmStr = now.getHours() + ':' + ('0' + now.getMinutes()).slice(-2)  + ' ' + meridiem(now.getHours());return DtStr + ' ' + TmStr;}
            function meridiem(hour) { if (hour > 11) { return 'PM'; } else { return 'AM'; }}

			function Auto() {if (autoToggle === true) {autoToggle = false;$('#Button2').html('Auto Ping ON');$('#Button1').removeClass('ui-disabled');clearTimeout(t);} else {autoToggle = true;$('#Button2').html('Auto Ping OFF');$('#Button1').addClass('ui-disabled');GetThere();}}
			function Reset(){$('#dServers').empty().append('<li data-role="list-divider">Remote Servers</li>').listview( "refresh" );resetStorage(TrackerCount);TrackerCount=0;}
			
			// ==============================================================================================================================
			
			function reloadStorage(){
                
				min=$.jStorage.get("min",5);			
				$('#points').val(min);
				$('#points').slider('refresh');
				storeCount = $.jStorage.get("TrackerCount",0);
				Reset();                
				for (i = 1; i <= storeCount; i++){
				AppendServer($.jStorage.get('ip' + i ));
				//alert($.jStorage.get('ip' + i ));
				}
			}
			
			function saveStorage(){			
				$.jStorage.set("TrackerCount",TrackerCount);	
				for (i = 1; i <= TrackerCount; i++){
					$.jStorage.set("ip"+i,$('#IP' + i).text());
				}
			}
			
			function saveConfig(){
				min=$('#points').val();				
				$.jStorage.set("min",min);
			}
			
			function resetStorage(count){
					 // $.jStorage.deleteKey('TrackerCount');
					 // for (i = 1; i <= TrackerCount; i++){
						 // $.jStorage.deleteKey('ip'+i);
					 // }				
			}
			
			// ==============================================================================================================================
			
			function AppendServer(nCount){
			
			if(!nCount){
			$.mobile.changePage( '#serverDialog', { transition: 'slidedown',role: 'dialog' } );
			}else{
				AddServer(nCount);
			}

			}
			function AddServer(s){
                
			if(s.trim()!==''){
                
				TrackerCount=TrackerCount+1;
				var nCount=TrackerCount;
                
            try {
                
				$('#dServers').append('<li data-icon="false" swatch="b"><a href="acura.html"><span id="IP'+ nCount +'">'+s.trim()+'</span><span class="ui-li-count ui-btn-up-b ui-btn-corner-all"></span></a></li>');				
				$('#dServers').listview( "refresh" );				
				$('#dServers li a').click(function(){return false;});
                
            }
            catch(err) {
                alert(err.message);
            }

				}                
			}
