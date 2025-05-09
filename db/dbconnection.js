const mongoose = require('mongoose');

const connectDB = async() => {
    try{
        const connectionInstance = await mongoose.connect(`${process.env.DB_URL}`);
        console.log(`\nMongoDB connected !! DB Host:${connectionInstance.connection.host}`);

    }catch(error){
        console.log("MONGODB connection error: ",error);     
        process.exit(1);
    }
}

module.exports = connectDB;