const express = require('express');
const dotenv = require('dotenv');
const body_parser = require('body-parser');
const cors = require('cors');
const connectDB = require('./database/db');


// load env variables
dotenv.config({path:'./config/config.env'});

// connecting to db
connectDB();

const app = express();

// body parser middleware
// For parsing application/json
app.use(express.json());
  
// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// enable cors
app.use(cors());

// Setting routes
app.use('/api/restaurants/',require('./routes/restaurant')); //for restaurant
app.use('/api/users/',require('./routes/users')); //for users
app.use('/api/drivers/',require('./routes/drivers')); //for drivers

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>console.log(`Server running at port ${PORT}`));