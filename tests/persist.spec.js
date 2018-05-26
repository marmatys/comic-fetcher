'use strict';

const aws = require('aws-sdk-mock');
const Q = require('q');
aws.Promise = Q.Promise;
const persist = require('./../services/persist');

describe('persist - putIfNotExists', () => {

    afterEach(() => {
        aws.restore('DynamoDB');
    });

    it('returns url for new comic', async () => {
        aws.mock('DynamoDB', 'putItem', function (params, callback){
            callback(null, "OK");
        });
        aws.mock('DynamoDB', 'getItem', function (params, callback){
            callback(null, {});
        });

        const result = await persist.putIfNotExists('garfield', 'http://example.com/1.jpg');
            
        expect(result).toEqual('http://example.com/1.jpg');
    });

    it('returns new url for already existing comic', async () => {
        aws.mock('DynamoDB', 'putItem', function (params, callback){
            callback(null, "OK");
        });
        aws.mock('DynamoDB', 'getItem', function (params, callback){
            callback(null, {Item : {lastSeenUrl : {S : 'http://example.com/1.jpg'}}});
        });

        const result = await persist.putIfNotExists('garfield', 'http://example.com/2.jpg');
            
        expect(result).toEqual('http://example.com/2.jpg');
    });

    it('adds new item', async () => {
        aws.mock('DynamoDB', 'putItem', function (params, callback) {
            expect(params.TableName).toEqual('comics');
            expect(params.Item.name.S).toEqual('garfield');
            expect(params.Item.lastSeenUrl.S).toEqual('http://example.com/1.jpg');
            callback(null, "OK");
        });
        aws.mock('DynamoDB', 'getItem', function (params, callback) {
            callback(null, {});
        });

        await persist.putIfNotExists('garfield', 'http://example.com/1.jpg');
    });

    it('updates item with new url', async () => {
        aws.mock('DynamoDB', 'putItem', function (params, callback){
            expect(params.TableName).toEqual('comics');
            expect(params.Item.name.S).toEqual('garfield');
            expect(params.Item.lastSeenUrl.S).toEqual('http://example.com/2.jpg');
            callback(null, "OK");
        });
        aws.mock('DynamoDB', 'getItem', function (params, callback){
            callback(null, {Item : {lastSeenUrl : {S : 'http://example.com/1.jpg'}}});
        });

        await persist.putIfNotExists('garfield', 'http://example.com/2.jpg');
    });

    it('returns null for existing comic', async () => {
        aws.mock('DynamoDB', 'putItem', function (params, callback){
            callback(null, "OK");
        });
        aws.mock('DynamoDB', 'getItem', function (params, callback){
            callback(null, {Item : {lastSeenUrl : {S : 'http://example.com/1.jpg'}}});
        });

        const result = await persist.putIfNotExists('garfield', 'http://example.com/1.jpg');
            
        expect(result).toBeNull();
    });

    it('does not update existing comic', async () => {
        let putReceived = false;
        aws.mock('DynamoDB', 'putItem', function (params, callback){
            putReceived = true;
            callback(null, "OK");
        });
        aws.mock('DynamoDB', 'getItem', function (params, callback){
            callback(null, {Item : {lastSeenUrl : {S : 'http://example.com/1.jpg'}}});
        });

        await persist.putIfNotExists('garfield', 'http://example.com/1.jpg');
            
        expect(putReceived).toBeFalsy();
    });

});
