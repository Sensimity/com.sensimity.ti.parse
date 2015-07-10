'use strict';

var api = require('reste'),
    logger = require('./logger');

api.config({
    debug: true, // allows logging to console of ::REST:: messages
    autoValidateParams: false, // set to true to throw errors if <param> url properties are not passed
    timeout: 4000,
    url: "https://api.parse.com/1/",
    requestHeaders: {
        "X-Parse-Application-Id": Ti.App.Properties.getString('com.sensimity.ti.parse_appId', Alloy.CFG.parse.appId),
        "X-Parse-REST-API-Key": Ti.App.Properties.getString('com.sensimity.ti.parse_apiKey', Alloy.CFG.parse.apiKey),
        "Content-Type": "application/json"
    },
    methods: [{
        name: "addInstallation",
        post: "installations"
    }, {
        name: "updateInstallation",
        put: "installations/<objectId>"
    }],
    onError: function(e) {
        logger.info('There was an error accessing the API > ' + JSON.stringify(e.error));
    },
    onLoad: function(e, callback) {
        callback(e);
    }
});

function registerPush(params, success, error) {
    if (!Ti.Network.getOnline()) {
        return;
    }
    api.addInstallation(params, success, error);
}

function updatePush(params, success, error) {
    if (!Ti.Network.getOnline()) {
        return;
    }
    api.updateInstallation(params, success, error);
}

exports.registerPush = registerPush;
exports.updatePush = updatePush;