var test = require('tape')
var Io = require('../io')

test('io', function (t) {
    t.plan(1)
    Io({ hello: 'world' }, function (err, res, body) {
        t.equal(body.hello, 'world', 'should callback')
    }, _request)
})

test('io.map', function (t) {
    t.plan(2)
    function predicate (err, res, body) {
        return [null, { hey: body.hello }]
    }

    Io.map(predicate, _request)({ hello: 'world' }, function (err, res) {
        t.equal(res.hey, 'world', 'should map response')
    })

    var io = Io.map(predicate, _request)
        .map((err, res) => [null, { ok: res.hey }])

    io({ hello: 'world' }, function (err, res) {
        t.equal(res.ok, 'world', 'should compose multiple maps')
    })
})

// echo
function _request (data, cb) {
    process.nextTick(function () {
        cb(null, { body: data }, data)
    })
}

