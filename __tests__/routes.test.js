'use strict';

let app = require('../src/app');
let request = require('supertest')(app.server);

let user = {
  username: 'tester',
  email: 'tester@email.com',
  password: 'testing',
};

let userCreds = btoa(`${user.username}:${user.password}`);

let token = null;

describe('testing for authentication', () => {
  it('has a valid signup route', async (done) => {
    const response = await request.post('/signup').send(user);
    expect(response.status).toBe(200);
    done();
  });

  it('has a valid signin route', async (done) => {
    const response = await request.post('/signin').set(`Authorization`, `Basic ${userCreds}`);
    expect(response.status).toBe(200);
    expect(response.text).toBeTruthy;
    token = response.text;
    done();
  });
});

describe('testing the server', () => {
  it('expect slash to be not found', async (done) => {
    const response = await request.get('/');
    expect(response.status).toBe(404);
    done();
  });

  it('has a working challenges route', async (done) => {
    console.log(token);
    const response = await request.get('/questions/challenges').set(`Authorization`, `Bearer ${token}`);
    expect(response.body.length).toBeTruthy;
    done();
  });

  it('has a working routes by id', async (done) => {
    console.log(token);
    const response = await request.get('/questions/challenges/:id').set(`Authorization`, `Bearer ${token}`);
    expect(response.body.length).toBeTruthy;
    done();
  });

  it('has a working routes by hint', async (done) => {
    console.log(token);
    const response = await request.get('/questions/challenges/hint').set(`Authorization`, `Bearer ${token}`);
    expect(response.body.length).toBeTruthy;
    done();
  });
});
