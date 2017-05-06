const mongoose 	= require('../db/mongoose'),
			Todo     	= require('../db/models/todo'),
			User     	= require('../db/models/user'),
			{ObjectID}= require('mongodb');

// .remove({})

// Todo.remove({}).then((result)=>{
// 	console.log(result);
// });

//Todo.findOneAndRemove()
//Todo.findByIdAndRemove

Todo.findByIdAndRemove('590e205ea8bef9e6b309c690').then((todo)=>{
	console.log(todo);
});