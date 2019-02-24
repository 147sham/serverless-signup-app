# Simple serverless web application

This is a simple back-end web application to be deployed in AWS which will `put` and `get` items from a DynamoDB table.

## Requirements

Some requirements before you begin:

- This project is based on using [Claudia](https://claudiajs.com/documentation.html), please install that first. `npm i -g claudia` 
- Make sure you have `npm` or `yarn` installed
- This project was built using Node 8.12.0, make sure you have node installed
- aws-cli is required for this project, see [this](https://aws.amazon.com/cli/) for help

## Setting up AWS

Firstly, you will need to have your credentials loaded on your environment, see [this](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html) for help.  

You then need to setup a DynamoDB table to add and retrieve data from, you can do this by running the following command:

```
aws dynamodb create-table --table-name my_table_name \                                        (127) 18:16:44 
        --attribute-definitions AttributeName=my_hash_key,AttributeType=S \
        --key-schema AttributeName=my_hash_key,KeyType=HASH \
        --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 \
        --region eu-west-1 \
        --query TableDescription.TableArn --output text
```

Above, you can replace `my_table_name` with your desired table name, and `my_hash_key` with your desired hash key for the table.

## Deploying the application

- Run `yarn` to install dependencies
- Make sure you have your AWS credentials in the environment you're using
- Run `claudia create --region eu-west-1 --api-module index --policies policies` while in the project directory, this will deploy the serverless application to your AWS. 

You should get something like the following back: 

```
{
  "lambda": {
    "role": "my-service-executor",
    "name": "my-service",
    "region": "eu-west-1"
  },
  "api": {
    "id": "your-service-id",
    "module": "index",
    "url": "https://your-service-url.execute-api.eu-west-1.amazonaws.com/latest"
  }
}
```

You can then navigate to the URL to see the items in your table, or alternatively post data: 

```
curl -H "Content-Type: application/json" -X POST -d '{"myhashkey":"123", "email":"whatever@whatever.com"}' https://your-service-url.execute-api.eu-west-1.amazonaws.com/latest/my-service
```

### Updating 

If you want to make code changes and redploy, just simple run `claudia update` and Claudia will zip your resources and update them in AWS. 