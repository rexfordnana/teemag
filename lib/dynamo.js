import AWS from 'aws-sdk';
import { childLogger } from './logger.js';
import config from 'config';

export default class DynamoDb{
  constructor(){
    this.awsRegion = config.get('aws_home_region') || process.env.AWS_REGION;
    this.tableName = config.get('dynamo_db.table') || process.env.DYNAMO_DB_TABLE;
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

  readFromDynamo(email){
    const params = {
      TableName: this.tableName,
      Key: {
        'email': {S: email}
      },
      ProjectionExpression: 'ATTRIBUTE_NAME'
    };
    
    // Call DynamoDB to read the item from the table
    this.dynamodb.getItem(params, function(err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Success", data.Item);
      }
    });


  }
}
