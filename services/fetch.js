"use strict";

const cheerio = require('cheerio');
const request = require('request-promise');

module.exports = {
    getDilbertComicUrl : function () {
        return fetchDilbert()
            .then(body => getImage(body));

        function fetchDilbert() {
            return request({uri: 'http://dilbert.com/'});
        }

        function getImage(body) {
            const $ = cheerio.load(body);
            return $('.img-comic')[0].attribs.src;
        }
    }
};
