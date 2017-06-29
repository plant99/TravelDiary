var mongoose = require('mongoose') ;

module.exports.initDb = function(){
	mongoose.connect('mongodb://localhost:27017/traveldiary') ;
	var db = mongoose.connection ;

    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open',function(){
    	console.log('Connected')

    	User = require('../models/User')
    	Journal = require('../models/Journal')
    })
}

//worke