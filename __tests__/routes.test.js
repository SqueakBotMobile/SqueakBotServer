'use strict';

let app = require('../src/app');
let request = require('supertest')(app.server);

describe('testing the server', () => {
  it('expect slash to be not found', async (done) => {
    const response = await request.get('/');
    expect(response.status).toBe(404);
    done();
  });

  it('has a working challenges route', async (done) => {
    const response = await request.get('/questions/challenges');
    expect(response.status).toBeTruthy;
    done();
  });
});

describe('testing for authentication', () => {
  it('has a valid signup route', async (done) => {
    const response = await request.post('/signup');
    expect(response.status).toBeTruthy;
    done();
  });

  it('has a valid signin route', async (done) => {
    const response = await request.post('/signin');
    expect(response.status).toBeTruthy;
    done();
  });
});