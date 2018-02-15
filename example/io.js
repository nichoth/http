var Io = require('../io').Io
var io = Io(mockReq)
var assert = require('assert')

var myRequest = io({ body: 'hello' })
assert.equal(typeof io, 'function')

myRequest(function onResponse (err, res, body) {
    console.log('here', arguments)
})

var woo = io.map(function (err, res, body) {
    if (err) return [err]
    return [null, body + '!!!']
})

woo(myRequest)(function onResponse (err, res) {
    console.log('woo', res)
})

// ------------------------

function mockReq (data, cb) {
    process.nextTick(function () {
        var res = data.body + ' world'
        cb(null, { body: res }, res)
    })
}

