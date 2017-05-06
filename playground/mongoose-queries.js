const mongoose 	= require('../db/mongoose'),
			Todo     	= require('../db/models/todo'),
			{ObjectID}= require('mongodb');

var id = "6e90d0d65c72fbc255508df4e";
if(ObjectID.isValid(id)){
	console.log(true);
} else {
	console.log(false);
}

Todo.findById(id).then((todo)=>{
	if(!todo){
		console.log('That id does not exist');
	}else {
		console.log(todo);
	}
}).catch((e)=>console.log(e));