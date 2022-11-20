const express = require('express');

const app = express();

const requestTime = function (req, res, next) {
    console.log('hello pp')
    req.requestTime = Date.now()
    next()
  }
  
app.use(requestTime)
app.get('/', (req, res) => {
    res.send('Hello World!')
  })


app.listen(process.env.PORT || 4000);