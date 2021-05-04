const mongoose = require('mongoose');
const connectDB = async ()=>{
    try {
        const conn = await mongoose.connect(process.env.mongodb_uri,{
            useNewUrlParser:true,
            useCreateIndex:true,
            useFindAndModify:false,
            useUnifiedTopology:true
        })
        console.log(`---------------------------------\nDatabase Connected:${conn.connection.host}\n---------------------------------`);
    } catch (error) {
        console.log('error while connecting - '+error);
        process.exit(1);
    }
}
module.exports = connectDB;