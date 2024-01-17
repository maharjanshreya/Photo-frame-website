const dotenv = require("dotenv");
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const cookieParser = require("cookie-parser");
dotenv.config({path:'./config.env'});
const PORT = process.env.PORT;
const productRoutes =require("./routes/productRoutes.js");
require('./db/conn');
app.use(cookieParser());
//const User =  require('./model/userModel');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
  }));
  
  
app.use(require('./router/auth'));
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to MongoDB");
});
// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:3000', // Change this to your frontend URL
  credentials: true,
  exposedHeaders: ['set-cookie'],
}));
app.get('/', (req, res) => {
  res.send("Hellosss world from server app.js");
});

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
