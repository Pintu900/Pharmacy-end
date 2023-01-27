const path =require('path');
const express = require('express');
const mongoose = require('mongoose');
const categories = require("./Routes/categories");
const users = require("./Routes/users");
const cors = require('cors');

require('dotenv').config()

const app = express();
app.use(cors());

mongoose.connect(process.env.MONGO_DB).then(()=>{
    console.log('DB connected')
}).catch(err => {
    console.log('error')
})

app.use(express.json())

app.get('/', (req, res) => {
  res.status(200).sendFile(path.join(__dirname,'views','home.html'))
})
app.get('/register', (req, res) => {
  res.status(200).sendFile(path.join(__dirname,'views','register.html'))
})
app.get('/login', (req, res) => {
  res.status(200).sendFile(path.join(__dirname,'views','login.html'))
})
app.use(categories);
app.use(users.router);



// const requestTime = function (req, res, next) {
//     console.log('hello pp')
//     req.requestTime = Date.now()
//     next()
//   }
  
// app.use(requestTime)


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});