'use strict';

require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URL = 'mongodb://localhost:27017';

const mongooseOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};

mongoose.connect(MONGODB_URL, mongooseOptions);

const server = require('./server.js');
server.start(3000);