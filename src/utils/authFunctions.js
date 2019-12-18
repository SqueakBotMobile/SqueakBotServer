'use strict';

require('dotenv').config();
const bcrypt = require('bcrypt');
const pg = require('pg');
const jwt = require('jsonwebtoken');

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.log(err));
client.on('end', () => console.log('ended'));
client.connect();

//------------ Functions ----------------//

// hashing password for each user
function hashingPassword(password){
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (error, hash) => {
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
    password
  ) VALUES (
    $1, $2, $3);`,
  [
    user.username, user.email, user.password,
  ]);
}

// fetches a user from the DB based on username
async function authenicate(userCreds){
  let SQL = `SELECT * FROM users WHERE username = $1;`
  const results = await client.query(SQL, [userCreds.username]);
  const user = results.rows[0];
  const isValid = await bcrypt.compare(userCreds.password, user.password);
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

// looks for an email that user types in 
async function lookForEmail(email){
  console.log(email);
  const sqlResults = await client.query(`SELECT * FROM users WHERE email=$1;`, [email]);
  if (sqlResults.rowCount > 0) {
    return Promise.reject({error: 'This email is in use'})
  };
}

// looks for an username that user types in
async function lookForUsername(username){
  const sqlResults = await client.query(`SELECT * FROM users WHERE username=$1;`, [username]);
  if (sqlResults.rowCount > 0) {
    return Promise.reject({error: 'This username is in use'});
  };
}

module.exports = { 
  hashingPassword, 
  createUser,
  authenicate, 
  createUserToken, 
  lookForEmail, 
  lookForUsername 
};