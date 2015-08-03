var client = require('./client'),
    constant = require('./constants'),
    logger = require('./logger'),
    dispatcher = require('./dispatcher'),
    channels = require('./push/channels');

function timezone() {
    var dt = new Date();
    var tz = dt.toString();      // ends with (time zone name)
    tz = tz.replace(/^.*\(/,""); // Remove leading text through (
    tz = tz.replace(/\).*$/,""); // Remove trailing text from )
    return tz;
}

/**
 * Registers device for push notifications and then registers the device on Parse
 * with the default channels
 * @param {Array} channels
 */
function registerPush(_channels) {
    if (Ti.App.Properties.getString('com.sensimity.ti.parse_objectId', '') != '') {
        logger.info("Device already registered with objectId: " + Ti.App.Properties.getString('com.sensimity.ti.parse_objectId'));
        return;
    }

    logger.info("Registering device channels > " + JSON.stringify(_channels));

    channels.set(_channels);

    if (constant.OS_IOS) {

        // Check if the device is running iOS 8 or later
        if (parseInt(Ti.Platform.version.split(".")[0], 10) >= 8) {

            // Wait for user settings to be registered before registering for push notifications
            Ti.App.iOS.addEventListener('usernotificationsettings', function registerForPush() {

                // Remove event listener once registered for push notifications
                Ti.App.iOS.removeEventListener('usernotificationsettings', registerForPush);

                Ti.Network.registerForPushNotifications({
                    success : deviceTokenSuccess,
                    error : deviceTokenError,
                    callback : receivePush
                });
            });

            // Register notification types to use
            Ti.App.iOS.registerUserNotificationSettings({
                types : [Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT, Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND, Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE]
            });
        }
        // For iOS 7 and earlier
        else {
            Ti.Network.registerForPushNotifications({
                // Specifies which notifications to receive
                types : [Ti.Network.NOTIFICATION_TYPE_BADGE, Ti.Network.NOTIFICATION_TYPE_ALERT, Ti.Network.NOTIFICATION_TYPE_SOUND],
                success : deviceTokenSuccess,
                error : deviceTokenError,
                callback : receivePush
            });
        }

    } else if (constant.OS_ANDROID) {
        // android doesnt need device token for parse
        deviceTokenSuccess();
    }
}

function updatePush(_channels) {
    if (Ti.App.Properties.getString('com.sensimity.ti.parse_objectId', '') == '') {
        // incorrect usage of the API, update before registering. Fallback to register
        registerPush(_channels);
        return;
    }

    var updateParams = {};

    channels.set(_channels);

    if (constant.OS_IOS) {
        //logger.info("retrieved token!: " + e.deviceToken);

        //*******************************************************
        // REMOVE APPLICATION SPECIFIC CODE FROM LIBRARY
        // no alloy models code should be here!!
        updateParams = {
            objectId: Ti.App.Properties.getString('com.sensimity.ti.parse_objectId'),
            body : {
                "channels": channels.get(),
                "timeZone": timezone(),
                "appVersion" : Titanium.App.version
            }
        };
    } else {
        logger.debug("registering the android device for push");

        //*******************************************************
        // REMOVE APPLICATION SPECIFIC CODE FROM LIBRARY
        // no alloy models code should be here!!
        updateParams = {
            notificationReceive : receivePush,
            objectId: Ti.App.Properties.getString('com.sensimity.ti.parse_objectId'),
            body : {
                "channels": channels.get(),
                "deviceType" : "android"
            }
        };
    }

    client.updatePush(updateParams, function(_response) {
        channels.reset();
        logger.info("client.updatePush -  " + JSON.stringify(_response));
    }, function(_error) {
        channels.reset();
        logger.error("client.updatePush ERROR-  " + JSON.stringify(_error));
    });
}

// Process incoming push notifications for ios
function receivePush(e) {
    logger.info('Received push: ' + JSON.stringify(e));

    dispatcher.trigger("parse.push.received", e);
}

// Enable push notifications for this device
// Save the device token for subsequent API calls
function deviceTokenSuccess(e) {

    var registerParams = {};

    if (constant.OS_IOS) {
        logger.info("retrieved token!: " + e.deviceToken);

        //*******************************************************
        // REMOVE APPLICATION SPECIFIC CODE FROM LIBRARY
        // no alloy models code should be here!!
        registerParams = {
            body : {
                "channels": channels.get(),
                "deviceType" : "ios",
                "deviceToken" : e.deviceToken,
                "appIdentifier" : Ti.App.id,
                "appName" : Ti.App.name,
                "appVersion" : Ti.App.version,
                "timeZone": timezone(),
                "installationId" : Ti.Platform.createUUID()
            }
        };
    } else {
        logger.debug("registering the android device for push");

        //*******************************************************
        // REMOVE APPLICATION SPECIFIC CODE FROM LIBRARY
        // no alloy models code should be here!!
        registerParams = {
            notificationReceive : receivePush,
            body : {
                "channels": channels.get(),
                "deviceType" : "android"
            }
        };
    }

    client.registerPush(registerParams, function(_response) {
        channels.reset();

        if (!_.isUndefined(_response.objectId)) {
            logger.info("client.registerPush -  " + JSON.stringify(_response));
            Ti.App.Properties.setString('com.sensimity.ti.parse_objectId', _response.objectId);
        }

    }, function(_error) {
        channels.reset();
        logger.error("client.registerPush ERROR-  " + JSON.stringify(_error));
    });

}

function deviceTokenError(e) {
    logger.info('Failed to register for push notifications! ' + e.error);
}

module.exports = {
    registerPush : registerPush,
    updatePush : updatePush
};