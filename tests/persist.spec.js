'use strict';

const aws = require('aws-sdk-mock');
const Q = require('q');
aws.Promise = Q.Promise;
const persist = require('./../services/persist');

describe('persist - putIfNotExists', () => {

    afterEach(() => {
        aws.restore('DynamoDB');
    });

    it('returns url for new comic', () => {
        aws.mock('DynamoDB', 'putItem', function (params, callback){
            callback(null, "OK");
        });
        aws.mock('DynamoDB', 'getItem', function (params, callback){
            callback(null, {});
        });

        return persist.putIfNotExists('garfield', 'http://example.com/1.jpg')
            .then(result => expect(result).toEqual('http://example.com/1.jpg'))
    });

    it('returns new url for already existing comic', () => {
        aws.mock('DynamoDB', 'putItem', function (params, callback){
            callback(null, "OK");
        });
        aws.mock('DynamoDB', 'getItem', function (params, callback){
            callback(null, {Item : {lastSeenUrl : {S : 'http://example.com/1.jpg'}}});
        });

        return persist.putIfNotExists('garfield', 'http://example.com/2.jpg')
            .then(result => expect(result).toEqual('http://example.com/2.jpg'))
    });

    it('adds new item', () => {
        aws.mock('DynamoDB', 'putItem', function (params, callback){
            expect(params.TableName).toEqual('comics');
            expect(params.Item.name.S).toEqual('garfield');
            expect(params.Item.lastSeenUrl.S).toEqual('http://example.com/1.jpg');
            callback(null, "OK");
        });
        aws.mock('DynamoDB', 'getItem', function (params, callback){
            callback(null, {});
        });

        return persist.putIfNotExists('garfield', 'http://example.com/1.jpg');
    });

    it('updates item with new url', () => {
        aws.mock('DynamoDB', 'putItem', function (params, callback){
            expect(params.TableName).toEqual('comics');
            expect(params.Item.name.S).toEqual('garfield');
            expect(params.Item.lastSeenUrl.S).toEqual('http://example.com/2.jpg');
            callback(null, "OK");
        });
        aws.mock('DynamoDB', 'getItem', function (params, callback){
            callback(null, {Item : {lastSeenUrl : {S : 'http://example.com/1.jpg'}}});
        });

        return persist.putIfNotExists('garfield', 'http://example.com/2.jpg');
    });

    it('returns null for existing comic', () => {
        aws.mock('DynamoDB', 'putItem', function (params, callback){
            callback(null, "OK");
        });
        aws.mock('DynamoDB', 'getItem', function (params, callback){
            callback(null, {Item : {lastSeenUrl : {S : 'http://example.com/1.jpg'}}});
        });

        return persist.putIfNotExists('garfield', 'http://example.com/1.jpg')
            .then(result => expect(result).toBeNull())
    });

    it('does not update existing comic', () => {
        let putReceived = false;
        aws.mock('DynamoDB', 'putItem', function (params, callback){
            putReceived = true;
            callback(null, "OK");
        });
        aws.mock('DynamoDB', 'getItem', function (params, callback){
            callback(null, {Item : {lastSeenUrl : {S : 'http://example.com/1.jpg'}}});
        });

        return persist.putIfNotExists('garfield', 'http://example.com/1.jpg')
            .then(() => expect(putReceived).toBeFalsy());
    });

});
