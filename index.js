const ApiBuilder = require("claudia-api-builder");
const AWS = require("aws-sdk");
const uuid = require("uuid/v4");
const config = require('./config');

const api = new ApiBuilder();
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const validator = require('email-validator');

const getAllItems = async () => {
  return dynamoDb
    .scan({ TableName: config.dynamo_table_name })
    .promise()
    .then(response => response.Items);
};

const emailIsValid = email => {
  return validator.validate(email) && email.split("@")[1] === config.email_postfix;
}

api.post("/subscribe", request => {

  if(!emailIsValid(request.body.email)){
    throw new ApiBuilder.ApiResponse(`
      <error>
        The entered email is invalid, please enter a valid PA Consulting email address.
      </error>`, 
      {'Content-Type': 'text/xml'}, 500);
  }

  const params = {
    TableName: config.dynamo_table_name,
    Item: {
      [config.dynamo_hash_key]: uuid(),
      email: request.body.email
    }
  };
    return dynamoDb.put(params).promise();
  },
  { success: 201 },
  { error: 500 }
);

api.get("/subscribe", async request => {
  return getAllItems();
});

module.exports = api;
