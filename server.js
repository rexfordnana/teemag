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
  log.info({op: 'rsvp-post'}, 'Inside rsvp post handler');

  //format request body into savable rsvp object
  const rsvpObject = new Rsvp(req.body);
  const email = rsvpObject.email;

  //first check if email already registered
  dynamoDb.readFromDynamo(email, (dynamoResponse)=>{
    if( dynamoResponse.Count > 0 ) {
      log.info(email, ' This email has already registered!')
      res.render('index', { errors: 'Your email has already registered'})
    }else{
      dynamoDb.writeToDynamo(rsvpObject.formatForDynamo());
      //send email after saving to dynamo
      // const mailer = new SendMail(rsvpObject.email);
      // mailer.send();
      res.render('index', {alert: true, alertTitle: 'Thank you! We are honored', alertMessage: 'You’ll recieve a confirmation email!' });
    }
  });
})

app.listen(port, () => {
  log.info({ port: port }, 'App started and listening ...');
});
