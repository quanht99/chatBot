const express = require('express');
const body_parser = require('body-parser');
const morgan = require('morgan');
const port = process.env.PORT || 3000;

const app = express();
app.use(body_parser.json({ limit: '100mb' }));
app.use(body_parser.urlencoded({ limit: '100mb', extended: true }));
app.use(morgan('default'));

app.use('/api', require('./router/webhook'));
app.listen(port , err => {
    if(!err){
        console.log("Server is running on 3000");
    }
});