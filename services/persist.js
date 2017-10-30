'use strict';

const _ = require('lodash');
const aws = require('aws-sdk');
aws.config.setPromisesDependency(require('q').Promise);

const tableName = 'comics';

function readParams(comicName) {
    return {
        TableName : tableName,
        Key : {
            name : {S : comicName}
        }
    }
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

module.exports = {
    putIfNotExists : function (comicName, imgUrl) {
        const db = new aws.DynamoDB();
        let alreadyExists = false;
        return db.getItem(readParams(comicName)).promise()
            .then(result => alreadyExists = !_.isNil(result) && result.Item.lastSeenUrl === imgUrl)
            .then(() => !alreadyExists ? db.putItem(writeParams(comicName, imgUrl)).promise() : null)
            .then(() => alreadyExists ? null : imgUrl)
            .catch(err => console.error('Error during Dynamo access', err));
    }
};
