"use strict";

const request = require('request-promise');

module.exports = {
    notifySlack: function (notifyUrl, imgUrl) {
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