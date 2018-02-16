# http

A helper for making http calls. Cleanly separate request data from request IO.

## install

    $ npm install @nichoth/http

## example

### http calls as data

This is a function that returns arguments for `request` or `xhr`, and can be partially applied in helpful ways.

```js
var HttpRequest = require('../')
var assert = require('assert')

// return data that you can pass to xhr/request
var RequestData = HttpRequest({
    url: 'http://localhost:8000',
    method: 'POST',
    headers: { foo: 'bar' },
    body: { a: 'b' },
    json: true
})

// add fields to the request body, and return a new request object
var data = RequestData({ test: 'test' })
console.log(data)
assert.deepEqual(data, {
    url: 'http://localhost:8000',
    method: 'POST',
    headers: { foo: 'bar' },
    body: { a: 'b', test: 'test' },
    json: true
})

// pass in an array of path segments to add to the URL
var FooRequest = RequestData(['foo'])

// return a request with the given object added to the body
var fooData = FooRequest({ hello: 'world' })
console.log(fooData)
assert.deepEqual(fooData, {
    url: 'http://localhost:8000/foo',
    method: 'POST',
    headers: { foo: 'bar' },
    body: { a: 'b', hello: 'world' },
    json: true
})

// pass in nothing to get the request as is
var _data = FooRequest()
console.log('_data', _data)
assert.deepEqual(_data, {
    url: 'http://localhost:8000/foo',
    method: 'POST',
    headers: { foo: 'bar' },
    body: { a: 'b' },
    json: true
})
```

### IO

This part feels a bit janky, but not totally sure why. Something about the use of instances here. You wouldn't want to pass around an `io` instance, because any call to `.map` will change the response parser for any other calls to `.send` on that instance. That's ok, but maybe not the clearest thing. 

Also, what are we doing here? This is mixing two ideas. One is using an io module to handle the request data returned from `index.js`. The other is to bundle the io with the data to make things easier to consume. If we're doing the former, then we want something as small as possilbe, but for the latter we want to add lines of code if it makes it easier to consume.

```js
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
```

