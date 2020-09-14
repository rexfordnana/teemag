import express from 'express';
import { childLogger } from './lib/logger.js';
import bodyParser from 'body-parser';
import DynamoDb from './lib/dynamo.js';
import SendMail from './lib/send-mail.js';
import { Rsvp } from './models/rsvp.js';

const app = express();
const port = process.env.PORT || 8081;
const log = childLogger({ op: 'In index js' });
const dynamoDb = new DynamoDb();

//Define some middlewares
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define routes
app.get('/', (req, res) => {
  res.render('index');
});

app.post('/rsvp', (req, res) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  log.info('In rsvp ...');
  const rsvpObject = new Rsvp(req.body);
  // console.log(rsvpObject.formatForDynamo());
  console.log('do nothing');
  dynamoDb.writeToDynamo(rsvpObject.formatForDynamo());

  //send email after saving to dynamo
  const mailer = new SendMail(rsvpObject.email);
  // mailer.send();
  log.info(req.body);
  res.redirect('/');
})

app.listen(port, () => {
  log.info({ port: port }, 'App started and listening ...');
});
