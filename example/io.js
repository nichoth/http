var Io = require('../io')
var assert = require('assert')

// pass in initial request data like headers and stuff
// you can add more to the body in the `.send` method
var hello = Io({ body: 'hello' }, mockReq)
    // map the response
    .map(function woo (err, res, body) {
        if (err) return [err]
        return [null, body + '!!!']
    })
    // this cb gets the mapped response
    .send(function (err, res) {
        assert.equal(err, null)
        assert.equal(res, 'hello world!!!')
        console.log('hello response --- ', err, res)
    })

// send a request without mapping the response
var hey = Io({}, mockReq)

// pass in data that should xtend/override the request body
// if an object is passed in it will shallow extend the existing body
// if it is a primitive value then it will override the body
hey.send('hey', function (err, res, body) {
    assert.equal(err, null)
    assert.equal(body, 'hey world')
    console.log('hey response --- ', err, res, body)
})

// inherit from Io and add a different map method to the new prototype
var IoChild = Io.map(function (err, res, body) {
    if (err) return [err]
    return [null, 'ok']
})

IoChild({}, mockReq)
    .send(function (err, res) {
        assert.equal(res, 'ok', 'should map via prototype method')
    })

IoChild({}, mockReq)
    .map(function (ree, res, body) {
        return [null, 'test']
    })
    .send(function (err, res) {
        assert.equal(res, 'test', 'should map via instance method')
    })

// ------------------------

function mockReq (data, cb) {
    process.nextTick(function () {
        var res = data.body + ' world'
        cb(null, { body: res }, res)
    })
}

