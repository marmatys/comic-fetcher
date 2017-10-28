"use strict";

const cheerio = require('cheerio');
const request = require('request-promise');
const tough = require('tough-cookie');

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
    },

    getGarfieldComicUrl : function () {
        return fetchGarfieldSite()
            .then(body => getImage(body));

        function getImage(body) {
            const $ = cheerio.load(body);
            return $('img.img-responsive')[0].attribs.src;
        }

        function fetchGarfieldSite() {
            let cookie = defaultCookie();
            let jar = request.jar();
            jar.setCookie(cookie, 'https://garfield.com/');
            let options = {
                uri: 'https://garfield.com/',
                jar : jar
            };
            return request(options)
        }

        function defaultCookie() {
            return new tough.Cookie({
                key: 'age-gated',
                value: 'eyJpdiI6IkhLMHBZWW1aMjVXZDNCekxRSlRGdXc9PSIsInZhbHVlIjoidzAxbUNtR0lIVXYreXJZa05nY1JCZz09IiwibWFjIjoiYzg1ZWYyZDMxOWE0NDIyOGJmYmMxOGU2NmRiZWFiZGVmMmUyYzA2Zjc2NGNjZTlhZjc4M2QwMjAzZWJiNzQwNiJ9',
                domain: 'garfield.com',
                path: '/'
            });
        }
    },

    getCommitStripUrl : function () {
        return fetchCommitStripSite()
            .then(body => getFirstUrl(body))
            .then(url => fetchDetailPage(url))
            .then(body => getImage(body));

        function getImage(body) {
            const $ = cheerio.load(body);
            return $('.entry-content img')[0].attribs.src;
        }

        function fetchDetailPage(url) {
            return request({uri: url});
        }

        function fetchCommitStripSite() {
            return request({uri: 'http://www.commitstrip.com/en/'});
        }

        function getFirstUrl(body) {
            const $ = cheerio.load(body);
            return $('.excerpt:first-child a')[0].attribs.href;
        }
    }
};
