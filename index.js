'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

//----- Routes -----//
const authRoute = require('./src/routes/authRoutes.js');
const challengeRoutes = require('./src/routes/challengeRoutes.js');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(authRoute);
app.use(challengeRoutes);  

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
