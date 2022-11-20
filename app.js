const express = require('express');

const app = express();

app.use((req,res,next) => {
    console.log("testing");
    res.send('<h1>Testing</h1>');
});

app.listen(4000);