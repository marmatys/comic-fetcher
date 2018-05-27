'use strict';

const fetch = require('./services/fetch');
const notify = require('./services/notify');
const persist = require('./services/persist');
const Q = require('q');

let config;
try {
    config = require('./config');
} catch (e) {
    config = {
        notifyUrl: 'http://www.example.com'
    };
}

const comicConfig = [
    {
        name: 'dilbert',
        fetcher: fetch.getDilbertComicUrl
    }, {
        name: 'garfield',
        fetcher: fetch.getGarfieldComicUrl
    }, {
        name: 'commitstrip',
        fetcher: fetch.getCommitStripUrl
    }, {
        name: 'xkcd',
        fetcher: fetch.getXKCDUrl
    }, {
        name: 'daily',
        fetcher: fetch.getDailyUrl
    }, {
        name: 'turnoff',
        fetcher: fetch.getTurnoffUrl
    }];

module.exports.checkComics = (event, context, callback) => {
    Q.all(Array.from(comicConfig, commic => {
        commic.fetcher()
            .then(imgUrl => persist.putIfNotExists(commic.name, imgUrl))
            .then(url => notify.notifySlack(config.notifyUrl, url));
    }))
        .then(() => callback(null, 'OK'))
        .catch(err => callback(err, null));
};
