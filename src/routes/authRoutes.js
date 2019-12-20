'use strict';

require('dotenv').config();
const express = require('express');

const authenticateUser = require('../middleware/authenticateUser');
const hashingPassword = require('../utils/authFunctions').hashingPassword;
const createUser = require('../utils/authFunctions').createUser;
const createUserToken = require('../utils/authFunctions').createUserToken;
const lookForEmail = require('../utils/authFunctions').lookForEmail;
const lookForUsername = require('../utils/authFunctions').lookForUsername;

const router = express.Router();

//------------- Routes ------------------//

// signup
router.post('/signup', (request, response, next) => {
  console.log(request.body);
  lookForEmail(request.body.email)
  .then(() => lookForUsername(request.body.username))
  .then(() => {
    hashingPassword(request.body.password)
    .then(password => {
      request.body.password = password;
      createUser(request.body)
        .then(() => {
          const token = createUserToken(request.body);
          response.send(token)
        })
        .catch((error) => console.log(error))
    });
  }).catch(e => response.send(e));
});

// signin
router.post('/signin', authenticateUser.authenticateUser, (req, res, next) => {
  res.send(req.token);
});


module.exports = router;
