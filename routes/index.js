const express = require('express');
const rsvps = require('../models/rsvp.js');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('A beautiful website coming soon');
});

router.get('/rsvp', (req, res) => {
  res.send(rsvps);
});

module.exports = router;
