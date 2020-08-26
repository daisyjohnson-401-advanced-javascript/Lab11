'use strict';

const base64 = require('base-64');
const users = require('./users-model.js');

module.exports =  async function basicAuthentication (req, res, next){

  // If invalid user id/ password throw an error
  if (!req.headers.authorization) { next({ 'message': 'Invalid Authorization Headers', 'status': 401, 'statusMessage': 'Unauthorized' }); return; }


  // Pulls out the encoded part by splitting the heade into an array and grabbing hashed
  let encodedPair = req.headers.authorization.split(' ').pop();

  // decode to user:pass and splits it to an array
  const decoded = base64.decode(encodedPair)// -> someuser:somepass -> ['someuser', 'somepass']

  console.log('decoded!!!!!', decoded);

  let [user, pass] = decoded.split(':'); // user = 'someuser', pass = 'somepass'
 
    try {
      const validUser = await users.authenticateBasic(user, pass)
        ;
      req.token = users.generateToken(validUser);
      req.user = user;
      next();
    } catch (err) {
      next({ 'message': 'Invalid User ID/Password', 'status': 401, 'statusMessage': 'Unauthorized' });
    }
  
  // AUTHENTICATE BASIC

  // return users.authenticateBasic(user, pass)
  //   .then(validUser => {
  //     console.log('.........................valid user', validUser);
  //     req.token = users.generateToken(validUser);
  //     req.user = user;
  //     next();
  //   })
  //   .catch(err => {
  //     console.error('*************ERROR************');
  //     next({'message': 'Invalid User ID/Password', 'status': 401, 'statusMessage': 'Unauthorized'});
  //   });

  };
