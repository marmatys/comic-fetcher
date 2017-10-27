'use strict';

const fetch = require('./services/fetch');
const notify = require('./services/notify');

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
        .then(url => notify.notifySlack(config.notifyUrl, url))
        .then(() => callback(null, 'OK'))
        .catch(err => callback(err, null));
};

module.exports.checkComics(null, null, arg => {
    console.info('callback', arg)
});
