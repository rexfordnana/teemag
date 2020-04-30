const express = require('express');
const homeRouter = require('./routes/index.js');

//instantiate express
const server = new express();

//use a middleware
server.use('/', homeRouter);

//start the server
server.listen(3000, 'localhost', () => {
  console.log('listening on port 3000');
});
