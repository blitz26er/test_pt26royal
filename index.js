// Dependencies
var path = require("path");
var fs = require("fs");
var express = require('express');
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser =  require('body-parser');
var jwt = require('express-jwt');
var config = require('./config');
var unless = require('express-unless');

// MongoDB
console.log(config.database);
mongoose.connect(config.database);
mongoose.connection.on('error', function () {
    console.log('Mongoose connection error');
});

mongoose.connection.once('open', function callback() {
    console.log("Mongoose connected to the database");
});

// Express
var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Morgan to log request to the console
app.use(morgan('dev'));

// JWT
var jwtCheck = jwt({
    secret: config.secret
});
jwtCheck.unless = unless;
//app.use(jwtCheck.unless({path: '/api/authenticate'}));
app.set('superSecret', config.secret);
// Routes
app.use('/api', require('./routes/api'));

// Stripe
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/assets'));
app.set('view engine', 'ejs');
app.get('/', function(req, res) {
  res.render('stripe');
});

// all other requests redirect to 404
app.all("*", function (req, res, next) {
    next(new NotFoundError("404"));
});

// error handler for all the applications
app.use(function (err, req, res, next) {

    var errorType = typeof err,
        code = 500,
        msg = { message: "Internal Server Error" };

    switch (err.name) {
        case "UnauthorizedError":
            code = err.status;
            msg = undefined;
            break;
        case "BadRequestError":
        case "UnauthorizedAccessError":
        case "NotFoundError":
            code = err.status;
            msg = err.inner;
            break;
        default:
            break;
    }

    return res.status(code).json(msg);

});

// Start server
console.log("Creating HTTP server on port: %d", config.http_port);
require('http').createServer(app).listen(config.http_port, function () {
    console.log("HTTP Server listening on port: %d, in %s mode", config.http_port, app.get('env'));
});

console.log("Creating HTTPS server on port: %d", config.https_port);
require('https').createServer({
    key: fs.readFileSync(path.join(__dirname, "keys", "server.key")),
    cert: fs.readFileSync(path.join(__dirname, "keys", "server.crt")),
    ca: fs.readFileSync(path.join(__dirname, "keys", "ca.crt")),
    requestCert: true,
    rejectUnauthorized: false
}, app).listen(config.https_port, function () {
    console.log("HTTPS Server listening on port: %d, in %s mode", config.https_port, app.get('env'));
});