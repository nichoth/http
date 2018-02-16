var Io = require('../io')
var assert = require('assert')

var hello = Io({ body: 'hello' }, mockReq)
    .map(function woo (err, res, body) {
        if (err) return [err]
        return [null, body + '!!!']
    })
    .send(function (err, res) {
        assert.equal(err, null)
        assert.equal(res, 'hello world!!!')
        console.log('hello response --- ', err, res)
    })

var hey = Io({}, mockReq)
hey.send('hey', function (err, res, body) {
    assert.equal(err, null)
    assert.equal(body, 'hey world')
    console.log('hey response --- ', err, res, body)
})

// inherit from this, but override the response map
var IoChild = Io.map(function (err, res, body) {
    if (err) return [err]
    return [null, 'ok']
})

IoChild({}, mockReq)
    .send(function (err, res) {
        assert.equal(res, 'ok')
        console.log('here', err, res)
    })

// ------------------------

function mockReq (data, cb) {
    process.nextTick(function () {
        var res = data.body + ' world'
        cb(null, { body: res }, res)
    })
}

