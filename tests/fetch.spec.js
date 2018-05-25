"use strict";

const nock = require('nock');
const fetch = require('../services/fetch');

describe('fetch', () => {

    afterEach(function () {
        nock.cleanAll();
    });

    it('get img url for dilbert', () => {
        nock('http://dilbert.com')
            .get('/')
            .reply(200, '<img class="img-comic" src="1"><img class="img-comic" src="2">');

        return fetch.getDilbertComicUrl()
            .then(url => expect(url).toEqual('1'));
    });

    it('get img url for garfield', () => {
        nock('https://garfield.com')
            .get('/')
            .reply(200, '<img class="img-responsive" src="https://1">');

        return fetch.getGarfieldComicUrl()
            .then(url => expect(url).toEqual('https://1'));
    });

    it('get img url for commitstrip', () => {
        nock('http://www.commitstrip.com/en')
            .get('/')
            .reply(200, `
                <body>
                    <div class="excerpt"><a href="http://www.commitstrip.com/en/2017/10/18"></a></div>
                    <div class="excerpt"><a href="http://www.commitstrip.com/en/2017/10/01"></a></div>
                </body>
            `)
            .get('/2017/10/18')
            .reply(200, '<div class="entry-content"><p><img src="http://1.jpg"></p></div>');

        return fetch.getCommitStripUrl()
            .then(url => expect(url).toEqual('http://1.jpg'));
    });

    it('get img url for xkcd', () => {
        nock('https://xkcd.com')
            .get('/')
            .reply(200, '<div id="comic"> <img src="//digital_resource_lifespan.png"> </div>');

        return fetch.getXKCDUrl()
            .then(url => expect(url).toEqual('https://digital_resource_lifespan.png'));
    });

    it('get img url for daily', () => {
        nock('http://daily.art.pl')
            .get('/')
            .reply(200, `<div id="daily"> <img src="/img/1.png"> </div>`);

        return fetch.getDailyUrl()
            .then(url => expect(url).toEqual('http://daily.art.pl/img/1.png'))
    });
});