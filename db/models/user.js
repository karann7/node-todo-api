const mongoose  = require('mongoose'),
			validator = require('validator'),
			jwt				= require('jsonwebtoken'),
			_  				= require('lodash');

//User Model
// we are using npm validator to make sure email is valid
//the tokens property refers to login from different devices
var UserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		trim: true,
		minlength: 8,
		unique: true,
		validate: {
			isAsync: true,
			validator: validator.isEmail,
			message: "{VALUE} is not a valid email"
		},
	},
	password: {
		type: String,
		required: true,
		minlength: 8
	},
	tokens: [{
		access: {
			type: String,
			required: true
		},
		token: {
			type: String,
			required: true
		}
	}]
});
//Overrides the built in method so that
// the returned properties are picked off and will only return certain ones
UserSchema.methods.toJSON = function () {
	var user = this;
	var userObject = user.toObject();
	return _.pick(userObject, ['_id', 'email']);
};
//Runs the jwt function to hash a token, includes a secret access.
UserSchema.methods.generateAuthToken = function(){
	var user = this;
  var access = "auth";
  var token = jwt.sign({_id: user._id.toHexString(), access}, "abc123").toString();

  user.tokens.push({access, token});

  return user.save().then(()=>{
  	return token;
  });
};
UserSchema.statics.findByToken = function(token){
	var User = this;
	var decoded;
	try {
		decoded = jwt.verify(token, 'abc123')
	} catch (e) {
		return Promise.reject();
	}
	return User.findOne({
		'_id': decoded._id,
		'tokens.token': token,
		'tokens.access': 'auth'
	});
};

var User = mongoose.model('User', UserSchema);
module.exports  = User;
