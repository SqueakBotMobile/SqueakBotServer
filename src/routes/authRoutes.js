'use strict';

const express = require('express');
const bcyrpt = require('bcrypt');
const pg = require('pg');
const jwt = require('jsonwebtoken');

const authenticateUser = require('../middleware/authenticateUser');

const router = express.Router();

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.log(err));
client.on('end', () => console.log('ended'));
client.connect();


//------------- Routes ------------------//

// signup
router.post('/signup', (request, response, next) => {
  hashingPassword(request.body.password)
    .then(password => {
      request.body.password = password;
      createUser(request.body)
        .then(() => {
          const token = createUserToken(request.body);
          response.send(token)
        })
        .catch((error) => console.log(error));
    });
});

// signin
router.post('/signin', authenticateUser.authenticateUser);


//------------ Functions ----------------//

// hashing password for each user
function hashingPassword(password){
  return new Promise((resolve, reject) => {
    bcyrpt.hash(password, 10, (error, hash) => {
      error ? reject(error) : resolve(hash)
    });
  });
}

// creates a new user and saves that to the DB
function createUser(user){
  user.token = createUserToken(user);
  return client.query(`INSERT INTO users (
    username,
    email,
    password,
    token
  ) VALUES (
    $1, $2, $3, $4);`
    [
      user.username, user.email, user.password, user.token
    ]);
}

// fetches a user from the DB based on username
async function authenticate(userCreds){
  let SQL = `SELECT * FROM users WHERE username = $1;`
  const results = await client.query(SQL, [userCreds.username]);
  const user = results.rows[0];
  const isValid = await bcyrpt.compare(userCreds.password, user.password);
  if(isValid){
    return createUserToken(user);
  } else {
    console.error(err => 'You have an error');
  }
}

// creates a token for the user when they are using the app
async function createUserToken(user){
  let tokenData = {
    id: user.id,
  };
  var token = await jwt.sign(tokenData, process.env.SECRET || 'secret');
  return token;
}

module.exports = router;