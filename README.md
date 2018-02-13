# http

A little helper for making http calls. This is a function that returns arguemnts for `request` or `xhr` that can be partially applied in useful ways.

## install

    $ npm install @nichoth/http

## example

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

