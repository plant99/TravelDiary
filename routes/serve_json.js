var express = require('express')
var router = express.Router() ;
// for making http requests
var request = require('request');
router.get('/public_journals', function(req, res, next){
	Journal.find({type:'public'}, function(err, journals){
		if(err){
			res.json({success: false})
		}else{
			res.json({success: true, journals:journals})
		}
	})
})

router.post('/journal_details', function(req, res, next){
	console.log('Data requested')
	var position = req.body.lat_lng;
	Journal.findOne({position:position}, function(err, journal){
		res.json({journal:journal})
	})
})
router.get('/nearby_journals', function(req, res, next){
	var origins = req.query.position.replace('-',',')
	var destinations = ''
	Journal.find({type: 'public'}, function(err, journals){
		var length = journals.length ;
		for(var i=0 ;i< length ;i++){
			if(i < length - 1){
				destinations = destinations + journals[i].position.replace('-',',') + '|' ;
			}else{
				destinations += journals[i].position.replace('-',',')
			}
		}

		var url = 'https://maps.googleapis.com/maps/api/distancematrix/json?origins='
		var urlWithParams = url + origins + '&destinations=' +destinations +'&key=AIzaSyCWgSeojkToJ_M9K70mM-GkC-UijpHHjtQ' ;
		console.log(urlWithParams)
		var journalsNearby = [] ;
		request(urlWithParams, function(error, response, body){
			if(error)
			console.log('error:', error); // Print the error if one occurred
		  	console.log(body)
		  	if(body){
		  		var body= JSON.parse(body)
		  	}
		  	var elements = body.rows[0].elements 
		  	console.log(elements)
		  	for(var i=0 ;i<elements.length ;i++ ){
		  		console.log(elements[i].status)
		  		if(elements[i].status === 'OK'){
		  			var km = body.rows[0].elements[i].distance.text.split(' ')[0]
		  			if(km <= 500){
		  				journalsNearby.push(journals[i])
		  			}
		  		}
		  	}
		  	res.json({journalsNearby:journalsNearby})
		  	/*
		if(status){
		  		console.log(body.rows)
		  		var elements = body.rows[0].elements// Print the HTML for the Google homepage.
		  		console.log(elements)
		  	}		
		  	*/
		})
	})
})	
module.exports = router ;
/*request('https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=20.880,83.8950&destinations=21.4699,83.9812&key=AIzaSyCWgSeojkToJ_M9K70mM-GkC-UijpHHjtQ', function (error, response, body) {
	  console.log('error:', error); // Print the error if one occurred
	  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
	  console.log('body:', body); // Print the HTML for the Google homepage.
	});*/