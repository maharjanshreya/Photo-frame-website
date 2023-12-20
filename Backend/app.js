const dotenv = require("dotenv");
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config({path:'./config.env'});
require('./db/conn');
const User =  require('./model/userModel');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to MongoDB");
});

app.get('/', (req, res) => {
  res.send("Hellosss world");
});

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
