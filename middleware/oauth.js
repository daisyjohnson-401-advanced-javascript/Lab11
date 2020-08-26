'use strict';

const superagent = require('superagent');
const users = require('../src/auth/users-model.js');

const tokenServerUrl = 'https://github.com/login/oauth/access_token';
const remoteAPI = 'https://api.github.com/user';
const API_SERVER = 'http://localhost:3000/oauth';
const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

module.exports = async function authorize(req, res, next) {
  try{
    let code = req.query.code;
    console.log(' 1. CODE:', code);

    let remoteToken = await exchangeCodeForToken(code);
    console.log(' 2. ACCESS TOKEN:', remoteToken);

    let remoteUser = await getRemoteUserInfo(remoteToken);
    console.log(' 3. GITHUB USER:', remoteUser);

    let [user, token] = await getUser(remoteUser);
    req.user = user;
    req.token = token;
    console.log(' 4. LOCAL USER:'. user);

    next();
  } catch (err) { next( 'ERROR Unauthorized' )};
};

// EXCHANGE CODE RECIEVED ON INTITAL REQUEST FOR A TOKEN FROM THE PROVIDER

async function exchangeCodeForToken(code){
  let tokenResponse = await (await superagent.post(tokenServerUrl)).setEncoding({
    code: code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_url: API_SERVER,
    grant_type:'authorixation_code',
  });

  let access_token = tokenResponse.body.access_token;

  return access_token;
}

async function getRemoteUserInfo(token) {
  await superagent.get(remoteAPI)
    
}

async function getUser(remoteUser) {
  let userRecord = {
    username: remoteUser.login,
    password: 'Ihavenodidea',
  };

  let user = await users.save(userRecord);
  let token = users.generateToken(user);

  return [user, token];
}