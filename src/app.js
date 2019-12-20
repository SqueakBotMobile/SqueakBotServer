'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

//----- Routes -----//
const authRoute = require('./routes/authRoutes.js');
const challengeRoutes = require('./routes/challengeRoutes.js');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(authRoute);
app.use(challengeRoutes);

module.exports = {
  server: app,
  start: (port) => {
    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  },
}