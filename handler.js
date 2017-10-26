'use strict';

const request = require('request-promise');
const cheerio = require('cheerio');

module.exports.checkComics = (event, context, callback) => {
    fetchDilbert()
        .then(body => getImage(body))
        .then(url => console.info(url))
        .then(() => callback(null, 'OK'))
        .catch(err => callback(err, null));

    function getImage(body) {
        const $ = cheerio.load(body);
        return $('.img-comic')[0].src;
    }

    function fetchDilbert() {
        return request({uri: 'http://dilbert.com/'});
    }
};

