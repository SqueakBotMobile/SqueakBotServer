'use strict';

const express = require('express');
const cors = require('cors');

//----- Routes -----//
const authRoute = require('./src/routes/authRoutes.js');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(authRoute);

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
