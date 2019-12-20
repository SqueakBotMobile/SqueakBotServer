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
router.get('/questions/challenges/:id', authenticateUser, getOneChallenge)

// get the hint
router.get('/questions/challenges/hint/:id', authenticateUser, getOneHint)

// get input/output
router.get('/inputoutput/:id', authenticateUser, getTheTestsforChallenge);

//------ Functions ---------//

// query all the questions from the database
function getAllChallenges(request, response){
  console.log('here');
  client.query(`SELECT challenges FROM challenges;`)
    .then(questionResults => {
      response.send(JSON.stringify(Object.values(questionResults.rows)));
    });
}

// query for one question
function getOneChallenge(request, response){
  const id = request.params.id;
  console.log(id)
  client.query(`SELECT challenges FROM challenges WHERE id=$1;`, [id])
    .then(queryResults => {
      console.log(queryResults);
      response.send(JSON.stringify(Object.values(queryResults.rows[0])));
    })
    .catch(error => response.send(error))
}

// query for the hints for the question
function getOneHint(request, response){
  const id = request.params.id;
  client.query(`SELECT hint FROM challenges WHERE id=$1;`, [id])
    .then(hintResult => {
      response.send(JSON.stringify(Object.values(hintResult.rows[0])));
    });
}

// query for the input/output for the question
function getTheTestsforChallenge(request, response){
  const id = request.params.id;
  client.query(`SELECT input, output FROM test JOIN challenges ON test.id = challenges.id AND test.id = $1;`, [id])
    .then(testResults => {
      console.log(testResults);
      response.send(JSON.stringify(Object.values(testResults.rows[0])));
    })
    .catch(error => console.log(error));
}

module.exports = router;
