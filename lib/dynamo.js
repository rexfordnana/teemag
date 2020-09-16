import AWS from 'aws-sdk';
import { childLogger } from './logger.js';
import config from 'config';

export default class DynamoDb{
  constructor(){
    this.awsRegion = process.env.AWS_REGION || config.get('aws_home_region');
    this.tableName = process.env.DYNAMO_DB_TABLE || config.get('dynamo_db.table');
    AWS.config.update({ region: this.awsRegion });
    this.log = childLogger(
      { op: 'dynamodb', table: this.tableName },
      'Initializing dynamo db'
    );
    this.dynamodb = new AWS.DynamoDB({
      apiVersion: '2012-08-10',
      region: this.awsRegion,
      httpOptions: {
        connectTimeout: config.get('dynamo_db.connection_timeout'),
        timeout: config.get('dynamo_db.timeout'),
      },
    });
    this.documentClient = new AWS.DynamoDB.DocumentClient({
      region: this.awsRegion,
    })
  } 

  writeToDynamo(payload){
    const params = { ...payload, TableName: this.tableName };
    const requestStart = Date.now();
    this.log.info({ op: 'dynamodb-write', params}, 'Writing to dynamo')
    this.dynamodb.putItem(params, (err, data) => {
      if (err)
        this.log.error({ op: 'dynamodb-write', err }, 'Failed to write to dynamo db');
      else this.log.info({ op: 'dynamodb-write', data } , 'Returned from API...', );
    });
    this.log.info(
      { op: 'dynamodb-write', latency: Date.now() - requestStart },
      'DynamoDB write request complete'
    );
  }

  readFromDynamo(email, next){
    const params = {
      TableName: this.tableName,
      FilterExpression: "email = :e",
      ExpressionAttributeValues: {
          ":e": email,
      },
    };
    const requestStart = Date.now();
    
    // Call DynamoDB to scan the table for email passed
    this.documentClient.scan(params, (err, data) => {
      if (err) {
        this.log.warn('Unable to query dynamo db', err)
      } else { 
        this.log.info({op: 'dynamodb-read', latency: Date.now() - requestStart, data}, 'Successfully retrieved email from dynamo');
        next(data)
      }
    });
  }
}