var xtend = require('xtend')
var request = require('request')

function Io (data, _request) {
    if (!(this instanceof Io)) return new Io(data, _request)
    this.reqData = data
    this.xhr = _request || request
    this._map = function noop (err, res, body) {
        return [err, res, body]
    }
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

module.exports = Io

