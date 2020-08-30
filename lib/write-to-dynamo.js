import AWS from 'aws-sdk';
import { childLogger } from './logger.js';
import config from 'config';

export const writeToDynamo = (payload) => {
  const awsRegion = config.get('aws_home_region') || process.env.AWS_REGION;
  const dynamoDbTable =
    config.get('dynamo_db.table') || process.env.DYNAMO_DB_TABLE;
  const log = childLogger(
    { op: 'dynamodb-write', table: dynamoDbTable, payload },
    'Writing data to dynamo db'
  );
  const params = {
    Item: payload,
    TableName: dynamoDbTable,
  };
  AWS.config.update({ region: awsRegion });
  const requestStart = Date.now();
  const dynamodb = new AWS.DynamoDB({
    apiVersion: '2012-08-10',
    region: awsRegion,
    httpOptions: {
      connectTimeout: config.get('dynamo_db.connection_timeout'),
      timeout: config.get('dynamo_db.timeout'),
    },
  });
  // const res = dynamodb.putItem(payload);
  // dynamodb.putItem(params, (err, data) => {
  //   if (err)
  //     log.error({ op: 'dynamodb-write', err }, 'Failed to write to dynamo db');
  //   else log.info('returned from API', data);
  // });
  log.info(
    { op: 'dynamodb-write', latency: Date.now() - requestStart },
    'DynamoDB write request complete'
  );
};

// const testPayload = {
//   rsvpRequestId: 'somestring',
//   created_on: Date.now(),
//   attending: true,
//   email: 'tester@gmail.com',
//   message: 'something nice',
//   name: 'Qa tester',
// };

// writeToDynamo(testPayload);
