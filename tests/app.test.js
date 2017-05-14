const expect 		= require('expect'),
			request   = require('supertest'),
			app   		= require('../app'),
			Todo  		= require('../db/models/todo'),
			User 			= require('../db/models/user'),
		 {ObjectID} = require('mongodb'),
		 {todos, populateTodos, populateUsers, users} = require('./seed/seed.js');

 beforeEach(populateTodos);
 beforeEach(populateUsers);
//Tests the post routes, 1 test sends info, the other does not.
describe('POST /todos', ()=>{
	it('should create a new todo', (done)=>{
		var text = "my name is karan";

		request(app)
		.post('/todos')
		.send({text})
		.expect(200)
		.expect((res)=>{
			expect(res.body.text).toBe(text);
		})
		.end((err, res) =>{
			if(err){
				return done(err);
			}
			Todo.find({text}).then((todos)=>{
				expect(todos.length).toBe(1);
				expect(todos[0].text).toBe(text);
				done();
			}).catch((e)=> done(e));
			});
	});
	it('should not create a todo with invalid data',(done)=>{

		request(app)
		.post('/todos')
		.send({})
		.expect(400)
		.end((err, res) =>{
			if(err){
				return done(err);
			}
			Todo.find().then((todos)=>{
				expect(todos.length).toBe(2);
				done();
			}).catch((e)=> done(e));
			});
	});
});

//Tests the GET route 
describe('GET /todos', ()=>{
	it('should get all the todos', (done)=>{
		request(app)
		.get('/todos')
		.expect(200)
		.expect((res)=>{
			expect(res.body.todos.length).toBe(2);
		})
		.end(done);
	});
});

//Tests the GET by ID route

describe("GET /todos/:id", ()=>{
	it('gets the corresponding todo relative to the ID', (done)=>{
		request(app)
		.get(`/todos/${todos[0]._id.toHexString()}`)
		.expect(200)
		.expect((res)=>{
			expect(res.body.todo.text).toBe(todos[0].text);
		})
		.end(done);
	});

	it('return 404 if todo not found', (done)=>{
		var hexId = new ObjectID().toHexString;
		request(app)
		.get(`/todos/${hexId}`)
		.expect(404)
		.end(done);
	});

	it('should return 404 if id is not proper format', (done)=>{
		request(app)
		.get(`/todos/123`)
		.expect(404)
		.end(done);
	});
}); 

//Tests for the DELETE route

describe("DELETE /todos:id", ()=>{
	var hexId = todos[1]._id.toHexString();
	it('should remove a todo', (done)=>{
		request(app)
		.delete(`/todos/${hexId}`)
		.expect(200)
		.expect((res)=>{
			expect(res.body.todo._id).toBe(hexId);
		})
		.end((err, res) => {
			if(err){
				return done(err);
			}
			Todo.findById(hexId).then((todo)=>{
				expect(todo).toNotExist();
				done();
			}).catch((e) => done(e));
		});
	});
	
	it('should return 404 if todo not found', (done)=>{
		var hexId = new ObjectID().toHexString;
		request(app)
		.delete(`/todos/${hexId}`)
		.expect(404)
		.end(done);
	});

	it('should return 404 if id is invalid', (done)=>{
		request(app)
		.delete('/todos/1234')
		.expect(404)
		.end(done);
	});
});

//Tests for the Patch route

describe('PATCH /todos/id', (done)=>{
	it('when todo is complete this sets the completedAt value', (done)=>{
		var hexId = todos[0]._id.toHexString();
		var text = "This should be the new text";
		//grab id of first item
		//update text, set completed true
		//200, res.body has text body sent changed and completed is true
		//completedSt is a number
		request(app)
		.patch(`/todos/${hexId}`)
		.send({
			completed: true,
			text: text
		})
		.expect(200)
		.expect((res)=>{
			expect(res.body.todo.text).toBe(text);
			expect(res.body.todo.completed).toBe(true);
			expect(res.body.todo.completedAt).toBeA('number');
		})
		.end(done);
	});

	it('should clear completedAt when todo is not completed', (done) =>{
	//grab id of second todo item
	//update text, set completed to false
	//200
	//text is changed, completed false, completedAt is null .toNotExist
	var hexId = todos[1]._id.toHexString();
	var text = "This should be the new text";
	request(app)
	.patch(`/todos/${hexId}`)
	.send({
		completed: false,
		text: text
	})
	.expect(200)
	.expect((res)=>{
		expect(res.body.todo.text).toBe(text);
		expect(res.body.todo.completed).toBe(false);
		expect(res.body.todo.completedAt).toNotExist();
	})
	.end(done);
	});
});

