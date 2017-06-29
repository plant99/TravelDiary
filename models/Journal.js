var mongoose = require('mongoose') ;
var Schema = mongoose.Schema ;

module.exports = mongoose.model('journal', new Schema({
	header:String,
	content: String,
	position: String,
	type: String,
	author: String
}))