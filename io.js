var xtend = require('xtend')
var inherits = require('inherits')
var request = require('request')

function Io (data, _request) {
    if (!(this instanceof Io)) return new Io(data, _request)
    this.reqData = data
    this.xhr = _request || request
}

Io.prototype._map = function noop (err, res, body) {
    return [err, res, body]
}

Io.prototype.map = function (predicate) {
    this._map = predicate
    return this
}

Io.prototype.send = function (data, cb) {
    if (typeof data === 'function') {
        cb = data
        data = null
    }

    var req = xtend(this.reqData || {}, {
        body: data && typeof data === 'object' ?
            xtend(this.reqData.body || {}, data) :
            this.reqData.body
    })
    if (data && typeof data !== 'object') req.body = data
    var self = this
    this.xhr(req, function (err, res, body) {
        cb.apply(null, self._map(err, res, body))
    })

    return this
}

Io.map = function (predicate) {
    function ExtendedIo (data, _xhr) {
        if (!(this instanceof ExtendedIo)) return new ExtendedIo(data, _xhr)
        Io.call(this, data, _xhr)
    }
    ExtendedIo.prototype._map = predicate
    inherits(ExtendedIo, Io)
    return ExtendedIo
}

module.exports = Io