//Testing the token and auth

describe('GET /users/me', ()=>{
	it('should return user if authenticated', (done)=>{
		request(app)
		.get('/users/me')
		.set('x-auth', users[0].tokens[0].token)
		.expect(200)
		.expect((res)=>{
			expect(res.body._id).toBe(users[0]._id.toHexString());
			expect(res.body.email).toBe(users[0].email);
		})
		.end(done);
	});

	it('Should return a 401 is no auth', (done)=>{
		request(app)
		.get('/users/me')
		.expect(401)
		.expect((res)=>{
			expect(res.body).toEqual({});
		})
		.end(done);
	});
});

describe('POST /users', () =>{
	it('should create a user', (done)=>{
		var email = "karannnn@icloud.com";
		var password = "87654321";

		request(app)
		.post('/users')
		.send({email, password})
		.expect(200)
		.expect((res)=>{
			expect(res.headers['x-auth']).toExist();
			expect(res.body._id).toExist();
			expect(res.body.email).toBe(email);
		})
		.end((err)=>{
			if(err){
			return done(err);
			} else {
				User.findOne({email}).then((user) =>{
					expect(user).toExist();
					expect(user.password).toNotBe(password);
					done();
				}).catch((e)=> done(e));
			}
		});
	});
	it('should return validation errors if req invalid', (done) =>{
		request(app)
		.post('/users')
		.send({
			username: "hehe",
			password: "87654321"
		})
		.expect(400)
		.expect((res)=>{
			expect(res.body.errors).toExist();
		})
		.end(done);
	});
	it('should not create user for duplicate email', (done) =>{
		request(app)
		.post('/users')
		.send({
			email: users[0].email,
			password: users[0].password
		})
		.expect(400)
		.end(done);
	});
});
// testing to make sure the login works
describe('POST /users/login', () => {
	it('Should return back user and auth token', (done) => {
		request(app)
		.post('/users/login')
		.send({
			email: users[1].email,
			password: users[1].password
		})
		.expect(200)
		.expect((res) => {
			expect(res.body.email).toBe(users[1].email);
			expect(res.headers['x-auth']).toExist();
		})
		.end((err, res) => {
			if(err){
				return done(err);
			}
			User.findById(users[1]._id).then((user)=>{
				expect(user.tokens[0]).toInclude({
					access: 'auth',
					token: res.headers['x-auth']
				});
				done();
			}).catch((e)=> done(e));
		});
	});
	it('should reject invalid login', (done)=>{
		request(app)
		.post('/users/login')
		.send({
			email: users[1].email,
			password: users[1].password + '1'
		})
		.expect(400)
		.expect((res)=>{
			expect(res.headers['x-auth']).toNotExist();
		})
		.end((err, res) => {
			if(err){
				return done(err);
			}
			User.findById(users[1]._id).then((user)=>{
				expect(user.tokens.length).toBe(0);
				done();
			}).catch((e)=>done(e));
		});
	});
});

describe('Delete /users/me/token', () =>{
	it('should remove auth token from DB on logout', (done) =>{
		request(app)
		.delete('/users/me/token')
		.set('x-auth', users[0].tokens[0].token)
		.expect(200)
		.expect((res) => {
			expect(res.headers['x-auth']).toNotExist()
		})
		.end((err, res)=>{
			if(err){
				return done(err);
			}
				User.findById(users[0]._id).then((user)=>{
					expect(user.tokens.token).toNotExist();
					done();
				}).catch((e)=>done(e));
		});
	});
});


