'use strict';

var levels = ['info', 'warn', 'error', 'debug', 'trace'];

_.each(levels, function(level) {
   exports[level] = function(message) {
       log(message, level)
   }
});

function log(message, level) {
    Ti.API.log(level, message);
}

exports.log = log;