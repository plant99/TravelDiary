var express = require('express')
var router = express.Router() ;

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
module.exports = router ;