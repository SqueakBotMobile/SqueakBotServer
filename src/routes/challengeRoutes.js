'use strict';

require('dotenv').config();
const express = require('express');
const pg = require('pg');

const authenticateUser = require('../middleware/authenticateUser.js').authenticateUser;

const router = express.Router();

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.log(err));
client.on('end', () => console.log('ended'));
client.connect();

//--------- Routes ----------//

// get all challenges
router.get('/questions/challenges', authenticateUser, getAllChallenges)

// get one challenge
// router.get('/questions/challenges/:id', authenticateUser)

// get the hint
// router.get('/questions/challenges/:id/:hint', authenticateUser)

// get input/output
// router.get('/inputoutput', authenticateUser, getTheTestsforChallenge);

//------ Functions ---------//

// query all the questions from the database
function getAllChallenges(request, response, next){
  response.send('abcdef')
  next()
}

// query for one question


// query for the hints for the question


// query for the input/output for the question
function getTheTestsforChallenge(request, response){
  client.query(`SELECT input, output FROM test JOIN challenges ON test.id = challenges.id AND test.id = $1;`)
    .then(testResults => {
      console.log(testResults);
      response.send(JSON.stringify(Object.values(testResults.rows)));
    })
    .catch(error => console.log(error));
}

module.exports = router;
