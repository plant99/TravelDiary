var $create = $('.create')
var $browse = $('.browse')
var $profiles = $('.profiles')
var $createBoard = $('.create-board')
var $browseBoard = $('.browse-board')
var $profilesBoard = $('.profiles-board')
var $sort_buttons = $('.sort_buttons')
var map1 = document.getElementById('map1') ;
var addForm = document.querySelector('.addForm') ;
var viewJournal = document.querySelector('.viewJournal')
var nearbyList = document.querySelector('.nearbyList')
var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
var trichy = {lat: 10.75, lng: 78.19};
var markerToFindNearby ;
var destinations = '' ;
var origins= '' ;
var journalSelected = document.querySelector('.journalSelected')
var profile = document.querySelector('.profile')
response = null ;
$create.click(function(){
	$createBoard.css('display','block')
	$browseBoard.css('display','none')
  $profilesBoard.css('display', 'none')
  $sort_buttons.css('display','none')
})

$profiles.click(function(){
  $createBoard.css('display','none')
  $browseBoard.css('display','none')
  $profilesBoard.css('display', 'block')
  $sort_buttons.css('display','none')
})
$browse.click(function(){
	$createBoard.css('display','none')
	$browseBoard.css('display','block')
  $profilesBoard.css('display', 'none')
  $sort_buttons.css('display','block')

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
            var parent = e.target ;
            viewHandlerSidebar(parent) ;

          }else{
            //for its children
            var parent = e.target.parentNode ;

            viewHandlerSidebar(parent)
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
              var journals = responseText.journals ;
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
                var p = document.createElement('p') ;
                p.innerHTML = 'Liked it? Give it a vote'
                var span = document.createElement('span');
                span.setAttribute('class', 'vote') ;
                span.setAttribute('data',journals[i]._id)
                span.innerHTML = '<img class="like" src="/images/glyphicons/png/glyphicons-344-thumbs-up.png"> ('+journals[i].votes.number+')'
                span.onclick = function(e){
                  if(e.target.getAttribute('class') === 'like'){
                    var id = e.target.parentNode.getAttribute('data') ;
                    $.post('/stats/add_like/',{id:id}, function(response){
                      span.innerHTML   = '<img class="like" src="/images/glyphicons/png/glyphicons-344-thumbs-up.png"> ('+response.number+')'
                    })
                  }else{
                    var id = e.target.getAttribute('data') ;
                    $.post('/stats/add_like',{id:id}, function(response){
                      span.innerHTML   = '<img class="like" src="/images/glyphicons/png/glyphicons-344-thumbs-up.png"> ('+response.number+')'
                    })
                  }
                  span.onclick = null ;
                }
                p.appendChild(span)
                viewJournal.appendChild(p)
                
                var comments = journals[i].comments ;
                if(comments.length){
                  var h3 = document.createElement('h3')
                  h3.innerHTML = 'Comments'
                  var div = document.createElement('div') ;
                  div.appendChild(h3)
                  div.setAttribute('class','comments')
                  for(var j=0;j<comments.length ;j++){
                    var h4 = document.createElement('h4') ;
                    h4.innerHTML = comments[j].user ;
                    var p = document.createElement('p') ;
                    p.innerHTML = comments[j].comment ;
                    div.appendChild(h4) ;
                    div.appendChild(p)
                  }
                  viewJournal.appendChild(div)
                }else{
                  var div = document.createElement('div')
                  var h3 = document.createElement('h3')
                  h3.innerHTML = 'Comments'
                  div.appendChild(h3)
                  div.setAttribute('class','comments')
                  viewJournal.appendChild(div)
                }
                var div = document.createElement('div')
                div.setAttribute('class','addcomment') ;
                var input = document.createElement('input')
                input.setAttribute('class','comment')
                input.setAttribute('type','text') ;
                input.setAttribute('placeholder', 'Enter your comment here')
                var button = document.createElement('button')
                button.setAttribute('class','save');
                button.setAttribute('data',journals[i]._id)
                button.setAttribute('name',journals[i].username)
                button.innerHTML = 'Comment' ;
                button.onclick = function(e){
                  console.log(journals)
                  $.post('/stats/add_comment',{id: e.target.getAttribute('data'), comment: $('.comment').val()}, function(response){
                    if($('.comment').val()){
                      var h4 = document.createElement('h4') ;
                      h4.innerHTML = response.comments[response.comments.length - 1].user ;
                      var p = document.createElement('p') ;
                      p.innerHTML =  $('.comment').val();
                      var commentsDiv = document.querySelector('.comments') ;
                      commentsDiv.appendChild(h4) ;
                      commentsDiv.appendChild(p) ;
                    }
                    $('.comment').val('')
                  })
                }
                console.log('Done da')
                div.appendChild(input) ;
                div.appendChild(button) ;
                viewJournal.appendChild(div) ;
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

loadProfile()

//add click handlers to the journal_header_profile
function loadProfile(){
  var journalHeaderProfiles = document.querySelectorAll('.journal_header_profile')
  if(journalHeaderProfiles.length){
    for(var i=0 ;i< journalHeaderProfiles.length ;i++){
      journalHeaderProfiles[i].onclick = function(e){
        $.post('/serve_json/journal_single_details',{_id:e.target.getAttribute('data')}, function(responseText){

            journalSelected.innerHTML = '' ;
            var journal = responseText.journal ;
            var header = document.createElement('h1')
            var container = document.createElement('pre')
            var content = document.createElement('div')
            var footer = document.createElement('footer')
            footer.innerHTML = 'author: ' + journal.author + '<br>Created on: ' + journal.date.slice(0,10) ;
            header.innerHTML = journal.header ;
            content.innerHTML = journal.content ;
            container.appendChild(content)
            journalSelected.appendChild(header);
            if(journal.image){
              var image = document.createElement('img')
              image.src = '/serve_image/'+journal.image;
              journalSelected.appendChild(image)
            }
            journalSelected.appendChild(container) ;
            if(journal.links.length){
              var h3 = document.createElement('h3')
              h3.innerHTML = 'LINKS FOR MORE COOL DATA'
              journalSelected.appendChild(h3)
              var ul = document.createElement('ul')
              for(var j=0 ;j<journal.links.length ;j++){
                var li = document.createElement('li') ;
                li.innerHTML = journal.links[j] ;
                ul.appendChild(li)
              }
              journalSelected.appendChild(ul) ;
            }

            journalSelected.appendChild(footer)
        })
      }
    }
  }
}

var submitUsernameSearch = document.querySelector('.submit_username_search') ;
submitUsernameSearch.onclick = function(){
    var username = $('.search_username').val() ;
    var loggedUser = document.querySelector('.profile h2').innerHTML
    profile.innerHTML = ''
    $.get('/serve_json/user_journals/'+username, function(response){
        var journals = response.journals ;

        var h2 = document.createElement('h2') ;
        h2.innerHTML = loggedUser ;
        profile.appendChild(h2) ; 

        if(journals.length){
          var p = document.createElement('p') ;
          p.innerHTML = 'Following are the journals '+ username +' created:'
          var ul = document.createElement('ul') ;
          for(var i=0 ;i<journals.length ;i++){
            var li = document.createElement('li') ;
            li.innerHTML = journals[i].header ;
            li.setAttribute('data', journals[i]._id) ;
            li.setAttribute('class','journal_header_profile')
            ul.appendChild(li)
          }
          profile.appendChild(p) ;
          profile.appendChild(ul) ;
        }else{
          var p = document.createElement('p') ;
          p.innerHTML = 'Oops, we found no Journals from ' + username ;
          profile.appendChild(p)
        }
        loadProfile()
    })
}

//
var search_username = document.querySelector('.search_username') ;
search_username.onkeyup = function(){
  if(search_username.value){
    var list = document.querySelector('.suggestionBox ul') ;
    list.innerHTML = ''
    console.log(search_username.value)
    $.get('/serve_json/uname_suggestions/'+search_username.value, function(response){
      var usernames = response.usernames  ;
      if(usernames.length){
        for(var i=0 ;i< usernames.length;i++){
          var li = document.createElement('li') ;
          li.innerHTML = usernames[i] ;
          li.onclick = function(e){
            search_username.value = li.innerHTML ;
            list.innerHTML = '' ;
          }
          list.appendChild(li)
       }
      }else{
        var li = document.createElement('li') ;
        li.innerHTML = 'Oops, no suggestion.' ;
        list.appendChild(li)
      }
    })
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
function viewHandlerSidebar(parent){
  var header = parent.childNodes[0].innerHTML ;
  var author = parent.childNodes[1].innerHTML.slice(3)
  var position = parent.getAttribute('data-pos') ;
  console.log(author, position)
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
    var p = document.createElement('p') ;
    p.innerHTML = 'Liked it? Give it a vote'
    var span = document.createElement('span');
    span.setAttribute('class', 'vote') ;
    span.setAttribute('data',journal._id)
    span.innerHTML = '<img class="like" src="/images/glyphicons/png/glyphicons-344-thumbs-up.png"> ('+journal.votes.number+')'
    span.onclick = function(e){
      if(e.target.getAttribute('class') === 'like'){
        var id = e.target.parentNode.getAttribute('data') ;
        $.post('/stats/add_like/',{id:id}, function(response){
          span.innerHTML   = '<img class="like" src="/images/glyphicons/png/glyphicons-344-thumbs-up.png"> ('+response.number+')'
        })
      }else{
        var id = e.target.getAttribute('data') ;
        $.post('/stats/add_like',{id:id}, function(response){
          span.innerHTML   = '<img class="like" src="/images/glyphicons/png/glyphicons-344-thumbs-up.png"> ('+response.number+')'
        })
      }
      span.onclick = null ;
    }
    p.appendChild(span)
    viewJournal.appendChild(p)
    var comments = journal.comments ;
      if(comments.length){
        var h3 = document.createElement('h3')
        h3.innerHTML = 'Comments'
        var div = document.createElement('div') ;
        div.appendChild(h3)
        div.setAttribute('class','comments')
        for(var j=0;j<comments.length ;j++){
          var h4 = document.createElement('h4') ;
          h4.innerHTML = comments[j].user ;
          var p = document.createElement('p') ;
          p.innerHTML = comments[j].comment ;
          div.appendChild(h4) ;
          div.appendChild(p)
        }
        viewJournal.appendChild(div)
      }else{
        var div = document.createElement('div')
        var h3 = document.createElement('h3')
        h3.innerHTML = 'Comments'
        div.appendChild(h3)
        div.setAttribute('class','comments')
        viewJournal.appendChild(div)
      }
      var div = document.createElement('div')
      div.setAttribute('class','addcomment') ;
      var input = document.createElement('input')
      input.setAttribute('class','comment')
      input.setAttribute('type','text') ;
      input.setAttribute('placeholder', 'Enter your comment here')
      var button = document.createElement('button')
      button.setAttribute('class','save');
      button.setAttribute('data',journal._id)
      button.innerHTML = 'Comment' ;
      button.onclick = function(e){
        $.post('/stats/add_comment',{id: e.target.getAttribute('data'), comment: $('.comment').val()}, function(response){
          if($('.comment').val()){
            var h4 = document.createElement('h4') ;
            h4.innerHTML = response.comments[response.comments.length - 1].user ;
            var p = document.createElement('p') ;
            p.innerHTML =  $('.comment').val();
            var commentsDiv = document.querySelector('.comments') ;
            commentsDiv.appendChild(h4) ;
            commentsDiv.appendChild(p) ;
          }
          $('.comment').val('')

        })
      }
      div.appendChild(input) ;
      div.appendChild(button) ;
      viewJournal.appendChild(div) ;
    console.log('Done da')
  })
}

//logout handler
var logout = document.querySelector('.logout') ;
logout.onclick = function(){
  Cookies.remove('token',{url:'localhost:3000'}) ;
  location.href = '/login'
}