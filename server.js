// Dependencies
var express = require('express');
var mongoose = require('mongoose');
var bodyParser =  require('body-parser');

// MongoDB
mongoose.connect('mongodb://root:root@ds031988.mongolab.com:31988/pt26royal');

// Express
var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Routes
app.use('/api', require('./routes/api'));

// Start server
app.listen(3000);
console.log('API is running on port 3000.');