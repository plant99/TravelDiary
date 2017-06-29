var express = require('express')
var router = express.Router() ;

router.get('/',function(req, res, next){
	res.render('dashboard',{message:''})
})
router.post('/',function(req, res, next){
	console.log('Post recieved')
	Journal.findOne({header: req.body.title, position: req.body.position}, function(err, journalCheck){
		if(journalCheck){
			console.log(journalCheck)
			res.render('dashboard',{message:'Sorry, a journal with the same parameters exists.'})
		}else{
			console.log(req.params)
			var journal = new Journal({
				header:req.body.title,
				content: req.body.journal,
				position: req.body.position,
				type: req.body.type,
				author: req.decoded._doc.username
			})
			console.log(journal)
			journal.save(function(err, journalSaved){
				console.log(journalSaved) ;
				User.findOne({username: journalSaved.author},function(err, user){
					user.journals.push({header:journalSaved.header, position:journalSaved.position})
					user.save(function(err, savedUser){
						res.render('dashboard',{message:'Your journal was successfully saved'})
					})
				})
			}) 
		}
	})
})
module.exports = router ;