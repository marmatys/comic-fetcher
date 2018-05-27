const aws = require('aws-sdk');
aws.config.setPromisesDependency(require('q').Promise);
aws.config.loadFromPath('/Users/marmatys/.aws/config.json');

let db = new aws.DynamoDB();

const tableName = 'comics';

function readParams(comicName) {
    return {
        TableName: tableName,
        Key: {
            name: { S: comicName }
        }
    };
}

function scanParams(comicName, imgUrl) { // eslint-disable-line no-unused-vars
    return {
        ExpressionAttributeNames: {
            '#name': 'name'
        },
        ExpressionAttributeValues: {
            ':n': { S: comicName },
            ':url': { S: imgUrl }
        },
        KeyConditionExpression: '#name = :n',
        FilterExpression: 'lastSeenUrl = :url',
        TableName: tableName
    };
}

function writeParams(comicName, imgUrl) { // eslint-disable-line no-unused-vars
    return {
        TableName: tableName,
        Item: {
            name: { S: comicName },
            lastSeenUrl: { S: imgUrl }
        }
    };
}

let getPromise = db.getItem(readParams('non')).promise() // eslint-disable-line no-unused-vars
    .then(data => console.log('get', data))
    .catch(err => console.log('get err', err));
