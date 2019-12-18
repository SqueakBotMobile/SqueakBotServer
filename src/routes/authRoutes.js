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
  lookForEmail(request.body.email)
  .then(e =>  {
    if(e) {
      // feedback to user handleErrors()
    } else {
      lookForUsername(request.body.username)
    }
  })
  .then(e => {
    if (e) {
      // feedback to user handleUser
    }
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
});

// signin
router.post('/signin', authenticateUser.authenticateUser);


module.exports = router;
