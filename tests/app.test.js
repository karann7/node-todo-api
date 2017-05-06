const expect 		= require('expect'),
			request   = require('supertest'),
			app   		= require('../app'),
			Todo  		= require('../db/models/todo'),
			User 			= require('../db/models/user'),
		 {ObjectID} = require('mongodb');

		const todos = [{
			_id: new ObjectID(),
			text: "first todo"
		}, {
			_id: new ObjectID(),
			text: "second todo"
		}];
//Seeds the DB with exactly 2 todos before each test
 beforeEach((done)=>{
 	Todo.remove({}).then(()=> {
 		return Todo.insertMany(todos);
 	}).then(()=> done());
 });

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
