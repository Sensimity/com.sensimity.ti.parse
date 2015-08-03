'use strict';

var api = require('reste'),
    constant = require('./constants'),
    logger = require('./logger');

api.config({
    debug: false, // allows logging to console of ::REST:: messages
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
        logger.error('No push channels registration was issued, device is offline');
        return;
    }

    if (constant.OS_IOS) {
        api.addInstallation(params, success, error);
    } else if (constant.OS_ANDROID) {
        // Android Parse Integration
        // gittio install eu.rebelcorp.parse > 0.7
        var Parse = require('eu.rebelcorp.parse');
        Parse.start();

        Parse.addEventListener('notificationreceive', function(e) {
            params.notificationReceive && params.notificationReceive(e);
        });

        Parse.addEventListener('notificationopen', function(e) {
            params.notificationOpen && params.notificationOpen(e);
        });

        if (params.body.channels) {
            params.body.channels.map(function(channel) {
                logger.debug('Subscribing to channel: ' + channel);
                Parse.subscribeChannel(channel);
            });
        }

        success && success({
            'objectId': Parse.getObjectId()
        });
    }
}

function updatePush(params, success, error) {
    if (!Ti.Network.getOnline()) {
        logger.error('No push channels update was issued, device is offline');
        return;
    }
    api.updateInstallation(params, success, error);
}

exports.registerPush = registerPush;
exports.updatePush = updatePush;