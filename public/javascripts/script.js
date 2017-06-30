var $create = $('.create')
var $browse = $('.browse')
var $createBoard = $('.create-board')
var $browseBoard = $('.browse-board')
var map1 = document.getElementById('map1') ;
var addForm = document.querySelector('.addForm') ;
var viewJournal = document.querySelector('.viewJournal')
var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
var trichy = {lat: 10.75, lng: 78.19};
$create.click(function(){
	$createBoard.css('display','block')
	$browseBoard.css('display','none')
})
$browse.click(function(){
	$createBoard.css('display','none')
	$browseBoard.css('display','block')

   map2 = new google.maps.Map(document.getElementById('map2'), {
      zoom: 4,
      center: trichy
    });
   map2.addListener('click',function(e){
   	map2.panTo({lat:e.latLng.lat(),lng: e.latLng.lng()})
   	var markerToFindNearby = new google.maps.Marker({
   		position:e.latLng,
   		map:map2,
   		icon: image
   	})
   	$.get('/serve_json/public_journals',function(responseText){
   		
   	})
   })

    $.get('/serve_json/public_journals', function(responseText){
    	var success = responseText.success ;
    	var journals = responseText.journals ;
    	markers = [] ;
    	if(success){
    		for(var i=0 ;i < journals.length ;i++){
    			var position = journals[i].position.split('-')
    			var marker = new google.maps.Marker({
    				position:{lat: Number(position[0]), lng: Number(position[1])},
    				map: map2
    			})
    			markers.push(marker)
    		}

    		for(var i=0 ;i< markers.length ;i++){
    			markers[i].addListener('click', function(e){
    				var queryPosition = e.latLng.lat()+'-'+ e.latLng.lng()
    				$.post('/serve_json/journal_details',{lat_lng:queryPosition}, function(responseText){
    					viewJournal.innerHTML = ''
    					var header = document.createElement('h2')
    					var container = document.createElement('pre')
    					var content = document.createElement('div')
    					header.innerHTML = responseText.journal.header ;
    					content.innerHTML = responseText.journal.content ;
    					container.appendChild(content)
    					viewJournal.appendChild(header);
    					viewJournal.appendChild(container) ;
    				})
    			})
    		}
    	}
    })
})

function showForm(){
	addForm.style.display = 'block' ;
}

window.onkeydown = function(e){
	if(e.keyCode === 27){
		addForm.style.display = 'none' ;
	}
}