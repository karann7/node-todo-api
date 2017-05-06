// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db)=>{
  if(err){
  	return console.log('Unable to connect to mongoDB');
  }
  console.log('Connected to MongoDB server!');

  //deleteMany
  // db.collection('Todos').deleteMany({text: 'Something to do'}).then((result)=>{
  //   console.log(result);
  // });

  // //deleteOne
  // db.collection('Todos').deleteOne({text: 'backdoor plastic'}).then((result)=>{
  //   console.log(result);
  // });
  //findoneanddelete
  //  db.collection('Todos').findOneAndDelete({completed : false}).then((result)=>{
  //   console.log(result);
  // });
  
  db.collection('Users').findOneAndDelete({_id: new ObjectID('590b709fba37df507030cf15')}).then((result)=>{
    console.log(result);
  });

   db.close();
});
