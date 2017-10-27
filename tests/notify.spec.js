"use strict";

const nock = require('nock');
const notify = require('../services/notify');

describe('notify', () => {

    afterEach(function () {
        nock.cleanAll();
    });

    it('notifies slack with url', () => {
        let imgUrl = '1.jpg';
        let notifyUrl = 'http://www.example.com';
        let request = nock(notifyUrl)
            .post('/', {
                text : imgUrl
            })
            .reply(200);

        return notify.notifySlack(notifyUrl, imgUrl)
            .then(() => expect(request.isDone()).toBeTruthy());
    });
});