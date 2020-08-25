'use strict';

const base64 = require('base-64');
const users = require('./users-model.js');

module.exports = (req, res, next) => {

  console.log(req.headers.authorization);
  // If invalid user id/ password throw an error
  if(!req.headers.authorization) { next('Invalid Username or Password'); return; }



  let basic = req.headers.authorization.split(' ').pop();

  let [user, pass] = base64.decode(basic).split(':');

  // AUTHENTICATE BASIC

  users.authenticateBasic(user, pass)
    .then(validUser => {
      console.log('valid', validUser);
      req.token = users.generateToken(validUser);
      console.log('req.token: ', req.token);
      next();
    })
    .catch(err => next('INVALID LOGIN'))

  };
