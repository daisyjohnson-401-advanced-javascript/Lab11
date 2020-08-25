'use strict';

const express = require('express');
const router = express.Router();
const basicAuth = require('./middleware.js');
const users = require('./users-model.js');

// const app = express();

// app.use(express.json());

// CUSTOM ROUTES
router.post('/signup', (req, res, next) => {
  //create a new user
  const user = new users(req.body);

  // SAVE THE USER
  user.save()
    .then(user => {
      // RESPONDS WITH A SPECIAL TOKEN SO USER CAN SIGN IN AGAIN
      let token = user.generateToken(user);
      res.status(200).send(token);
    })
    .catch( e => {
      console.error(e);
      res.status(403).send('Whoopsie Daisy! There was an error creating user!')
    });
});

router.post('/signin', basicAuth, (req, res, next) => {
  res.send(req.user);
  res.cookie('Auth: ', req.token);

});
router.get('/users', (req, res, next) => {
  users.findById(req.payload._id)
  .then(user => {
    return res.json({user: user.basicAuth()});
  }).catch(next);

});
module.exports = router;