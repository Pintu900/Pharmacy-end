const path =require('path');
const express = require('express');
const mongoose = require('mongoose');
const categories = require("./Routes/categories");
const users = require("./Routes/users");
const products = require("./Routes/products");
const payment = require("./Routes/payment");
const cors = require('cors');

require('dotenv').config()

const app = express();

mongoose.connect(process.env.MONGO_DB).then(()=>{
    console.log('DB connected')
}).catch(err => {
    console.log(err.message)
})

app.use(cors());
app.use(express.json())

app.get('/', (req, res) => {
  res.status(200).sendFile(path.join(__dirname,'views','hotel.html'))
})
app.get('/register', (req, res) => {
  res.status(200).sendFile(path.join(__dirname,'views','register.html'))
})
app.get('/login', (req, res) => {
  res.status(200).sendFile(path.join(__dirname,'views','login.html'))
})
app.get('/lavender', (req, res) => {
  res.status(200).sendFile(path.join(__dirname,'views','home.html'))
})
app.get('/product', (req, res) => {
  res.status(200).sendFile(path.join(__dirname,'views','product.html'))
})
app.use(categories);
app.use(products);
app.use(payment);
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