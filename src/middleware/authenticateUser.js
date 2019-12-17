'use strict';

async function authenticateUser(request, response, next){
  // decide which authentication method
  let token = null;
  const [authType, authString] = request.headers.authorization.split(/\s+/);
  switch(authType.toLowerCase()){
  // exchanging strings for token
  case 'basic':
    token = await authenticateBasic(authString);
    response.send(token);
    break;
  //exchanging token for data
  case 'bearer':
    token = await authenticateBearer(authString);
    request.token = token;
    next();
    break;
  default: 
    console.log('no header auth error');
  }
}

// takes our encoded STRING and finds a user and sends back a token
function authenticateBasic(string){
  let base64Buffer = Buffer.from(string, 'base64');
  let bufferString = base64Buffer.toString();
  let [username, password] = bufferString.split(':');
  let authorize = {username, password};
  // query a user using the username then validate that user with their password
  return authenticate(authorize);
}

async function authenticateBearer(token){
  const parsedToken = jwt.verify(token, process.env.SECRET);

  let SQL = `SELECT * FROM users WHERE id = $1;`
  const results = await client.query(SQL, [parsedToken.id]);
  const user = results.rows[0];
  return createUserToken(user);
}

module.exports = {authenticateUser, authenticateBasic, authenticateBearer};