// const MongoClient = requ590b7004fcfc074ca6a2628dire('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db)=>{
  if(err){
  	return console.log('Unable to connect to mongoDB');
  }
  console.log('Connected to MongoDB server!');

  db.collection("Todos").findOneAndUpdate({
    _id: new ObjectID('590b7004fcfc074ca6a2628d')
  }, {
    $set: {
      completed: false
    }
  }, {
      returnOriginal: false
    }).then((result)=>{
      console.log(result);
    });

   db.close();
});
