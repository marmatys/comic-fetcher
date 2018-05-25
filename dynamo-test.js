"use strict";

const _ = require('lodash');
const aws = require('aws-sdk');
aws.config.setPromisesDependency(require('q').Promise);
aws.config.loadFromPath('/Users/marmatys/.aws/config.json');

let db = new aws.DynamoDB();

const tableName = 'comics';

function readParams(comicName) {
    return {
        TableName : tableName,
        Key : {
            name : {S : comicName}
        }
    }
}

function scanParams(comicName, imgUrl) {
    return {
        ExpressionAttributeNames : {
            '#name' : 'name'
        },
        ExpressionAttributeValues: {
            ':n': {S: comicName},
            ':url' : {S: imgUrl}
        },
        KeyConditionExpression: '#name = :n',
        FilterExpression: 'lastSeenUrl = :url',
        TableName: tableName
    };
}

function writeParams(comicName, imgUrl) {
    return {
        TableName : tableName,
        Item : {
            name : {S : comicName},
            lastSeenUrl : {S : imgUrl}
        }
    }
}

let getPromise = db.getItem(readParams('non')).promise()
    .then(data => console.log('get', data))
    .catch(err => console.log('get err', err));
