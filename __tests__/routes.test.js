'use strict';

let app = require('../app');
let request = require('supertest')(app.server);

describe('testing the server', () => {
  it('has a valid home route', async (done) => {
    const response = await request.get('/');
    expect(response.status).toBe(200);
    done();
  });

  it('has a working challenges route', async (done) => {
    const response = await request.get('/questions/challenges');
    expect(response.status).toBeTruthy;
    done();
  });
});

describe('testing for authentication', () => {
  it('has a valid signup route', (done) => {
    const response = request.post('/signup');
    expect(response.status).toBeTruthy;
    done();
  });

  it('has a valid signin route', (done) => {
    const response = request.post('/signin');
    expect(response.status).toBeTruthy;
    done();
  });
});