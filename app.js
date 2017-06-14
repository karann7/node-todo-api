"use strict";
/////***DEPENDENCIES***/////

//local
require('./config/config');
const authenticate  = require('./middleware/authenticate'),
			User     			= require('./db/models/user'),
			Todo     			= require('./db/models/todo'),
			port				= process.env.PORT;

//npm
const express  		= require('express'),
		  	mongoose 		= require('./db/mongoose'),
			bodyParser  		= require('body-parser'),
			app         		= express(),
			{ObjectID}		= require('mongodb'),
			_			= require('lodash');


/////***MIDDLEWARE***/////
app.use(bodyParser.json());

///////////***ROUTES***///////////

/////GET ROUTES/////
//Homepage
app.get('/', (req, res)=>{
	res.send('Welcome to the Todo API!');
});

//Todo-GET-ALL-
app.get('/todos', authenticate, (req, res)=>{
	Todo.find({
		_creator: req.user._id
	}).then((todos)=>{
		res.send({todos});
	}, (e)=>{
		res.status(400).send(e);
	});
});

//Todo-GET-BY-ID
app.get('/todos/:id', authenticate, (req, res)=>{
	let id = req.params.id;
	if(!ObjectID.isValid(id)) {
		return res.status(404).send("ID is not valid!");
	}
	Todo.findOne({
		_id: id,
		_creator: req.user._id
	}).then((todo)=>{
		if(!todo){
			res.status(404).send('That Todo does not exist');
		} else {
			res.status(200).send({todo});
		  }
		}).catch((e)=>{
			res.status(400).send('An error has occured.');
		});
});

//GET User by token and verify
app.get('/users/me', authenticate, (req, res)=>{
	res.send(req.user);
});
/////POST ROUTES/////

//Todo-POST-route
app.post('/todos', authenticate, (req, res)=>{
	var todo = new Todo({
		text: req.body.text,
		_creator: req.user._id
	});
	//save to the DB
	todo.save().then((doc)=>{
		res.status(200).send(doc);
	}).catch((e)=>{
		res.status(400).send(e);
	});
});

//User-POST-routes
	//signup
app.post('/users', (req, res)=>{
	let body = _.pick(req.body, ['email', 'password']);
	var user = new User(body);
	//save to the DB
	user.save().then(()=>{
		return user.generateAuthToken();
	}).then((token) =>{
		res.header('x-auth', token).status(200).send(user);
	}).catch((e)=>{
		res.status(400).send(e);
	});
});
//logging in
app.post('/users/login', (req, res) =>{
	let body = _.pick(req.body, ['email','password']);

	User.findByCredentials(body.email, body.password).then((user)=>{
		return user.generateAuthToken().then((token)=>{
			res.header('x-auth', token).send(user);
		});
	}).catch((e)=>{
		res.status(400).send();
	});
});

/////PUT/PATCH ROUTES/////

app.patch('/todos/:id', authenticate, (req, res)=>{
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
	Todo.findOneAndUpdate({
		_id: id, 
		_creator: req.user._id
	}, {$set: body}, {new: true}).then((todo)=>{
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
app.delete('/todos/:id', authenticate, (req, res)=>{
	let id = req.params.id;
	if(!ObjectID.isValid(id)) {
		return res.status(404).send("ID is not valid!");
	}
	Todo.findOneAndRemove({
		_id: id,
		_creator: req.user._id
	}).then((todo)=>{
		if(!todo){
			res.status(404).send('That Todo does not exist');
		} else {
			res.status(200).send({todo});
		  }
		}).catch((e)=>{
			res.status(400).send('An error has occured.');
		});
});
//delete auth token --logout
app.delete('/users/me/token', authenticate, (req, res) => {
	req.user.removeToken(req.token).then(() => {
		res.status(200).send();
	}, ()=>{
		res.status(400).send();
	});
});
////Server Listening////
app.listen(port, ()=>{
	console.log(`Server is running on Port: ${port}`);
});

module.exports = app;
