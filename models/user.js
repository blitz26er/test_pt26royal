// Dependencies
var restful = require('node-restful');
var mongoose = restful.mongoose;

// Schema
var userSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	username: String,
	email: String,
	password: String,
	admin: Boolean
});

// Return model
module.exports = restful.model('users', userSchema);