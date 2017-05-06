"use strict";
/////***DEPENDENCIES***/////
//local
const mongoose 		= require('./db/mongoose'),
			User     		= require('./db/models/user'),
			Todo     		= require('./db/models/todo'),
			port				= process.env.PORT || 3000,
			ip 					= process.env.IP || '0.0.0.0';

//npm
const express  		= require('express'),
			bodyParser  = require('body-parser'),
			app         = express(),
			{ObjectID}	= require('mongodb');
			

/////***MIDDLEWARE***/////
app.use(bodyParser.json());

///////////***ROUTES***///////////

/////GET ROUTES/////
//Homepage
app.get('/', (req, res)=>{
	res.send('Welcome to the Todo API!');
});

//Todo-GET-ALL-
app.get('/todos', (req, res)=>{
	Todo.find().then((todos)=>{
		res.send({todos});
	}, (e)=>{
		res.status(400).send(e);
	});
});

//Todo-GET-BY-ID
app.get('/todos/:id', (req, res)=>{
	let id = req.params.id;
	if(!ObjectID.isValid(id)) {
		return res.status(404).send("ID is not valid!");
	}
	Todo.findById(id).then((todo)=>{
		if(!todo){
			res.status(404).send('That Todo does not exist');
		} else {
			res.status(200).send({todo});
		  }
		}).catch((e)=>{
			res.status(400).send('An error has occured.');
		});
});

/////POST ROUTES/////

//Todo-POST-route
app.post('/todos', (req, res)=>{
	var todo = new Todo({
		text: req.body.text
	});
	//save to the DB
	todo.save().then((doc)=>{
		res.status(200).send(doc);
	}, (e) =>{
		res.status(400).send(e);
 });
});

//User-POST-route
app.post('/users', (req, res)=>{
	var user = new User({
		email: req.body.email
	});
	//save to the DB
	user.save().then((doc)=>{
		res.status(200).send(doc);
	}, (e) =>{
		res.status(400).send(e);
 });
});

/////DELETE ROUTES/////

//Find a todo and delete by ID
app.delete('/todos/:id', (req, res)=>{
	let id = req.params.id;
	if(!ObjectID.isValid(id)) {
		return res.status(404).send("ID is not valid!");
	}
	Todo.findByIdAndRemove(id).then((todo)=>{
		if(!todo){
			res.status(404).send('That Todo does not exist');
		} else {
			res.status(200).send({todo});
		  }
		}).catch((e)=>{
			res.status(400).send('An error has occured.');
		});
});

////Server Listening////
app.listen(port, ip, ()=>{
	console.log(`Server is running on Port: ${port}`);
});

module.exports = app;