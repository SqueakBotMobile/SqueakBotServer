'use strict';

require('dotenv').config();
const app = require('./src/app');

app.start(process.env.PORT);