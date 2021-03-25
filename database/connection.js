const mongoose = require('mongoose')

const uri = "mongodb+srv://admin:admin123@nodejs1.jkncm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const connectDB = async () => {
    try{
        //mongodb connection string
        const con = await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        })
        console.log(`MongoDB Connected: ${con.connection.host}`);
    }
    catch(err){
        console.log(err)
        process.exit(1)
    }
}

module.exports = connectDB