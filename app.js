"use strict";
/////***DEPENDENCIES***/////

//local
require('./config/config');
const mongoose 		= require('./db/mongoose'),
			User     		= require('./db/models/user'),
			Todo     		= require('./db/models/todo'),
			port				= process.env.PORT;

//npm
const express  		= require('express'),
			bodyParser  = require('body-parser'),
			app         = express(),
			{ObjectID}	= require('mongodb'),
			_						= require('lodash');
			

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

/////PUT ROUTES/////

app.patch('/todos/:id', (req, res)=>{
	let id = req.params.id;
	let body = _.pick(req.body, ['text', 'completed']);

	if(!ObjectID.isValid(id)) {
		return res.status(404).send("ID is not valid!");
	}

	if(_.isBoolean(body.completed) && body.completed){
		body.completedAt = new Date().getTime(); 
	} else {
		body.completed   = false;
		body.completedAt = null;
	}
	Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo)=>{
		if(!todo){
			res.status(404).send('That Todo does not exist');
		} else {
			res.status(200).send({todo});
		  }
		}).catch((e)=>{
			res.status(400).send('An error has occured.');
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
app.listen(port, ()=>{
	console.log(`Server is running on Port: ${port}`);
});

module.exports = app;