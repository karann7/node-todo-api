const User = require('../db/models/user.js');

var authenticate = (req, res, next) => {
	var token = req.header('x-auth');

	User.findByToken(token).then((user) => {
		if(!user){
			return Promise.reject();
		} else {
			req.token = token;
			req.user = user;
			next();
		}
	}).catch((e)=>{
		res.status(401).send('Authentication required');
	});
};

module.exports = authenticate;
