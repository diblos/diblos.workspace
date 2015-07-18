	var TrackerCount = 0;
	var storeCount = 0;
	var autoToggle = false;            
	var t;var min = 15;
	
//$(document).ready(function() {reloadStorage();if(TrackerCount==0){Reset();}; $('select').change(function() { var option = $(this).val(); if (option != "") { HideBoxes($(this).attr('id'), option) }; }); for (i = 1; i <= TrackerCount; i++) { $('#STATUS' + i).css("text-align", "center"); } });
$(document).ready(function() {reloadStorage();$('select').change(function() { var option = $(this).val(); if (option != "") { HideBoxes($(this).attr('id'), option) }; }); for (i = 1; i <= TrackerCount; i++) { $('#STATUS' + i).css("text-align", "center"); } });

$(function() {
    $('#Button1').click(function() {GetThere();return false;});
    $('#Button2').click(function() {Auto();return false;});
	$('#saveConfig').click(function() {saveConfig();return false;});
    $('#someButton').click(function() {
		//if(TrackerCount==0){$('#someDivInsideTheFormThatWillHoldTheControl').empty();};		
		//if(TrackerCount==10){return false;};
        // Add input control to the form:
        //TrackerCount=TrackerCount+1;
		AppendServer();
		//$('#someDivInsideTheFormThatWillHoldTheControl').append('<tr><td class="tcounter">' + TrackerCount + '</td><td class="tserver"><input name="IP'+ TrackerCount +'" type="text" value="" id="IP'+ TrackerCount +'" class="inputCrowd" style="height:18px;width:150px;" /></td><td class="tstatus" valign="top"><input name="STATUS'+ TrackerCount +'" type="text" id="STATUS'+ TrackerCount +'" class="inputCrowd" style="height:18px;width:80px;" /></td><td class="tdesc" valign="top"><input name="DESC'+ TrackerCount +'" type="text" id="DESC'+ TrackerCount +'" class="inputCrowd" style="height:18px;width:150px;" /></td></tr>');
    });	
	$('#resetButton').click(function() {Reset();});
});

            //function GetThere() {saveStorage();var submit = true;var myIPs = new Array();for (i = 1; i <= TrackerCount; i++) {myIPs[i-1] = $('#IP' + i).val();};if (!submit) {alert('Please check the IP list!');} else {ProcessBatch(myIPs);};$('#display').text("Last ping:" + clock());if (autoToggle == true) { t = setTimeout(function() { GetThere() }, min * 60000); };};
			function GetThere() {
			var c = $('#dServers li a');
			TrackerCount=c.length;
			c.each(function(){	GetStatus2($(this));});
			
			saveStorage();
			//var submit = true;
			//var myIPs = new Array();
			//for (i = 1; i <= TrackerCount; i++) {
			//myIPs[i-1] = $('#IP' + i).val();};if (!submit) {alert('Please check the IP list!');} else {ProcessBatch(myIPs);};
			$('#display').text("Last ping:" + clock());
			if (autoToggle == true) { t = setTimeout(function() { GetThere() }, min * 60000); };
			};
			
			function GetStatus2(obj) {
				
				$('#dServers').listview( "refresh" );
				obj.css('background-color','');
				obj.find('span:last').text('pinging');
				
				//alert(obj.find('span:first').text());				
				//return false;
								
				var nURL = "nPing.php?ip=" + obj.find('span:first').text() + "&Q=" + Math.random();
                $.ajax({
                    url: nURL,
                    context: document.body,
                    cache: false,
                    dataType: "xml"
                }).done(function(xml) {
                    $(xml).find('members').each(function() {
                        var status = $(this).find("status").text()
                        var summary = $(this).find("summary").text()
						
						if (status=='ONLINE'){
						obj.css('background-color','green');
						obj.find('span:last').text('online');
						}else{
						obj.css('background-color','red');
						obj.find('span:last').text('offline');
						}
						
                        //$('#STATUS' + id).val(status);
                        //$('#DESC' + id).val(summary);						
                        //UpdateColor(id);
						//alert(status);
                    });                    
                });
            }
			
            //function ProcessBatch(opt) {PingColor();for (i = 0; i < opt.length; i++) {$('#STATUS' + (i+1)).val("Pinging");$('#DESC' + (i+1)).val("");var nURL = "http://imt.itramas.com:8253/pingIP/nPing.aspx?ip=" + opt[i] + "&Q=" + Math.random();GetStatus(nURL, i + 1);};};
			//function ProcessBatch(opt) {PingColor();for (i = 0; i < opt.length; i++) {$('#STATUS' + (i+1)).val("Pinging");$('#DESC' + (i+1)).val("");var nURL = "nPing.php?ip=" + opt[i] + "&Q=" + Math.random();GetStatus(nURL, i + 1);};};
			function ProcessBatch(opt) {
			PingColor();
			for (i = 0; i < opt.length; i++) {
			$('#STATUS' + (i+1)).val("Pinging");
			$('#DESC' + (i+1)).val("");
			var nURL = "nPing.php?ip=" + opt[i] + "&Q=" + Math.random();
			GetStatus(nURL, i + 1);
			};};

            function GetStatus(nURL, id) {
                $.ajax({
                    url: nURL,
                    context: document.body,
                    cache: false,
                    dataType: "xml"
                }).done(function(xml) {
                    $(xml).find('members').each(function() {
                        var status = $(this).find("status").text()
                        var summary = $(this).find("summary").text()
                        $('#STATUS' + id).val(status);
                        $('#DESC' + id).val(summary);
                        UpdateColor(id);                        
                    });                    
                });
            }

            function PingColor() {$('.inputConnected').removeClass("inputConnected").addClass("inputCrowd");$('.inputDisconnected').removeClass("inputDisconnected").addClass("inputCrowd");};
            function UpdateColor(id) {
			if ($('#STATUS' + id).val()=="ONLINE") 
			{$('#STATUS' + id).removeClass("inputDisconnected").addClass("inputConnected");}
			else
			{$('#STATUS' + id).removeClass("inputConnected").addClass("inputDisconnected");}
			};
            function clock() {var now = new Date();var DtStr = (now.getDate()) + '/' + (now.getMonth() + 1) + '/' + now.getFullYear();var TmStr = now.getHours() + ':' + ('0' + now.getMinutes()).slice(-2)  + ' ' + meridiem(now.getHours());return DtStr + ' ' + TmStr;};
            function meridiem(hour) { if (hour > 11) { return 'AM'; } else { return 'PM'; };};
            //function Auto() {$('#Button1').toggle("slow");if (autoToggle == true) {autoToggle = false;$('#Button2').attr('value', 'Automatic Ping ON');clearTimeout(t);} else {autoToggle = true;$('#Button2').attr('value', 'Automatic Ping OFF');GetThere();};};
			//function Auto() {$('#Button1').toggle("slow");if (autoToggle == true) {autoToggle = false;$('#Button2').html('Automatic Ping ON');clearTimeout(t);} else {autoToggle = true;$('#Button2').html('Automatic Ping OFF');GetThere();};};
			function Auto() {if (autoToggle == true) {autoToggle = false;$('#Button2').html('Automatic Ping ON');$('#Button1').removeClass('ui-disabled');clearTimeout(t);} else {autoToggle = true;$('#Button2').html('Automatic Ping OFF');$('#Button1').addClass('ui-disabled');GetThere();};};
			function Reset(){$('#dServers').empty().append('<li data-role="list-divider">Remote Servers</li>').listview( "refresh" );$('#someDivInsideTheFormThatWillHoldTheControl').empty();resetStorage(TrackerCount);TrackerCount=0;$('#someDivInsideTheFormThatWillHoldTheControl').append('<tr><td class="notes" colspan="4">No server available. Please add manually.</td></tr>');};			
			function supportsLocalStorage(){if(typeof(Storage)!=="undefined"){return false;}else{return true;}};			
			
			function reloadStorage(){
			if (!supportsLocalStorage()) {
			if (localStorage.getItem("min")){
			min=localStorage.getItem("min");};
			$('#points').val(min);
			$('#points').slider('refresh');
			storeCount = localStorage.getItem("TrackerCount");
			Reset();
			for (i = 1; i <= storeCount; i++){
			//TrackerCount=TrackerCount+1;
			AppendServer(localStorage.getItem('ip.' + i ));
			//$('#IP' + i).val(localStorage.getItem('ip.' + i ));
			
			}}};
			
			function saveStorage(){
			if (!supportsLocalStorage()) {
			localStorage.setItem("TrackerCount", TrackerCount);
			for (i = 1; i <= TrackerCount; i++){
			localStorage.setItem('ip.'+i, $('#IP' + i).val());
			}
			
			}
			};			
			
			function saveConfig(){min=$('#points').val();if (!supportsLocalStorage()){localStorage.setItem("min", min);}};			
			function resetStorage(count){if (!supportsLocalStorage()) {localStorage.removeItem('TrackerCount');for (i = 1; i <= TrackerCount; i++){localStorage.removeItem('ip.'+i);}}};
			function AppendServer(nCount){
			//$('#someDivInsideTheFormThatWillHoldTheControl').append('<tr><td class="tcounter">' + nCount + '</td><td class="tserver"><input name="IP'+ nCount +'" type="text" value="" id="IP'+ nCount +'" class="inputCrowd" style="height:18px;width:150px;" /></td><td class="tstatus" valign="top"><input name="STATUS'+ nCount +'" type="text" id="STATUS'+ nCount +'" class="inputCrowd" style="height:18px;width:80px;" /></td><td class="tdesc" valign="top"><input name="DESC'+ nCount +'" type="text" id="DESC'+ nCount +'" class="inputCrowd" style="height:18px;width:150px;" /></td></tr>');
			//$('#dServers').append('<tr><td class="tcounter">' + nCount + '</td><td class="tserver"><input name="IP'+ nCount +'" type="text" value="" id="IP'+ nCount +'" class="inputCrowd" style="height:18px;width:150px;" /></td><td class="tstatus" valign="top"><input name="STATUS'+ nCount +'" type="text" id="STATUS'+ nCount +'" class="inputCrowd" style="height:18px;width:80px;" /></td><td class="tdesc" valign="top"><input name="DESC'+ nCount +'" type="text" id="DESC'+ nCount +'" class="inputCrowd" style="height:18px;width:150px;" /></td></tr>');
			if(!nCount){
			$.mobile.changePage( '#serverDialog', { transition: 'slidedown',role: 'dialog' } );
			}else{
				AddServer(nCount);
			}

			};
			function AddServer(s){
			if(s.trim()!=''){
				TrackerCount=TrackerCount+1;
				var nCount=TrackerCount;
				$('#someDivInsideTheFormThatWillHoldTheControl').append('<tr><td class="tcounter">' + nCount + '</td><td class="tserver"><input name="IP'+ nCount +'" type="text" value="'+ s.trim() +'" id="IP'+ nCount +'" class="inputCrowd" style="height:18px;width:150px;" /></td><td class="tstatus" valign="top"><input name="STATUS'+ nCount +'" type="text" id="STATUS'+ nCount +'" class="inputCrowd" style="height:18px;width:80px;" /></td><td class="tdesc" valign="top"><input name="DESC'+ nCount +'" type="text" id="DESC'+ nCount +'" class="inputCrowd" style="height:18px;width:150px;" /></td></tr>');
				$('#dServers').append('<li data-icon="false" swatch="b"><a href="acura.html"><span>'+s.trim()+'</span><span class="ui-li-count ui-btn-up-b ui-btn-corner-all"></span></a></li>');
				
				$('#dServers').listview( "refresh" );					
				
				$('#dServers li a').click(function(){return false;});
				
				}
			}
