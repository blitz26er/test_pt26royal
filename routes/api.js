// Dependencies
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var config = require('../config');

var stripeApiKey = "sk_live_7S6yAeqQUTR6R1y7OTD078Mi";
var stripeApiKeyTesting = "sk_test_11Kz44bJLTtxuvxX9ivm04Ya"
var stripe = require('stripe')(stripeApiKeyTesting);

var app = express();

// Models
var User = require('../models/user');

// Routes
User.methods(['get', 'put', 'post', 'delete']);
User.register(router, '/users');

router.post('')

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
router.post('/authenticate', function(req, res) {
  // find the user
  User.findOne({
    email: req.body.email
  }, function(err, user) {
    console.log('adfasdfadf');
    if (err) throw err;
    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {
      // check if password matches
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {
        // if user is found and password is right
        // create a token
        var token = jwt.sign(user, config.secret, {
          expiresInMinutes: 1440 // expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }   
    }

  });
});

// Stripe
var restful = require('node-restful');
var mongoose = restful.mongoose;
var transactionSchema = mongoose.Schema({
  name: String,
  amount: String,
  number: String,
  cvc: String,
  exp_year: String,
  exp_month: String,
});

var Transaction = mongoose.model('Transaction', transactionSchema);

router.get('/stripe',function(req,res){
  console.log("stripe POST received!");
  console.log(req.body.stripeToken);

  stripe.charges.create({
    amount: "50",
    currency: "usd",
    card: req.body.stripeToken
  }, function (err, customer) {
    if (err) {
      console.log("error");
      console.log(customer);
      var customer = new Transaction(customer);
      customer.save();
    } else {
      var id = customer.id;
      console.log('Success! Customer with Stripe ID ' + id + ' just signed up!');
      // save this customer to your database here!
      var customer = new Transaction(customer);
      customer.save();
      res.json({
        success:true, 
        message: 'ok'
      });
    }
  });
});

// Return router
module.exports = router;