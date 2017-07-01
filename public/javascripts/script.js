var $create = $('.create')
var $browse = $('.browse')
var $createBoard = $('.create-board')
var $browseBoard = $('.browse-board')
var map1 = document.getElementById('map1') ;
var addForm = document.querySelector('.addForm') ;
var viewJournal = document.querySelector('.viewJournal')
var nearbyList = document.querySelector('.nearbyList')
var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
var trichy = {lat: 10.75, lng: 78.19};
var markerToFindNearby ;
var destinations = '' ;
var origins= '' ;
response = null ;
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
   	if(markerToFindNearby){
   		markerToFindNearby.setMap(null)
   	}
   	markerToFindNearby = new google.maps.Marker({
   		position:e.latLng,
   		map:map2,
   		icon: image
   	})
   	origins = e.latLng.lat() +','+e.latLng.lng() ;
   	$.get('/serve_json/nearby_journals',{
      position: origins.replace(',','-')
    },function(responseText){
      var journals = responseText.journalsNearby ;
      nearbyList.innerHTML = ''
      //create Title for the post
      var header = document.createElement('h2')
      header.innerHTML = 'JOURNALS MADE NEARBY' ;
      nearbyList.appendChild(header)
      for(var i=0 ;i<journals.length ;i++ ){
        var header = document.createElement('h2')
        var content = document.createElement('p')
        content.setAttribute('class', 'detailNearby')
        var nearbyJournal = document.createElement('div') ;
        nearbyJournal.setAttribute('class', 'nearbyJournal') ;
        nearbyJournal.setAttribute('data-pos', journals[i].position) ;
        console.log(journals[i])
        header.innerHTML = journals[i].header ;
        content.innerHTML ='BY: '+ journals[i].author ;
        nearbyJournal.appendChild(header);
        nearbyJournal.appendChild(content) ;
        nearbyList.appendChild(nearbyJournal) ;
        nearbyJournal.setAttribute('id',journals[i]._id)

        //onclick event handler for nearbyJournal
        nearbyJournal.onclick = function(e){
          if(e.target.getAttribute('class') === 'nearbyJournal'){
            //for div
            var header = e.target.childNodes[0].innerHTML ;
            var author = e.target.childNodes[1].innerHTML.slice(3)
            var position = e.target.getAttribute('data-pos') ;
            console.log(author, position)
            $.post('/serve_json/journal_single_details',{_id:e.target.getAttribute('id')}, function(responseText){
              viewJournal.innerHTML = ''
              var header = document.createElement('h1')
              var container = document.createElement('pre')
              var content = document.createElement('div')
              header.innerHTML = responseText.journal.header ;
              content.innerHTML = responseText.journal.content ;
              var footer = document.createElement('footer')
              footer.innerHTML = 'author: ' + responseText.journal.author + '<br>Created on: ' + responseText.journal.date.slice(0,10) ;
              container.appendChild(content)
              viewJournal.appendChild(header);
              if(responseText.journal.image){
                var image = document.createElement('img')
                image.src = '/serve_image/'+responseText.journal.image;
                viewJournal.appendChild(image)
              }
              viewJournal.appendChild(container) ;
              var journal = responseText.journal ;

              if(journal.links.length){
                var h3 = document.createElement('h3')
                h3.innerHTML = 'LINKS FOR MORE COOL DATA'
                viewJournal.appendChild(h3)
                var ul = document.createElement('ul')
                for(var j=0 ;j<journal.links.length ;j++){
                  var li = document.createElement('li') ;
                  li.innerHTML = journal.links[j] ;
                  ul.appendChild(li)
                }
                viewJournal.appendChild(ul) ;
              }
              viewJournal.appendChild(footer)
            })

          }else{
            //for its children
            var parent = e.target.parentNode ;

            var header = parent.childNodes[0].innerHTML ;
            var author = parent.childNodes[1].innerHTML.slice(3)
            var position = parent.getAttribute('data-pos') ;
            $.post('/serve_json/journal_single_details',{_id:parent.getAttribute('id')}, function(responseText){
              viewJournal.innerHTML = ''
              var header = document.createElement('h1')
              var container = document.createElement('pre')
              var content = document.createElement('div')
              header.innerHTML = responseText.journal.header ;
              content.innerHTML = responseText.journal.content ;
              var footer = document.createElement('footer')
              footer.innerHTML = 'author: ' + responseText.journal.author + '<br>Created on: ' + responseText.journal.date.slice(0,10) ;
              container.appendChild(content)
              viewJournal.appendChild(header);
              if(responseText.journal.image){
                var image = document.createElement('img')
                image.src = '/serve_image/'+responseText.journal.image;
                viewJournal.appendChild(image)
              }
              viewJournal.appendChild(container) ;
              var journal = responseText.journal ;

              if(journal.links.length){
                var h3 = document.createElement('h3')
                h3.innerHTML = 'LINKS FOR MORE COOL DATA'
                viewJournal.appendChild(h3)
                var ul = document.createElement('ul')
                for(var j=0 ;j<journal.links.length ;j++){
                  var li = document.createElement('li') ;
                  li.innerHTML = journal.links[j] ;
                  ul.appendChild(li)
                }
                viewJournal.appendChild(ul) ;
              }
              viewJournal.appendChild(footer)
            })
          }
        }
      }
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
              journals = responseText.journals ;
              console.log(journals)
              console.log('Starting doing', journals.length)
    					for(var i=0 ;i< journals.length ;i++){
                var header = document.createElement('h1')
                var container = document.createElement('pre')
                var content = document.createElement('div')
                var footer = document.createElement('footer')
                footer.innerHTML = 'author: ' + journals[i].author + '<br>Created on: ' + journals[i].date.slice(0,10) ;
                header.innerHTML = journals[i].header ;
                content.innerHTML = journals[i].content ;
                container.appendChild(content)
                viewJournal.appendChild(header);
                if(journals[i].image){
                  var image = document.createElement('img')
                  image.src = '/serve_image/'+journals[i].image;
                  viewJournal.appendChild(image)
                }
                viewJournal.appendChild(container) ;
                if(journals[i].links.length){
                  var h3 = document.createElement('h3')
                  h3.innerHTML = 'LINKS FOR MORE COOL DATA'
                  viewJournal.appendChild(h3)
                  var ul = document.createElement('ul')
                  for(var j=0 ;j<journals[i].links.length ;j++){
                    var li = document.createElement('li') ;
                    li.innerHTML = journals[i].links[j] ;
                    ul.appendChild(li)
                  }
                  viewJournal.appendChild(ul) ;
                }

                viewJournal.appendChild(footer)

                console.log('Done da')
              }
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
/*
var journals = responseText.journals ;
      var success = responseText.success ;
      var length = journals.length ;
      var url = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&';
      for(var i=0 ;i<length ;i++){
        var latLng = journals[i].position.replace('-',',');
        if(i<length-1){
          destinations = destinations + latLng +'|';
        }else{
          destinations += latLng ;
        }
      }
      var urlWithParams = url += 'origins=' + origins +'&destinations=' +destinations+'&key=AIzaSyCWgSeojkToJ_M9K70mM-GkC-UijpHHjtQ' ; 
      console.log(urlWithParams);
      
      var request = createCORSRequest("get", urlWithParams);
      if (request){
        request.setRequestHeader('origin', 'localhost:3000')
          request.onload = function() {
            if(this.status === 200 && this.readyState===4){
             document.body.innerHTML = responseText ;
            }
          };
        request.send();
    }

*/