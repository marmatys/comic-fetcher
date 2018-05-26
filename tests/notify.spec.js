"use strict";

const nock = require('nock');
const notify = require('../services/notify');
const _ = require('lodash');

describe('notify', () => {

    afterEach(function () {
        nock.cleanAll();
    });

    it('notifies slack with url', async () => {
        let imgUrl = '1.jpg';
        let notifyUrl = 'http://www.example.com';
        let request = nock(notifyUrl)
            .post('/', {
                text : imgUrl
            })
            .reply(200);

        await notify.notifySlack(notifyUrl, imgUrl);
        
        expect(request.isDone()).toBeTruthy();
    });

    _.each([undefined, null], imgUrl => {
        it(`does not notify for ${imgUrl} url`, async () => {
            let notifyUrl = 'http://www.example.com';
            let request = nock(notifyUrl)
                .post('/')
                .reply(200);

            await notify.notifySlack(notifyUrl, imgUrl);

            expect(request.isDone()).toBeFalsy();
        })
    });
});