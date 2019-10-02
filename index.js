const express = require('express');
const body_parser = require('body-parser');
const morgan = require('morgan');
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');

const app = express();
app.use(body_parser.json({ limit: '100mb' }));
app.use(body_parser.urlencoded({ limit: '100mb', extended: true }));
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]'));

app.use('/ping', (req, res) => {
	console.log("Hello world.");
	res.send("pong")
});
app.use('/api', require('./router/webhook'));
app.use('', (req, res)=>{
   return res.json({
       success: true
   })
});

mongoose.connect('mongodb://localhost:27017/testMongo', {useNewUrlParser: true},(err) => {
    if(err){
        console.log(err);
    }
    else{
        console.log("Connect with database success");
        app.listen(port , err => {
            if(!err){
                console.log("Server is running on 3000");
            }
        });
    }
});
