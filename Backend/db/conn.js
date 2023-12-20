const mongoose = require("mongoose");
const DB = process.env.DATABASE;

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
    
  }).then(() => {
    console.log("Connected successfully");
  }).catch((err) => console.log('No connection', err));