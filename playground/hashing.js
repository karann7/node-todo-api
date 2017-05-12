// Manually setting up JWT's using crypot-js
// const {SHA256} = require('crypto-js');
// var message = "My Name is karan";

// var hash = SHA256(message).toString();

// console.log(`Message is ${message}`);
// console.log(`Hash is ${hash}`);

//sending from the server
// var data = {
// 	id: 4
// };

// var token = {
// 	data,
// 	hash: SHA256(JSON.stringify(data) + "somesecret").toString()
// };

// //recieving from the client
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
// if(resultHash === token.hash){
// 	console.log('Data was not changed');
// } else {
// 	console.log('Data was changed do not trust');
// }
// 		***Singing and verifying thigns using JWT
// const jwt = require('jsonwebtoken');
// var data = {
// 	id: 4,
// 	username: "Karan",
// 	password: "singh"
// };
//
// var token = jwt.sign(data.password, '123abc');
//
// console.log(token);
//
// var decoded = jwt.verify(token, '123abc');
// console.log(decoded);

// *****Learning to use bcrypt.js
const bcrypt = require('bcryptjs');
const password = "123pokemon";
console.log(password);
bcrypt.genSalt(10, (err, salt)=>{
	console.log(salt);
	bcrypt.hash(password, salt, (err, hash)=>{
		console.log(hash);
	});
});
var hashed = "$2a$10$Vc3yDjHAjR/qqNR9r1nFOemEls.QcsvZx1bPGMalM9NmD4to1FhS2";

bcrypt.compare(password, hashed, (err, res)=>{
	console.log(res);
});
