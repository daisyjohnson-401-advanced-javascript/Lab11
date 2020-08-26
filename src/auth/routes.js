'use strict';

const express = require('express');
const router = express.Router();

const user = require('./users-model.js');
const basicAuth = require('./middleware.js');

// CUSTOM ROUTES
router.post('/signup', (req, res, next) => {
  //create a new user
  const user = new user(req.body);

  // SAVE THE USER
  user.save()
    .then(user => {
      // RESPONDS WITH A SPECIAL TOKEN SO USER CAN SIGN IN AGAIN
      req.token = user.generateToken(user);
      req.user = user;
      res.set('token', req.token);
      res.cookie('auth', req.token);
      res.status(200).send(token);
    })
    .catch( e => {
      console.error(e);
      res.status(403).send('Whoopsie Daisy! There was an error creating user!')
    });
});

router.post('/signin', basicAuth, (req, res, next) => {
  res.send({
    token: req.token,
    user: req.user,
  })
  res.cookie('auth', req.token);
});

router.get('/users', (req, res, next) => {
  users.findById(req.payload._id)
  .then(user => {
    return res.json({user: user.basicAuth()});
  }).catch(next);

});
module.exports = router;