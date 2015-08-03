var channels = [''];

function set(_channels) {

    //assign channel
    if (!_.isUndefined(_channels)) {
        _channels = _channels instanceof Array ? _channels : [_channels];
        channels = channels.concat(_channels);
    }
}

function get() {
    return channels;
}

function reset() {
    channels = [''];
}

exports.set = set;
exports.get = get;
exports.reset = reset;