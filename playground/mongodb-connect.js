"use strict";
// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db)=>{
  if(err){
  	return console.log('Unable to connect to mongoDB');
  }
  console.log('Connected to MongoDB server!');
 //inserting todos
  // db.collection('Todos').insertOne({
  // 	text: "backdoor plastic",
  // 	completed: false
  // }, (err, result)=>{
  // 	if(err){
  // 		return console.log("Unable to write to DB", err);
  // 	}
  // 	console.log(JSON.stringify(result.ops, undefined, 2));
  // });
 //inserting users
  //  db.collection('Users').insertOne({
  // 	name: "Madison Woodworth",
  // 	age: 23,
  // 	location: 'Sacramento'
  // }, (err, result)=>{
  // 	if(err){
  // 		return console.log("Unable to write to DB", err);
  // 	}
  // 	console.log(result.ops[0]._id.getTimestamp());
  // });
   
  db.close();
});
