const {ObjectID} = require('mongodb'),
      Todo       = require('../../db/models/todo'),
    	User       = require('../../db/models/user'),
	    jwt	       = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
/// USERS ///
const users = [{
  _id: userOneId,
  email: 'karann7@gmail.com',
  password: '123pokemon',
  tokens: [{
	  access: 'auth',
	  token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
},{
 _id: userTwoId,
  email: 'madison@gmail.com',
  password: '123pokemon',
  tokens: [{
	  access: 'auth',
	  token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}];

/// TODOS ///
const todos = [{
	_id: new ObjectID(),
	text: "first todo",
  _creator: userOneId
}, {
	_id: new ObjectID(),
	text: "second todo",
  _creator: userTwoId,
	completed: true,
	completedAt: 333
}];
//Seeds the DB with exactly 2 todos before each test
const populateTodos = (done)=>{
  Todo.remove({}).then(()=> {
	return Todo.insertMany(todos);
  }).then(()=> done());
 };

const populateUsers = (done) =>{
  User.remove({}).then(()=>{
    let userOne = new User(users[0]).save();
    let userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo]);
  }).then(()=> done());
};


module.exports = {todos, populateTodos, populateUsers, users};