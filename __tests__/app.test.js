'use strict';

const supergoose = require('@code-fellows/supergoose');
const server = require('../server.js');
const auth = require('../src/auth/middleware.js');

const mockRequest = supergoose(server);



it('fails a login for a user with the incorrect credentials', async () => {
 let errorObject = {'message': 'Invalid User ID/Password', 'status': 401, 'statusMessage': 'Unauthorized'}; 
  let req = {
    headers: {
      authorization: 'Basic YM46MTEx',
    },
  };
  let res = {};
  let next = jest.fn();

  await auth(req, res, next);

  expect(next).toHaveBeenCalledWith(errorObject);
});


// it('fails a login with misspelled Auth Header', async () => {
//  let errorObject = {'message': 'Invalid Authorization Headers', 'status': 401, 'statusMessage': 'Unauthorized'}; 
//   let req = {
//     headers: {
//       authorization: 'Basic YM46MTEx',
//     },
//   };
//   let res = {};

//   // allows us to ask things about what happened with the usage of this function
//   let next = jest.fn();

//   await auth(req, res, next);

//   expect(next).toHaveBeenCalledWith(errorObject);
// });