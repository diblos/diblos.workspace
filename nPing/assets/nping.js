	var TrackerCount = 0;
	var storeCount = 0;
	var autoToggle = false;            
	var t;var min = 15;
	var isWeb = false;

$(document).ready(function() {reloadStorage();$('select').change(function() { var option = $(this).val(); if (option !== "") { HideBoxes($(this).attr('id'), option); } }); for (i = 1; i <= TrackerCount; i++) { $('#STATUS' + i).css("text-align", "center"); } ;if(!isWeb){$("#footerText").hide();}else{$("#footerText").show();}});

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

				var nURL = "http://app.nakedmaya.com/nPing/nPing.php?ip=" + obj.find('span:first').text() + "&Q=" + Math.random();
                $.ajax({
                    url: nURL,
                    context: document.body,
                    cache: false,
                    dataType: "xml"
                }).done(function(xml) {
                    $(xml).find('members').each(function() {
                        var status = $(this).find("status").text();
                        var summary = $(this).find("summary").text();
						
						if (status=='ONLINE'){
						obj.css('background-color','green');
						obj.find('span:last').text('online');
						}else{
						obj.css('background-color','red');
						obj.find('span:last').text('offline');
						}

                    });                    
                });
            }
			
			function ProcessBatch(opt) {
			PingColor();
			for (i = 0; i < opt.length; i++) {
			$('#STATUS' + (i+1)).val("Pinging");
			$('#DESC' + (i+1)).val("");
			var nURL = "http://app.nakedmaya.com/nPing/nPing.php?ip=" + opt[i] + "&Q=" + Math.random();
			GetStatus(nURL, i + 1);
			}}

            function GetStatus(nURL, id) {
                $.ajax({
                    url: nURL,
                    context: document.body,
                    cache: false,
                    dataType: "xml"
                }).done(function(xml) {
                    $(xml).find('members').each(function() {
                        var status = $(this).find("status").text();
                        var summary = $(this).find("summary").text();
                        $('#STATUS' + id).val(status);
                        $('#DESC' + id).val(summary);
                        UpdateColor(id);                        
                    });                    
                });
            }

            function PingColor() {$('.inputConnected').removeClass("inputConnected").addClass("inputCrowd");$('.inputDisconnected').removeClass("inputDisconnected").addClass("inputCrowd");}
            function UpdateColor(id) {
			if ($('#STATUS' + id).val()=="ONLINE") 
			{$('#STATUS' + id).removeClass("inputDisconnected").addClass("inputConnected");}
			else
			{$('#STATUS' + id).removeClass("inputConnected").addClass("inputDisconnected");}
			}
            function clock() {var now = new Date();var DtStr = (now.getDate()) + '/' + (now.getMonth() + 1) + '/' + now.getFullYear();var TmStr = now.getHours() + ':' + ('0' + now.getMinutes()).slice(-2)  + ' ' + meridiem(now.getHours());return DtStr + ' ' + TmStr;}
            function meridiem(hour) { if (hour > 11) { return 'AM'; } else { return 'PM'; }}

			function Auto() {if (autoToggle === true) {autoToggle = false;$('#Button2').html('Automatic Ping ON');$('#Button1').removeClass('ui-disabled');clearTimeout(t);} else {autoToggle = true;$('#Button2').html('Automatic Ping OFF');$('#Button1').addClass('ui-disabled');GetThere();}}
			function Reset(){$('#dServers').empty().append('<li data-role="list-divider">Remote Servers</li>').listview( "refresh" );$('#someDivInsideTheFormThatWillHoldTheControl').empty();resetStorage(TrackerCount);TrackerCount=0;$('#someDivInsideTheFormThatWillHoldTheControl').append('<tr><td class="notes" colspan="4">No server available. Please add manually.</td></tr>');}
			
			// ==============================================================================================================================
			
			function supportsLocalStorage(){if(typeof(Storage)!=="undefined"){return false;}else{return true;}}
			
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
                //xAlert("","","");
                alert(err.message);
            }

				}                
			}
