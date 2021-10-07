import express from 'express';
import session from 'express-session'
import config from 'config'
import moment from 'moment'
import axios from 'axios'
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
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

// Define routes
app.get('/', (req, res) => {
  res.render('index',{ errors: {}});
});
app.get('/admin', (req, res) => {
  res.render('sign-in')
})

app.post('/rsvp', async (req, res) => {
  log.info({op: 'rsvp-post'}, 'Inside rsvp post handler');

  //format request body into savable rsvp object
  const rsvpObject = new Rsvp(req.body);
  const email = rsvpObject.email.toLowerCase();
  const captcha = req.body['g-recaptcha-response'];
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const captchaSecret = config.get('captchaSecret') || process.env.captchaSecret

  // g-recaptcha-response is the key that browser will generate upon form submit.
  // if its blank or null means user has not selected the captcha, so return the error.
  if (captcha === undefined || captcha === '' || captcha === null) {
    return res.render('index', {errors: { captcha: 'Click captcha'}});
  }
  try{
    const captchaVerified = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${captchaSecret}&response=${captcha}&remoteip=${ip}`)
    if (captchaVerified.data.success){
      //first check if email already registered
      dynamoDb.readFromDynamo(email, (dynamoResponse)=>{
        if( dynamoResponse.Count > 0 ) {
          log.info(email, 'This email has already registered!')
          res.render('index', { errors: { email: 'Your email has already registered'}})
        } else {
          dynamoDb.writeToDynamo(rsvpObject.formatForDynamo());
          //send email after saving to dynamo
          // const mailer = new SendMail(rsvpObject.email);
          // mailer.send();
          res.render('index', {alert: true, alertTitle: 'Thank you! We are honored', alertMessage: 'You’ll recieve a confirmation email!' });
        }
      });
    } else {
      log.error('verifcation failed', captchaVerified.data['error-codes']);
      res.end()
    }
  } catch(error) {
    log.error({op:  'rsvp-captcha', error}, 'Failed to verify captcha')
  }
})

app.post('/auth', (req, res) => {
  log.info({op: 'auth'}, 'Inside auth handler');
	const username = req.body.username;
  const password = req.body.password;
  let loggedInUser = [];
	if (username && password) {
    loggedInUser = config.get("accounts").filter((account)=> account.username == username && account.password == password)
    log.info('Getting user information')
    if (loggedInUser.length > 0) {
      req.session.loggedin = true;
      req.session.username = username;
      res.redirect('/admin-page');
    } else {
      res.render('sign-in', {message:'Incorrect Username and/or Password!'});
    }			
    res.end();
	} else {
		res.render('sign-in', {message:'Please enter Username and Password!'});
		res.end();
	}
});
app.get('/admin-page', (req, res) => {
	if (req.session.loggedin) {
    dynamoDb.getAllData((data, err) => {
      if (data) {
        res.render('admin-page', {rsvpObject: data.Items.sort((a,b) => b.created_on - a.created_on), moment: moment } );
      }
      else log.error('Failed to get all data', err)
    })
	} else {
		res.send('Please login to view this page!');
	}
	// res.end();
});
app.listen(port, () => {
  log.info({ port: port }, 'App started and listening ...');
});