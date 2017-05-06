// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db)=>{
  if(err){
  	return console.log('Unable to connect to mongoDB');
  }
  console.log('Connected to MongoDB server!');

  // db.collection('Todos').find({
  //   _id: new ObjectID('590b6e4a67a5ac43c1c90e24')
  // }).toArray().then((docs)=>{
  //   console.log('Todos:');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (err)=>{
  //   console.log('Unable to fetch todos', err);
  // });
  db.collection('Users').find({name: 'Madison Woodworth'}).count().then((count)=>{
    console.log(`Users count: ${count}`);
  }, (err)=>{
    console.log('Unable to fetch todos', err);
  });
   db.collection('Users').find().toArray().then((docs)=>{
    console.log(JSON.stringify(docs, undefined, 2));
  }, (err)=>{
    console.log('Unable to fetch todos', err);
  });

   db.close();
});
