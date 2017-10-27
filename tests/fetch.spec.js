"use strict";

const nock = require('nock');
const fetch = require('../services/fetch');

describe('fetch', () => {

    afterEach(function () {
        console.log('clean');
        nock.cleanAll();
    });

    it('get img url for dibert', () => {
        nock('http://dilbert.com')
            .get('/')
            .reply(200, '<img class="img-comic" src="1"><img class="img-comic" src="2">');

        return fetch.getDilbertComicUrl()
            .then(url => expect(url).toEqual('1'));
    });
});