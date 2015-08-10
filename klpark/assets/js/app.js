var theader = '<tr><th>&nbsp;</th><th>Lokasi</th><th style="text-align:center;">Jumlah Kosong</th></tr>';
var tInterval = 60000;

$( document ).ready(function(){	Y();});

var notify = function(dMsg){$("#alert_placeholder").html('<div class="alert alert-warning fade in"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Warning!</strong> '+dMsg+'</div>');};
var URL = 'data.php';

var Y = function(){
		
			//beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
            //complete: function() { $.mobile.loading('hide'); }, //Hide spinner	
			count =1;
			$.ajax({
			method: "GET",
            url: URL,
            dataType: "xml",
            success: function(data) {
			
				//alert(data);
				
				//return false;
				 
				$('#table-list > tbody:last').empty();
				$('#table-list > tbody:last').append(theader);
				 
				try{
		
					$(data).find('MALL').each(function(){
					var xLokasi = $(this).find('NAME').text();
					var xPetak = $(this).find('LOT').text();
					var xTimestamp = $(this).find('DATETIME').text();
					
					if(xLokasi!==''){
					$('#table-list > tbody:last').append('<tr><td><span class="label label-info">'+ count++ +'</span></td><td style="text-align:left;">'+xLokasi+'</td><td style="text-align:center;"><span class="badge">'+xPetak+'</span></td></tr><tr>');					
					// var d = new Date(xTimestamp);
					$('#timestamp').html("Timestamp: "+xTimestamp);
					}					
					
					});

				}catch(err){
					alert(err.message);
				}	

						// $('#timestamp').html(Date());
						setTimeout(function(){Y();},tInterval);
				
				
            },
           	error: function(x, t, m) {
		        if(t==="timeout") {
		            setTimeout(function(){notify("err:timeout");},1000);
		        } else {
		        	notify(x+' '+t+' '+m);
		        }
    		}
        });
		

}