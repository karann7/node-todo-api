const mongoose  = require('mongoose');

//User Model
var User = mongoose.model('User', {
	email: {
		type: String,
		required: true,
		trim: true,
		minlength: 8
	}
});

// how to make a new User
// var user = new User({
// 	email: "booooom."
// });

// how to save a user to the DB
// user.save().then((doc)=>{
// 	console.log('Saved todo', doc);
// }, (e) =>{
// 	console.log('Unable to save todo');
// });
module.exports  = User;