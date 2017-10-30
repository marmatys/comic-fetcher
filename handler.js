'use strict';

const fetch = require('./services/fetch');
const notify = require('./services/notify');
const persist = require('./services/persist');

let config;
try {
    config = require('./config')
} catch(e) {
    config = {
        notifyUrl : 'http://www.example.com'
    }
}

module.exports.checkComics = (event, context, callback) => {
    fetch.getDilbertComicUrl()
        .then(imgUrl => persist.putIfNotExists('dilbert', imgUrl))
        .then(url => notify.notifySlack(config.notifyUrl, url))
        .then(fetch.getGarfieldComicUrl)
        .then(imgUrl => persist.putIfNotExists('garfield', imgUrl))
        .then(url => notify.notifySlack(config.notifyUrl, url))
        .then(fetch.getCommitStripUrl)
        .then(imgUrl => persist.putIfNotExists('commitstrip', imgUrl))
        .then(url => notify.notifySlack(config.notifyUrl, url))
        .then(fetch.getXKCDUrl)
        .then(imgUrl => persist.putIfNotExists('xkcd', imgUrl))
        .then(url => notify.notifySlack(config.notifyUrl, url))
        .then(() => callback(null, 'OK'))
        .catch(err => callback(err, null));
};
