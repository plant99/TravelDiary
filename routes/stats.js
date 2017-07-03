var express = require('express')
var router = express.Router() ;

router.post('/add_like', function(req, res, next){
	Journal.findOne({_id: req.body.id}, function(err, journal){
		if(err){
			console.log(err)
		}
		if(journal.votes.users.indexOf(req.decoded._doc.username) === -1){
			console.log('chutiya')
			journal.votes.number++;
			journal.votes.users.push(req.decoded._doc.username)
			journal.save(function(err){
				res.json({number: journal.votes.number})
			})
		}else{
			res.json({number : journal.votes.number})
		}
	})
})
router.post('/add_comment', function(req, res, next){
	Journal.findOne({_id: req.body.id}, function(err, journal){
		if(err){
			console.log(err)
		}else{
			if(req.body.comment!=null){
				journal.comments.push({user: req.decoded._doc.username, comment: req.body.comment});
				journal.save(function(err){
					if(err){
						console.log(err)
					}else{
						res.send(journal)
					}
				})
			}else{
				res.json({success: false})
			}
		}
	})
})

module.exports = router ;
