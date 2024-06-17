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
app.use(cors({
  origin: ["https://samanphotoframe-git-main-shreeya-maharjans-projects.vercel.app"], 
  credentials: true,
  exposedHeaders: ['set-cookie'],
}));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://samanphotoframe-git-main-shreeya-maharjans-projects.vercel.app");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

app.get('/', (req, res) => {
  res.send("Hellosss world from server app.js");
});

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
