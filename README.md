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
Make an http request an map the response

```js
var Io = require('../io')

// create a new function that calls the given predicates with the response
var io = Io
    .map(function (err, res, body) {
        if (err) return [err]
        return [null, body.data]
    })
    .map(function (err, res) {
        if (err) return [err]
        return [null, res.foo]
    })

io({
    url: 'example.com',
    method: 'POST',
    body: { hello: 'world' },
    json: true
}, function onResponse (err, res) {
    // the arguments here have been mapped by the predicates above
    // res === body.data.foo
})
```


