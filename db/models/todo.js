const mongoose  = require('mongoose');

// Todo Model
var Todo = mongoose.model('Todo', {
	text: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},
	completed: {
		type: Boolean,
		default: false
	},
	completedAt: {
		type: Number,
		default: null
	},
	_creator: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	}
});

// var newTodo = new Todo({
// 	text: 'blah blah blahhhh'
// });

module.exports = Todo;