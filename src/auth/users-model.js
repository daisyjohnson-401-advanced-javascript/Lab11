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
    this.password = await bcrypt.hash(this.password, 10);
  }
})

//create authenticate basic method
users.statics.authenticateBasic = async function (username, password) {
  let query = {username};
  const foundUser = await this.findOne(query);
  const match = foundUser && await foundUser.comparePassword(password);
  return match;
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
  const signed = jwt.sign(tokenData, SECRET);
  console.log('signed', signed);
  return signed;
};

module.exports = mongoose.model('users', users);