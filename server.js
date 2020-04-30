const express = require('express');
const homeRouter = require('./routes/index.js');
const rsvps = require('./models/rsvp.js');

/*
 * instantiate express
 */

const server = new express();
console.log(rsvps);
//create Routes
// server.get("/user", (req, res) => {
//   res.send({ name: "rex" });
// });
server.get('/other', (req, res) => {
  res.send('this is the other page');
});
server.get('/rsvp', (req, res) => {
  res.send('this is the posts page');
  res.send(posts);
});

//use a middleware
server.use('/home', homeRouter);

//start the server
server.listen(3000, 'localhost', () => {
  console.log('listening on port 3000');
});
