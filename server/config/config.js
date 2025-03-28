const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();



// pass the mongo url to const variable
const DB_URL = process.env.MONGO_URL;

mongoose.set('strictQuery', false);

mongoose.connect(DB_URL, { //connect method 
  useNewUrlParser: true,
  useUnifiedTopology: true,

})
  .then(() => {
    console.log('MongoDB Connected'); // console msg
  })
  .catch((error) => {
    console.log('Db Connection Error', error);
  });
