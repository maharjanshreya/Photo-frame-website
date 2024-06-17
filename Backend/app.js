const dotenv = require("dotenv");
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const stripe = require("stripe")("sk_test_51OyOhcA4uLHwNxGYSXTrDJkBBiGlWFsUQljwGqVJNSryXlNvn2AJDiHbCJT7mwdyqRDlIwMM0wpWm4KZbokMx7ap00aY9jWGyQ");
const cookieParser = require("cookie-parser");
const path = require('path');
dotenv.config({path:'./config.env'});
const PORT = process.env.PORT;
const productRoutes =require("./routes/productRoutes.js");
require('./db/conn');

// Enable CORS for all routes
const corsOptions = {
  origin: "https://samanphotoframe-git-main-shreeya-maharjans-projects.vercel.app",
  credentials: true,
  exposedHeaders: ['set-cookie']
};

// Use CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests for all routes
app.options('*', (req, res) => {
  res.header("Access-Control-Allow-Origin", corsOptions.origin); // set correct origin
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.sendStatus(200);
});

app.use(cookieParser());
//const User =  require('./model/userModel');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    
}));
  
app.use(require('./router/auth'));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));   // to connect with image files
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to MongoDB");
});
// Enable CORS for all routes

app.get('/', (req, res) => {
  res.send("Hellosss world from server app.js");
});

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
