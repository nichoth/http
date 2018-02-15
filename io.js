var request = require('request')

function Io (req) {
    function io (data, cb) {
        if (!cb) return function (_cb) {
            return io(data, _cb)
        }
        return req(data, cb)
    }

    function map (predicate, fn) {
        if (!fn) {
            return function (_fn) {
                return map(predicate, _fn)
            }
        }

        return function (cb) {
            fn(function (err, res, body) {
                cb.apply(null, predicate(err, res, body))
            })
        }
    }

    io.map = map
    return io
}

module.exports = Io(request)
module.exports.Io = Io  // this is for testing

