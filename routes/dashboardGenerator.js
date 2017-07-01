var express = require('express')
var router = express.Router() ;
var fileUpload = require('express-fileupload')
router.get('/',function(req, res, next){
	Journal.find({author: req.decoded._doc.username}, function(err, journals){
		res.render('dashboard',{message:'',name:req.decoded._doc.username,journals: journals})
	})
})
var journal ;
router.post('/',function(req, res, next){
	console.log('Post recieved')
	Journal.findOne({header: req.body.title, position: req.body.position, date: new Date(), author: req.decoded._doc.username}, function(err, journalCheck){
		if(journalCheck){
			console.log(journalCheck)
			Journal.find({author: req.decoded._doc.username}, function(err, journals){
				res.render('dashboard',{message:'',name:req.decoded._doc.username, journals:journals})
			})
		}else{
			console.log(req.params)
			var links, sampleFile = req.files.image ;
			links = [] ;
			if(req.body.links){
				links = req.body.links.split('\n') ;
			}
			

			


			if(sampleFile){
				sampleFile.mv(__dirname+'/../imgForJournals/'+req.body.title+req.decoded._doc.username+'.'+req.files.image.name.split('.')[1], function(err) {
				  if (err){
				  	console.log(err)
				  	journal = new Journal({
						header:req.body.title,
						content: req.body.journal,
						position: req.body.position,
						type: req.body.type,
						author: req.decoded._doc.username,
						date: new Date(),
						links: links ,
						image: ''
					})
					journal.save(function(err, journalSaved){
						console.log(journalSaved) ;
						User.findOne({username: journalSaved.author},function(err, user){
							user.journals.push({header:journalSaved.header, position:journalSaved.position})
							user.save(function(err, savedUser){
								res.render('dashboard',{message:'Your journal was successfully saved'})
							})
						})
					})
				  }else{
				  		journal = new Journal({
							header:req.body.title,
							content: req.body.journal,
							position: req.body.position,
							type: req.body.type,
							author: req.decoded._doc.username,
							date: new Date(),
							links: links ,
							image: req.body.title+req.decoded._doc.username+'.'+req.files.image.name.split('.')[1] 
						})
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
				});
			}else{
				journal = new Journal({
					header:req.body.title,
					content: req.body.journal,
					position: req.body.position,
					type: req.body.type,
					author: req.decoded._doc.username,
					date: new Date(),
					links: links ,
					image: ''
				})
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

			 
			
			console.log(journal)
		}
	})
})
module.exports = router ;

//
//save
/*
journal.save(function(err, journalSaved){
				console.log(journalSaved) ;
				User.findOne({username: journalSaved.author},function(err, user){
					user.journals.push({header:journalSaved.header, position:journalSaved.position})
					user.save(function(err, savedUser){
						res.render('dashboard',{message:'Your journal was successfully saved'})
					})
				})
			})
*/