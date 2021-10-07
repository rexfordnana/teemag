import csv from 'csvtojson'
import { Rsvp } from '../models/rsvp.js'
import dynamo from './dynamo.js'

const pathToCsv = './lib/simple.csv'

csv().fromFile(pathToCsv).then((jsonObject) => {
  jsonObject.forEach((row) => {
    const rsvp = new Rsvp(row).formatForDynamo()
    console.log(rsvp);
    new dynamo().writeToDynamo(rsvp)
  })
})
