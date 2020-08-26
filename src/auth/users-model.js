'use strict';

const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = 'ThisIsMySecretThing';

const users = new mongoose.Schema({
  username:{ type: String, required: true, unique: true},
  password: { type: String, required: true },
  email: { type: String },
  role: { type: String, required: true, default: 'user', enum: ['admin', 'editor', 'user'],}
});

// Hash the plain text password given BEFORE you save a user to the database
users.pre('save', async function() {
  if(this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10)
      .then(hashedPass => {
        this.password = hashedPass;
        next();
    })
    console.error('****ERRROR*****');
    next('Invalid Login');
  }

});

//create authenticate basic method
users.statics.authenticateBasic = async function (username, password) {
  let query = { username: username };
  return this.findOne(query)
    .then(user => {
      console.log('**************USER************', user);
     return user && user.comparePassword(password) ? user : null;
    })
    .catch(err => {
      console.error('BAAAAAD NEEEEWSSS BEARRRS');
      next('Invalid Login');
    })

};

// cr;eate a method in the schema to authenticate a user using the hashed password *CHECK THE PASSWORD*
users.methods.comparePassword = function(plainPassword) {
  return bcrypt.compare(plainPassword, this.password)
  .then(valid => valid ? this : null);
}
//Create a method in the schema to generate a Token following a valid login
users.methods.generateToken = function(){
  let tokenData = {
    id: this._id,
  };
  const signed = jwt.sign(tokenData, JWT_SECRET);
  console.log('signed', signed);
  return signed;
};

module.exports = mongoose.model('users', users);