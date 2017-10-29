"use strict";

const request = require('request-promise');
const _  = require('lodash');
const q = require('q');

module.exports = {
    notifySlack: function (notifyUrl, imgUrl) {
        if (_.isNil(imgUrl)) {
            return q.resolve();
        }
        const options = {
            method: 'POST',
            uri: notifyUrl,
            json: {
                text: imgUrl
            }
        };
        return request(options);
    }
};