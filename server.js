import express from 'express';
import { childLogger } from './lib/logger.js';
import bodyParser from 'body-parser';
import expressValidator from 'express-validator';
import { writeToDynamo } from "./lib/write-to-dynamo.js";
import { Rsvp } from "./models/rsvp.js"

const { body, validationResult } = expressValidator;
const app = express();
const port = 3000 || process.env.PORT;
const log = childLogger({ op: 'In index js' });

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index.html');
});

app.post(
  '/rsvp',
  [
    body('name').isLength({ min: 10 }),
    // body('email').isEmail,
    //   body('attending').isString,
    // body('message').isString,
  ],
  (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    log.info('in rsvp ...');
    const errors = validationResult(req);
    const rsvpObject = new Rsvp(req.body);
    console.log(rsvpObject.formatForDynamo())
    if (!errors.isEmpty()) {
      log.error(errors);
      res.redirect('/');
    } else {
      // writeToDynamo(payload);
    }
    log.info(req.body);
    res.redirect('/');
  }
);

app.listen(port, () => {
  log.info({ port: port }, 'App started and listening ...');
});
