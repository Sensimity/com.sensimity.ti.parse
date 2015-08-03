'use strict';

var push = require('./lib/push');

function init(appId, apiKey) {
    Ti.App.Properties.setString('com.sensimity.ti.parse_appId', Alloy.CFG.parse.appId);
    Ti.App.Properties.setString('com.sensimity.ti.parse_apiKey', Alloy.CFG.parse.apiKey);
}

function registerPush(channels) {
    push.registerPush(channels);
}

function updatePush(channels) {
    push.updatePush(channels);
}

module.exports = {
    "init": init,
    "registerPush": registerPush,
    "updatePush": updatePush
};