const mongoose = require('mongoose')

const uri = "mongodb+srv://admin:admin123@nodejs1.jkncm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new mongoose.MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});