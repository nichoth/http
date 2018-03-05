var request = require('request')

// pass in _request just so we can test
function Io (data, cb, _request) {
    var xhr = _request || request
    if (!cb) {
        function io (_cb) {
            return Io(data, _cb)
        }
        io.map = Io.map
        return io
    }
    xhr(data, cb)
}

Io.map = function (predicate, _request) {
    function io (data, cb) {
        Io(data, function onResponse (err, res, body) {
            var res = io.predicates.reduce(function (prev, fn) {
                var res = fn.apply(fn, prev || [err, res, body])
                return res
            }, null)
            cb.apply(cb, res)
        }, _request)
    }

    addPredicate(io, predicate)

    io.map = function (_predicate) {
        addPredicate(io, _predicate)
        return io
    }

    return io
}

function addPredicate (io, fn) {
    io.predicates = io.predicates || []
    io.predicates.push(fn)
}

module.exports = Io

