"use strict";

const cheerio = require('cheerio');
const request = require('request-promise');
const tough = require('tough-cookie');

function getDilbertComicUrl() {
    return fetchDilbert()
        .then(body => getImage(body, '.img-comic'));

    function fetchDilbert() {
        return request({uri: 'http://dilbert.com/'});
    }
}

function getXKCDUrl() {
    return request({uri : 'https://xkcd.com/'})
        .then(body => getImage(body, '#comic img'))
        .then(url => 'https:' + url);
}

function getDailyUrl() {
    return request({url: 'http://daily.art.pl'})
        .then(body => getImage(body, '#daily img'))
        .then(url => 'http://daily.art.pl' + url);
}

function getGarfieldComicUrl() {
    return fetchGarfieldSite()
        .then(body => getImage(body, 'img.img-responsive'));

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
}

function getCommitStripUrl() {
    return fetchCommitStripSite()
        .then(body => getFirstUrl(body))
        .then(url => fetchDetailPage(url))
        .then(body => getImage(body, '.entry-content img'));

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

function getImage(body, selector) {
    const $ = cheerio.load(body);
    return $(selector)[0].attribs.src;
}

module.exports = {
    getDilbertComicUrl : getDilbertComicUrl,
    getGarfieldComicUrl : getGarfieldComicUrl,
    getCommitStripUrl : getCommitStripUrl,
    getXKCDUrl : getXKCDUrl,
    getDailyUrl : getDailyUrl
};
